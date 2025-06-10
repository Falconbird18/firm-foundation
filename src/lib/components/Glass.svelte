<!-- WebGLGlass.svelte -->
<script>
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    
    // Image mode
    export let imageUrl = ''; // URL of the image to apply the effect to. If empty and not procedural, will be transparent.

    // Procedural mode (for gradients, etc.)
    export let useProceduralBackground = false; // If true, ignores imageUrl and uses procedural settings
    export let gradientColor1 = [0.0, 0.0, 0.0, 1.0]; // RGBA for gradient start
    export let gradientColor2 = [1.0, 1.0, 1.0, 1.0]; // RGBA for gradient end
    export let gradientAngle = 0; // Angle in degrees (0 is left-to-right, 90 is bottom-to-top)

    // Shared effect properties
    export let blurAmount = 2.0; // Controls blur intensity (pixel offset)
    export let distortionAmount = 0.3; // General distortion strength
    export let edgeDistortionScale = 0.15; // How far from edge distortion applies (0-0.5, e.g., 0.1 is 10% from edge)
    export let edgeDistortionIntensity = 0.03; // Strength of edge distortion
    export let tintColor = [0.95, 0.95, 1.0, 0.15]; 

    let canvas;
    let gl;
    let program;
    let texture = null;
    let positionBuffer;
    let texCoordBuffer;
    let animationFrameId;
    let imageLoading = false;

    const vsSource = `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
            gl_Position = a_position;
            v_texCoord = a_texCoord;
        }
    `;

    const fsSource = `
        precision mediump float;
        varying vec2 v_texCoord;

        // Uniforms for image mode
        uniform sampler2D u_imageTexture; 

        // Uniforms for procedural mode
        uniform bool u_useProceduralBackground;
        uniform vec4 u_gradientColor1;
        uniform vec4 u_gradientColor2;
        uniform float u_gradientAngle; // Angle in degrees

        // Shared uniforms
        uniform vec2 u_resolution; // Canvas resolution
        uniform float u_blurAmount;
        uniform float u_distortionAmount;
        uniform float u_edgeDistortionScale;
        uniform float u_edgeDistortionIntensity;
        uniform vec4 u_tintColor;
        
        // --- Helper: Convert degrees to radians ---
        float radians(float degrees) {
            return degrees * 3.141592653589793 / 180.0;
        }

        // --- Helper: Procedural Linear Gradient ---
        vec4 getProceduralGradient(vec2 uv_coord) {
            float angleRad = -radians(u_gradientAngle); // Negative for intuitive rotation
            float s = sin(angleRad);
            float c = cos(angleRad);
            mat2 rotationMatrix = mat2(c, -s, s, c);
            vec2 rotatedUv = rotationMatrix * (uv_coord - vec2(0.5)) + vec2(0.5); // Rotate around center
            float t = rotatedUv.x; // t goes from ~0 to ~1 for left-to-right gradient after rotation
            t = clamp(t, 0.0, 1.0);
            return mix(u_gradientColor1, u_gradientColor2, t);
        }

        // --- Blur Functions ---
        // 9-tap blur for textures
        vec4 textureBlur(sampler2D tex, vec2 uv_center, vec2 texelSize, float amount) {
            vec4 color = vec4(0.0);
            if (amount < 0.1) return texture2D(tex, uv_center);
            float radius = amount * texelSize.x; 
            color += texture2D(tex, uv_center + vec2(-radius, -radius));
            color += texture2D(tex, uv_center + vec2(0.0,    -radius));
            color += texture2D(tex, uv_center + vec2(radius,  -radius));
            color += texture2D(tex, uv_center + vec2(-radius, 0.0));
            color += texture2D(tex, uv_center + vec2(0.0,     0.0)); // Center tap
            color += texture2D(tex, uv_center + vec2(radius,  0.0));
            color += texture2D(tex, uv_center + vec2(-radius, radius));
            color += texture2D(tex, uv_center + vec2(0.0,     radius));
            color += texture2D(tex, uv_center + vec2(radius,  radius));
            return color / 9.0;
        }

        // 9-tap blur for procedural backgrounds
        vec4 proceduralBlur(vec2 uv_center, vec2 texelSize, float amount) {
            vec4 color = vec4(0.0);
            if (amount < 0.1) return getProceduralGradient(uv_center);
            float radius = amount * texelSize.x;
            color += getProceduralGradient(uv_center + vec2(-radius, -radius));
            color += getProceduralGradient(uv_center + vec2(0.0,    -radius));
            color += getProceduralGradient(uv_center + vec2(radius,  -radius));
            color += getProceduralGradient(uv_center + vec2(-radius, 0.0));
            color += getProceduralGradient(uv_center + vec2(0.0,     0.0)); // Center tap
            color += getProceduralGradient(uv_center + vec2(radius,  0.0));
            color += getProceduralGradient(uv_center + vec2(-radius, radius));
            color += getProceduralGradient(uv_center + vec2(0.0,     radius));
            color += getProceduralGradient(uv_center + vec2(radius,  radius));
            return color / 9.0;
        }

        void main() {
            vec2 uv = v_texCoord;
            vec2 centered_uv = uv * 2.0 - 1.0; // UVs from -1 to 1, center is (0,0)

            // --- Distortion ---
            // Calculate distance to the nearest edge (0 at edge, 0.5 at center)
            float distToEdgeX = min(uv.x, 1.0 - uv.x);
            float distToEdgeY = min(uv.y, 1.0 - uv.y);
            float distToEdge = min(distToEdgeX, distToEdgeY); // Smallest distance to any edge

            float edgeFactor = 0.0;
            // Apply edge distortion only if scale is positive and uv is within scale from edge
            if (u_edgeDistortionScale > 0.0 && distToEdge < u_edgeDistortionScale) {
                // edgeFactor: 1 at the very edge, 0 at u_edgeDistortionScale distance from edge
                edgeFactor = 1.0 - (distToEdge / u_edgeDistortionScale);
                edgeFactor = pow(edgeFactor, 2.0); // Make effect stronger closer to the edge
            }

            // Distortion direction: radially from the center of the div
            vec2 distortionDirection = normalize(centered_uv + vec2(0.00001)); // Epsilon to avoid normalize(0,0)
            
            vec2 distortedUv = uv;

            // General distortion: a subtle wave, strength controlled by u_distortionAmount
            if (u_distortionAmount > 0.0) {
                 float waveX = sin(uv.y * 25.0 + u_distortionAmount * 10.0) * 0.005 * u_distortionAmount;
                 float waveY = cos(uv.x * 25.0 + u_distortionAmount * 10.0) * 0.003 * u_distortionAmount;
                 distortedUv.x += waveX;
                 distortedUv.y += waveY;
            }

            // Edge-specific distortion: pushes UVs to simulate refraction
            // Modulate intensity to be stronger at corners if desired, or uniform
            vec2 edgeDistortionOffset = distortionDirection * edgeFactor * u_edgeDistortionIntensity;
            distortedUv -= edgeDistortionOffset; // Subtract to "pull" texels from outside, common for refraction

            // Clamp UVs to ensure they stay within [0,1] range after distortion
            distortedUv = clamp(distortedUv, 0.0, 1.0);

            // --- Base Color Acquisition (Image or Procedural) & Blurring ---
            vec2 texelSize = vec2(1.0) / u_resolution; 
            vec4 baseColor;

            if (u_useProceduralBackground) {
                if (u_blurAmount > 0.1) {
                    baseColor = proceduralBlur(distortedUv, texelSize, u_blurAmount);
                } else {
                    baseColor = getProceduralGradient(distortedUv);
                }
            } else {
                // Make sure texture is somewhat valid (not just the placeholder if image failed to load)
                // A more robust check might involve texture dimensions if available as uniforms.
                // For simplicity, we assume if not procedural, texture is intended.
                if (u_blurAmount > 0.1) {
                    baseColor = textureBlur(u_imageTexture, distortedUv, texelSize, u_blurAmount);
                } else {
                    baseColor = texture2D(u_imageTexture, distortedUv);
                }
            }
            
            // --- Tinting ---
            gl_FragColor = vec4(mix(baseColor.rgb, u_tintColor.rgb, u_tintColor.a), baseColor.a);
        }
    `;

    function initWebGL() {
        if (!canvas) return false;
        gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
        if (!gl) {
            console.error("WebGL not supported or context creation failed!");
            return false;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return false;

        program = createProgram(gl, vs, fs);
        if (!program) return false;

        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        const texCoords = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        
        return true;
    }

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vs, fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Error linking program:', gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    }

    function loadTexture(url) {
        if (!gl || imageLoading) return;
        imageLoading = true;

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Placeholder 1x1 transparent pixel until image loads
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        
        const image = new Image();
        if (!url.startsWith('data:') && !url.startsWith('blob:')) { // Avoid crossOrigin for local/data URLs
             image.crossOrigin = "anonymous";
        }
       
        image.onload = () => {
            if (!gl) return; // Context might have been lost
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flip Y for standard image coords
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            texture = tex;
            imageLoading = false;
            requestRedraw(); 
        };
        image.onerror = () => {
            console.error("Failed to load image for texture: " + url);
            // Keep placeholder or set a default error texture
            texture = tex; // Keep placeholder
            imageLoading = false;
            requestRedraw();
        }
        image.src = url;
    }
    
    let needsRedraw = true;
    function requestRedraw() {
        needsRedraw = true;
    }

    // Reactive updates
    $: if (gl && program) { 
        // Any prop change should trigger redraw
        blurAmount, distortionAmount, edgeDistortionScale, edgeDistortionIntensity, tintColor;
        useProceduralBackground, gradientColor1, gradientColor2, gradientAngle; // Add procedural props
        requestRedraw();
    }
    $: if (imageUrl && gl && canvas) { // Check canvas as well
        loadTexture(imageUrl);
    }


    function renderLoop() {
        if (!gl || !program || !needsRedraw || imageLoading) {
            animationFrameId = requestAnimationFrame(renderLoop);
            return;
        }
        needsRedraw = false;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0); // Clear with transparent
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (!texture) { // Don't draw if texture isn't ready (even placeholder)
             animationFrameId = requestAnimationFrame(renderLoop);
             return;
        }

        gl.useProgram(program);

        const positionAttribLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        const texCoordAttribLocation = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(texCoordAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), gl.canvas.width, gl.canvas.height);
        gl.uniform1f(gl.getUniformLocation(program, "u_blurAmount"), blurAmount);
        gl.uniform1f(gl.getUniformLocation(program, "u_distortionAmount"), distortionAmount);
        gl.uniform1f(gl.getUniformLocation(program, "u_edgeDistortionScale"), edgeDistortionScale);
        gl.uniform1f(gl.getUniformLocation(program, "u_edgeDistortionIntensity"), edgeDistortionIntensity);
        gl.uniform4fv(gl.getUniformLocation(program, "u_tintColor"), tintColor);
        
        gl.uniform1i(gl.getUniformLocation(program, "u_useProceduralBackground"), useProceduralBackground);
        if (useProceduralBackground) {
            gl.uniform4fv(gl.getUniformLocation(program, "u_gradientColor1"), gradientColor1);
            gl.uniform4fv(gl.getUniformLocation(program, "u_gradientColor2"), gradientColor2);
            gl.uniform1f(gl.getUniformLocation(program, "u_gradientAngle"), gradientAngle);
        } else {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture); // Bind placeholder or loaded image
            gl.uniform1i(gl.getUniformLocation(program, "u_imageTexture"), 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(renderLoop);
    }
    
    let resizeObserver;

    onMount(() => {
        if (!initWebGL()) {
            // Fallback or error display if WebGL init fails
            canvas.parentElement.innerHTML = "<p style='color:red; text-align:center;'>WebGL Glass Effect Failed to Initialize.</p>";
            return;
        }

        // Always create a placeholder texture for the u_imageTexture uniform, even if procedural
        // to prevent WebGL errors if shader expects a sampler that's not bound.
        if (!texture) { // Initialize texture if not already done (e.g. by loadTexture)
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        }
        if (imageUrl && !useProceduralBackground) {
            loadTexture(imageUrl); // Initial load
        }
        
        resizeObserver = new ResizeObserver(entries => {
            if (!gl || !canvas) return;
            for (let entry of entries) {
                // Use devicePixelScaling for HiDPI displays
                const dpr = window.devicePixelRatio || 1;
                const displayWidth = Math.floor(entry.contentRect.width);
                const displayHeight = Math.floor(entry.contentRect.height);

                if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                    canvas.width = displayWidth * dpr;
                    canvas.height = displayHeight * dpr;
                    // canvas.style.width and height are set by CSS (100%)
                    requestRedraw();
                }
            }
        });
        if(canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
             // Initial size sync
            const parentRect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(parentRect.width * dpr);
            canvas.height = Math.floor(parentRect.height * dpr);
        }


        animationFrameId = requestAnimationFrame(renderLoop);
        requestRedraw(); // Ensure first draw

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (resizeObserver && canvas && canvas.parentElement) resizeObserver.unobserve(canvas.parentElement);
            if (gl) {
                if (program) gl.deleteProgram(program);
                if (positionBuffer) gl.deleteBuffer(positionBuffer);
                if (texCoordBuffer) gl.deleteBuffer(texCoordBuffer);
                if (texture) gl.deleteTexture(texture);
                // Force context loss for cleanup if possible/needed, or let browser handle
                const loseCtx = gl.getExtension('WEBGL_lose_context');
                if (loseCtx) loseCtx.loseContext();
            }
        };
    });
</script>

<canvas bind:this={canvas} style="width: 100%; height: 100%; display: block;"></canvas>

<!--
How to use:
Wrap this component in a div that defines its size.

**Image Mode Example:**
<div style="width: 400px; height: 300px; position: relative; border: 1px solid #ccc;">
    <Glass
        imageUrl="https://source.unsplash.com/random/400x300?nature"
        blurAmount={3}
        distortionAmount={0.2}
        edgeDistortionScale={0.1}
        edgeDistortionIntensity={0.04}
        tintColor={[0.85, 0.85, 0.9, 0.2]}
    />
</div>

**Procedural Gradient Mode Example:**
<div style="width: 400px; height: 300px; position: relative; border: 1px solid #ccc; background: #333;">
    <Glass
        useProceduralBackground={true}
        gradientColor1={[0.2, 0.2, 0.8, 1.0]}
        gradientColor2={[0.8, 0.2, 0.2, 1.0]}
        gradientAngle={45}
        blurAmount={5}
        tintColor={[1.0, 1.0, 1.0, 0.1]}
    />
    <div style="position: absolute; top: 20px; left: 20px; color: #fff; text-shadow: 1px 1px 2px black;">
        Overlay Content
    </div>
</div>

**Important Considerations for Replacing `backdrop-filter`:**
1.  **Content Source:**
    *   **Image Mode:** Applies effects to the image specified by `imageUrl`.
    *   **Procedural Mode:** Generates a linear gradient (defined by `gradientColor1`, `gradientColor2`, `gradientAngle`) and applies effects to it.
    *   This component does **not** automatically capture and use arbitrary DOM content rendered *behind* its div in the way CSS `backdrop-filter` does.

2.  **Replacing `backdrop-filter` over Gradients:**
    *   If you have an element using `backdrop-filter` over a static CSS gradient (like your `.sidebar` or `#gform` in `basics/+page.svelte`), you can now use this component in `proceduralBackground` mode. You'll need to configure `gradientColor1`, `gradientColor2`, and `gradientAngle` to match the CSS gradient you want to replicate "through" the glass. The `tintColor` prop can then simulate the `background-color` of the glass element itself.

3.  **Arbitrary DOM Content:**
    *   To blur arbitrary, dynamic DOM content that scrolls or changes behind an element (e.g., a fixed header blurring page content), this WebGL component is **not** a direct replacement for CSS `backdrop-filter`. Achieving that effect would require a much more complex setup, potentially involving rendering parts of your page to an offscreen canvas/texture and feeding that into WebGL, which has significant performance and complexity implications.

4.  **Performance:**
    *   The 9-tap blur, especially in procedural mode (where the gradient function is called multiple times per pixel), can be performance-intensive. Test thoroughly, especially on less powerful devices.

In summary, this enhanced component offers more flexibility by adding a procedural gradient background option, making it suitable for replacing `backdrop-filter` in specific scenarios where the "background" is a known gradient. For blurring truly arbitrary DOM content, CSS `backdrop-filter` remains the most straightforward and optimized solution.
-->
