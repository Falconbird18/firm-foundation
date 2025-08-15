<script>
  import { onMount, afterUpdate } from 'svelte';

  export let text = "Button";
  export let size = 48;
  export let onClick = null;
  export let type = "rounded"; // "rounded", "circle", or "pill"
  export let warp = false; // Center warping disabled by default
  export let tintOpacity = 0.2;

  let buttonElement;
  let textElement;
  let canvasElement;
  let gl;
  let gl_refs = {};
  let webglInitialized = false;
  export let parent = null; // Will be set if added to container
  let isNestedGlass = false;
  let borderRadius = size;
  let width = 0;
  let height = 0;

  // Svelte reactive declarations
  $: fontSize = parseInt(size);
  $: setSizeFromText(text, fontSize, type);
  $: updateBorderRadius(borderRadius);

  function updateBorderRadius(newBorderRadius) {
    if (buttonElement) {
      buttonElement.style.borderRadius = `${newBorderRadius}px`;
    }
    if (canvasElement) {
      canvasElement.style.borderRadius = `${newBorderRadius}px`;
    }
    if (gl_refs.borderRadiusLoc && gl) {
      gl.uniform1f(gl_refs.borderRadiusLoc, newBorderRadius);
    }
  }

  onMount(() => {
    createTextElement();
    setupClickHandler();
  });

  afterUpdate(() => {
    //setupClickHandler();
  });

  function setSizeFromText(text, fontSize, type) {
    if (!buttonElement) return;

    let width, height;

    // Handle different button types
    if (type === "circle") {
      // For circles, use 2.5x the fontSize for both dimensions
      const circleSize = fontSize * 2.5;
      width = circleSize;
      height = circleSize;
      borderRadius = circleSize / 2; // 50% for perfect circle

      // Force exact square dimensions for circles
      buttonElement.style.width = width + "px";
      buttonElement.style.height = height + "px";
      buttonElement.style.minWidth = width + "px";
      buttonElement.style.minHeight = height + "px";
      buttonElement.style.maxWidth = width + "px";
      buttonElement.style.maxHeight = height + "px";

      if (gl_refs.gl) {
          gl_refs.gl.viewport(0, 0, width, height);
          gl_refs.gl.uniform2f(gl_refs.resolutionLoc, width, height);
          gl_refs.gl.uniform1f(
            gl_refs.borderRadiusLoc,
            borderRadius,
          );
        }
    } else if (type === "pill") {
      // For pill buttons, calculate height first, then set border radius to half height for true capsule shape
      const textMetrics = measureText(text, fontSize);
      width = Math.ceil(textMetrics.width + fontSize * 2);
      height = Math.ceil(fontSize + fontSize * 1.2); // Slightly less padding for pills
      borderRadius = height / 2; // Half height for perfect capsule proportions
      buttonElement.style.minWidth = width + "px";
      buttonElement.style.minHeight = height + "px";
      if (gl_refs.gl) {
          gl_refs.gl.viewport(0, 0, width, height);
          gl_refs.gl.uniform2f(gl_refs.resolutionLoc, width, height);
          gl_refs.gl.uniform1f(
            gl_refs.borderRadiusLoc,
            borderRadius,
          );
        }
    } else {
      // For rounded buttons, calculate dimensions from text
      const textMetrics = measureText(text, fontSize);
      width = Math.ceil(textMetrics.width + fontSize * 2);
      height = Math.ceil(fontSize + fontSize * 1.5);
      borderRadius = fontSize;
      buttonElement.style.minWidth = width + "px";
      buttonElement.style.minHeight = height + "px";
      if (gl_refs.gl) {
          gl_refs.gl.viewport(0, 0, width, height);
          gl_refs.gl.uniform2f(gl_refs.resolutionLoc, width, height);
          gl_refs.gl.uniform1f(
            gl_refs.borderRadiusLoc,
            borderRadius,
          );
        }
    }

    // Apply border radius to element
    buttonElement.style.borderRadius = borderRadius + "px";

    // Update canvas border radius to match
    if (canvasElement) {
      canvasElement.style.borderRadius = borderRadius + "px";
    }

    // For circles and pills, set internal dimensions directly to ensure shader gets exact dimensions
    if (type === "circle") {
      this.width = width;
      this.height = height;

      // Update canvas to exact square dimensions for perfect circle rendering
      if (canvasElement) {
        canvasElement.width = width;
        canvasElement.height = height;
        canvasElement.style.width = width + "px";
        canvasElement.style.height = height + "px";

        // Update WebGL viewport if initialized
        if (gl_refs.gl) {
          gl_refs.gl.viewport(0, 0, width, height);
          gl_refs.gl.uniform2f(gl_refs.resolutionLoc, width, height);
          gl_refs.gl.uniform1f(
            gl_refs.borderRadiusLoc,
            borderRadius,
          );
        }
      }
    } else if (type === "pill") {
      this.width = width;
      this.height = height;

      // Force exact pill dimensions for perfect capsule rendering
      buttonElement.style.width = width + "px";
      buttonElement.style.height = height + "px";
      buttonElement.style.maxWidth = width + "px";
      buttonElement.style.maxHeight = height + "px";

      if (canvasElement) {
        canvasElement.width = width;
        canvasElement.height = height;
        canvasElement.style.width = width + "px";
        canvasElement.style.height = height + "px";

        // Update WebGL viewport if initialized
        if (gl_refs.gl) {
          gl_refs.gl.viewport(0, 0, width, height);
          gl_refs.gl.uniform2f(gl_refs.resolutionLoc, width, height);
          gl_refs.gl.uniform1f(
            gl_refs.borderRadiusLoc,
            borderRadius,
          );
        }
      }
    } else {
      // Update size from DOM after CSS applies
      //updateSizeFromDOM();
    }
  }

  export function setupAsNestedGlass() {
    if (parent && !isNestedGlass) {
      isNestedGlass = true;
      // Reinitialize with nested glass shader when parent is ready
      if (webglInitialized) {
        initWebGL();
      }
    }
  }

  function measureText(text, fontSize) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    return ctx.measureText(text);
  }

  function createTextElement() {
    //textElement = document.createElement("div");
    //textElement.className = "glass-button-text";
    //textElement.textContent = text;
    //textElement.style.fontSize = fontSize + "px";

    //buttonElement.appendChild(textElement);
  }

  function setupClickHandler() {
    if (onClick && buttonElement) {
      buttonElement.addEventListener("click", (e) => {
        e.preventDefault();
        onClick(text);
      });
    }
  }

  // Override initWebGL to choose between standalone and nested glass
  function initWebGL() {
    //if (!Container.pageSnapshot || !gl) return;

    //if (parent && isNestedGlass) {
    //  // Use nested glass (parent container's texture)
    //  initNestedGlass();
    //} else {
    //  // Use standalone glass (page snapshot)
    //  super.initWebGL();
    //}
  }

  function initNestedGlass() {
    //if (!parent.webglInitialized) {
    //  // Parent not ready, wait and try again
    //  setTimeout(() => initNestedGlass(), 100);
    //  return;
    //}

    //// Parent is ready, set up nested glass
    //setupDynamicNestedShader();
    //webglInitialized = true;
  }

  function setupDynamicNestedShader() {
    const gl = gl;

    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texcoord;
      varying vec2 v_texcoord;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texcoord = a_texcoord;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform vec2 u_textureSize;
      uniform float u_blurRadius;
      uniform float u_borderRadius;
      uniform vec2 u_buttonPosition;
      uniform vec2 u_containerPosition;
      uniform vec2 u_containerSize;
      uniform float u_warp;
      uniform float u_edgeIntensity;
      uniform float u_rimIntensity;
      uniform float u_baseIntensity;
      uniform float u_edgeDistance;
      uniform float u_rimDistance;
      uniform float u_baseDistance;
      uniform float u_cornerBoost;
      uniform float u_rippleEffect;
      uniform float u_tintOpacity;
      varying vec2 v_texcoord;

      // Function to calculate distance from rounded rectangle edge
      float roundedRectDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = size * 0.5;
        vec2 pixelCoord = coord * size;
        vec2 toCorner = abs(pixelCoord - center) - (center - radius);
        float outsideCorner = length(max(toCorner, 0.0));
        float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
        return (outsideCorner + insideCorner - radius);
      }

      // Function to calculate distance from circle edge (negative inside, positive outside)
      float circleDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = vec2(0.5, 0.5);
        vec2 pixelCoord = coord * size;
        vec2 centerPixel = center * size;
        float distFromCenter = length(pixelCoord - centerPixel);
        return distFromCenter - radius;
      }

      // Check if this is a pill (border radius is approximately 50% of height AND width > height)
      bool isPill(vec2 size, float radius) {
        float heightRatioDiff = abs(radius - size.y * 0.5);
        bool radiusMatchesHeight = heightRatioDiff < 2.0;
        bool isWiderThanTall = size.x > size.y + 4.0; // Must be significantly wider
        return radiusMatchesHeight && isWiderThanTall;
      }

      // Check if this is a circle (border radius is approximately 50% of smaller dimension AND roughly square)
      bool isCircle(vec2 size, float radius) {
        float minDim = min(size.x, size.y);
        bool radiusMatchesMinDim = abs(radius - minDim * 0.5) < 1.0;
        bool isRoughlySquare = abs(size.x - size.y) < 4.0; // Width and height are similar
        return radiusMatchesMinDim && isRoughlySquare;
      }

      // Function to calculate distance from pill edge (capsule shape)
      float pillDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = size * 0.5;
        vec2 pixelCoord = coord * size;

        // Proper capsule: line segment with radius
        // The capsule axis runs horizontally from (radius, center.y) to (size.x - radius, center.y)
        vec2 capsuleStart = vec2(radius, center.y);
        vec2 capsuleEnd = vec2(size.x - radius, center.y);

        // Project point onto the capsule axis (line segment)
        vec2 capsuleAxis = capsuleEnd - capsuleStart;
        float capsuleLength = length(capsuleAxis);

        if (capsuleLength > 0.0) {
          vec2 toPoint = pixelCoord - capsuleStart;
          float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
          vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
          return length(pixelCoord - closestPointOnAxis) - radius;
        } else {
          // Degenerate case: just a circle
          return length(pixelCoord - center) - radius;
        }
      }

      void main() {
        vec2 coord = v_texcoord;

        // Calculate button position within container space
        vec2 buttonSize = u_resolution;
        vec2 containerSize = u_containerSize;

        // Convert screen positions to container-relative coordinates
        // Container position is center, convert to top-left
        vec2 containerTopLeft = u_containerPosition - containerSize * 0.5;
        vec2 buttonTopLeft = u_buttonPosition - buttonSize * 0.5;

        // Get button's position relative to container's top-left
        vec2 buttonRelativePos = buttonTopLeft - containerTopLeft;

        // Current pixel position within the button (0 to buttonSize)
        vec2 buttonPixel = coord * buttonSize;

        // Absolute pixel position in container space
        vec2 containerPixel = buttonRelativePos + buttonPixel;

        // Convert to texture coordinates (0 to 1)
        vec2 baseTextureCoord = containerPixel / containerSize;

        // BUTTON'S SOPHISTICATED GLASS EFFECTS on top of container's glass
        float distFromEdgeShape;
        vec2 shapeNormal; // Normal vector pointing away from shape surface

        if (isPill(u_resolution, u_borderRadius)) {
          distFromEdgeShape = -pillDistance(coord, u_resolution, u_borderRadius);

          // Calculate normal for pill shape
          vec2 center = vec2(0.5, 0.5);
          vec2 pixelCoord = coord * u_resolution;
          vec2 capsuleStart = vec2(u_borderRadius, center.y * u_resolution.y);
          vec2 capsuleEnd = vec2(u_resolution.x - u_borderRadius, center.y * u_resolution.y);
          vec2 capsuleAxis = capsuleEnd - capsuleStart;
          float capsuleLength = length(capsuleAxis);

          if (capsuleLength > 0.0) {
            vec2 toPoint = pixelCoord - capsuleStart;
            float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
            vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
            vec2 normalDir = pixelCoord - closestPointOnAxis;
            shapeNormal = length(normalDir) > 0.0 ? normalize(normalDir) : vec2(0.0, 1.0);
          } else {
            shapeNormal = normalize(coord - center);
          }
        } else if (isCircle(u_resolution, u_borderRadius)) {
          distFromEdgeShape = -circleDistance(coord, u_resolution, u_borderRadius);
          vec2 center = vec2(0.5, 0.5);
          shapeNormal = normalize(coord - center);
        } else {
          distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
          vec2 center = vec2(0.5, 0.5);
          shapeNormal = normalize(coord - center);
        }
        distFromEdgeShape = max(distFromEdgeShape, 0.0);

        float distFromLeft = coord.x;
        float distFromRight = 1.0 - coord.x;
        float distFromTop = coord.y;
        float distFromBottom = 1.0 - coord.y;
        float distFromEdge = distFromEdgeShape / min(u_resolution.x, u_resolution.y);

        // MULTI-LAYER BUTTON GLASS REFRACTION using shape-aware normal
        float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);
        float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
        float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
        float rimIntensity = exp(-normalizedDistance * u_rimDistance);

        // Apply center warping only if warp is enabled, keep edge and rim effects always
        float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
        float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;

        vec2 baseRefraction = shapeNormal * totalIntensity;

        // Corner enhancement for buttons
        float cornerProximityX = min(distFromLeft, distFromRight);
        float cornerProximityY = min(distFromTop, distFromBottom);
        float cornerDistance = max(cornerProximityX, cornerProximityY);
        float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);

        float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
        vec2 cornerRefraction = shapeNormal * cornerBoost;

        // Button ripple texture
        vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
        float rippleEffect = sin(distFromEdge * 30.0) * u_rippleEffect * rimIntensity;
        vec2 textureRefraction = perpendicular * rippleEffect;

        vec2 totalRefraction = baseRefraction + cornerRefraction + textureRefraction;
        vec2 textureCoord = baseTextureCoord + totalRefraction;

        // HIGH-QUALITY BUTTON BLUR on container texture
        vec4 color = vec4(0.0);
        vec2 texelSize = 1.0 / containerSize;
        float sigma = u_blurRadius / 3.0; // More substantial blur
        vec2 blurStep = texelSize * sigma;

        float totalWeight = 0.0;

        // 9x9 blur for buttons (more samples for quality)
        for(float i = -4.0; i <= 4.0; i += 1.0) {
          for(float j = -4.0; j <= 4.0; j += 1.0) {
            float distance = length(vec2(i, j));
            if(distance > 4.0) continue;

            float weight = exp(-(distance * distance) / (2.0 * sigma * sigma));

            vec2 offset = vec2(i, j) * blurStep;
            color += texture2D(u_image, textureCoord + offset) * weight;
            totalWeight += weight;
          }
        }

        color /= totalWeight;

        // BUTTON'S OWN GRADIENT LAYERS (same sophistication as container)
        float gradientPosition = coord.y;

        // Primary button gradient
        vec3 topTint = vec3(1.0, 1.0, 1.0);
        vec3 bottomTint = vec3(0.7, 0.7, 0.7);
        vec3 gradientTint = mix(topTint, bottomTint, gradientPosition);
        vec3 tintedColor = mix(color.rgb, gradientTint, u_tintOpacity * 0.7);
        color = vec4(tintedColor, color.a);

        // SECOND BUTTON GRADIENT - sampling from container's texture for variation
        vec2 viewportCenter = u_buttonPosition;
        float topY = max(0.0, (viewportCenter.y - buttonSize.y * 0.4) / containerSize.y);
        float midY = viewportCenter.y / containerSize.y;
        float bottomY = min(1.0, (viewportCenter.y + buttonSize.y * 0.4) / containerSize.y);

        vec3 topColor = texture2D(u_image, vec2(0.5, topY)).rgb;
        vec3 midColor = texture2D(u_image, vec2(0.5, midY)).rgb;
        vec3 bottomColor = texture2D(u_image, vec2(0.5, bottomY)).rgb;

        vec3 sampledGradient;
        if (gradientPosition < 0.1) {
          sampledGradient = topColor;
        } else if (gradientPosition > 0.9) {
          sampledGradient = bottomColor;
        } else {
          float transitionPos = (gradientPosition - 0.1) / 0.8;
          if (transitionPos < 0.5) {
            float t = transitionPos * 2.0;
            sampledGradient = mix(topColor, midColor, t);
          } else {
            float t = (transitionPos - 0.5) * 2.0;
            sampledGradient = mix(midColor, bottomColor, t);
          }
        }

        vec3 secondTinted = mix(color.rgb, sampledGradient, u_tintOpacity * 0.4);

        // Button highlighting/shadow system
        vec3 buttonTopTint = vec3(1.08, 1.08, 1.08);
        vec3 buttonBottomTint = vec3(0.92, 0.92, 0.92);
        vec3 buttonGradient = mix(buttonTopTint, buttonBottomTint, gradientPosition);
        vec3 finalTinted = secondTinted * buttonGradient;

        // Shape mask (rounded rectangle, circle, or pill)
        float maskDistance;
        if (isPill(u_resolution, u_borderRadius)) {
          maskDistance = pillDistance(coord, u_resolution, u_borderRadius);
        } else if (isCircle(u_resolution, u_borderRadius)) {
          maskDistance = circleDistance(coord, u_resolution, u_borderRadius);
        } else {
          maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
        }
        float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);

        gl_FragColor = vec4(finalTinted, mask);
      }
    `;

    const program = createProgram(gl, vsSource, fsSource);
    if (!program) return;

    gl.useProgram(program);

    // Set up geometry (same as parent)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW,
    );

    // Get locations
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const textureSizeLoc = gl.getUniformLocation(program, "u_textureSize");
    const blurRadiusLoc = gl.getUniformLocation(program, "u_blurRadius");
    const borderRadiusLoc = gl.getUniformLocation(program, "u_borderRadius");
    const buttonPositionLoc = gl.getUniformLocation(
      program,
      "u_buttonPosition",
    );
    const containerPositionLoc = gl.getUniformLocation(
      program,
      "u_containerPosition",
    );
    const containerSizeLoc = gl.getUniformLocation(program, "u_containerSize");
    const warpLoc = gl.getUniformLocation(program, "u_warp");
    const edgeIntensityLoc = gl.getUniformLocation(program, "u_edgeIntensity");
    const rimIntensityLoc = gl.getUniformLocation(program, "u_rimIntensity");
    const baseIntensityLoc = gl.getUniformLocation(program, "u_baseIntensity");
    const edgeDistanceLoc = gl.getUniformLocation(program, "u_edgeDistance");
    const rimDistanceLoc = gl.getUniformLocation(program, "u_rimDistance");
    const baseDistanceLoc = gl.getUniformLocation(program, "u_baseDistance");
    const cornerBoostLoc = gl.getUniformLocation(program, "u_cornerBoost");
    const rippleEffectLoc = gl.getUniformLocation(program, "u_rippleEffect");
    const tintOpacityLoc = gl.getUniformLocation(program, "u_tintOpacity");
    const imageLoc = gl.getUniformLocation(program, "u_image");

    // Create texture that will be updated dynamically from container canvas
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Initialize with parent container's current canvas size
    //const containerCanvas = parent.canvas;
    //gl.texImage2D(
    //  gl.TEXTURE_2D,
    //  0,
    //  gl.RGBA,
    //  containerCanvas.width,
    //  containerCanvas.height,
    //  0,
    //  gl.RGBA,
    //  gl.UNSIGNED_BYTE,
    //  null,
    //);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Store references
    gl_refs = {
      gl,
      texture,
      textureSizeLoc,
      positionLoc,
      texcoordLoc,
      resolutionLoc,
      blurRadiusLoc,
      borderRadiusLoc,
      buttonPositionLoc,
      containerPositionLoc,
      containerSizeLoc,
      warpLoc,
      edgeIntensityLoc,
      rimIntensityLoc,
      baseIntensityLoc,
      edgeDistanceLoc,
      rimDistanceLoc,
      baseDistanceLoc,
      cornerBoostLoc,
      rippleEffectLoc,
      tintOpacityLoc,
      imageLoc,
      positionBuffer,
      texcoordBuffer,
    };

    // Set up viewport and attributes
    gl.viewport(0, 0, canvasElement.width, canvasElement.height);
    gl.clearColor(0, 0, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    gl.uniform2f(resolutionLoc, canvasElement.width, canvasElement.height);
    //gl.uniform2f(textureSizeLoc, containerCanvas.width, containerCanvas.height);
    gl.uniform1f(blurRadiusLoc, window.glassControls?.blurRadius || 5);
    gl.uniform1f(borderRadiusLoc, borderRadius);
    gl.uniform1f(warpLoc, warp ? 1.0 : 0.0);
    gl.uniform1f(edgeIntensityLoc, window.glassControls?.edgeIntensity || 1.0);
    gl.uniform1f(rimIntensityLoc, window.glassControls?.rimIntensity || 1.0);
    gl.uniform1f(baseIntensityLoc, window.glassControls?.baseIntensity || 1.0);
    gl.uniform1f(edgeDistanceLoc, window.glassControls?.edgeDistance || 1.0);
    gl.uniform1f(rimDistanceLoc, window.glassControls?.rimDistance || 1.0);
    gl.uniform1f(baseDistanceLoc, window.glassControls?.baseDistance || 1.0);
    gl.uniform1f(cornerBoostLoc, window.glassControls?.cornerBoost || 1.0);
    gl.uniform1f(rippleEffectLoc, window.glassControls?.rippleEffect || 0.0);
    gl.uniform1f(tintOpacityLoc, tintOpacity);

    // Set positions
    //const buttonPosition = getPosition();
    //const containerPosition = parent.getPosition();
    //gl.uniform2f(buttonPositionLoc, buttonPosition.x, buttonPosition.y);
    //gl.uniform2f(
    //  containerPositionLoc,
    //  containerPosition.x,
    //  containerPosition.y,
    //);
    //gl.uniform2f(containerSizeLoc, parent.width, parent.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(imageLoc, 0);

    // Start rendering
    startNestedRenderLoop();
  }

  function startNestedRenderLoop() {
    const render = () => {
      if (!gl_refs.gl || !parent) return;

      const gl = gl_refs.gl;

      // UPDATE TEXTURE FROM PARENT CONTAINER'S CURRENT RENDERED OUTPUT
      //const containerCanvas = parent.canvas;
      //gl.bindTexture(gl.TEXTURE_2D, gl_refs.texture);
      //gl.texSubImage2D(
      //  gl.TEXTURE_2D,
      //  0,
      //  0,
      //  0,
      //  gl.RGBA,
      //  gl.UNSIGNED_BYTE,
      //  containerCanvas,
      //);

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update button and container positions (in case layout changed)
      //const buttonPosition = getPosition();
      //const containerPosition = parent.getPosition();
      //gl.uniform2f(
      //  gl_refs.buttonPositionLoc,
      //  buttonPosition.x,
      //  buttonPosition.y,
      //);
      //gl.uniform2f(
      //  gl_refs.containerPositionLoc,
      //  containerPosition.x,
      //  containerPosition.y,
      //);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Render every frame to keep sampling parent's live output
    const animationLoop = () => {
      render();
      requestAnimationFrame(animationLoop);
    };

    animationLoop();

    // Store render function for external calls
    this.render = render;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
</script>

<div bind:this={buttonElement} class="glass-button" class:glass-button-circle={type === 'circle'} style="border-radius: {borderRadius}px" on:click="{setupClickHandler}">
    <canvas bind:this={canvasElement} style="border-radius: {borderRadius}px; position: absolute; top: 0; left: 0; width: 100%; height: 100%; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); z-index: -1;"></canvas>
    <div bind:this={textElement} class="glass-button-text" style="font-size: {fontSize}px">{text}</div>
</div>

<style>
  /* Glass Button Styles */
  .glass-button {
    position: relative;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    pointer-events: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box; /* Ensure padding doesn't affect size calculations */
  }

  .glass-button-circle {
    aspect-ratio: 1 / 1; /* Force perfect square ratio */
    flex-shrink: 0;
    flex-grow: 0;
  }

  .glass-button-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    pointer-events: none;
    font-weight: normal;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    white-space: nowrap;
  }
</style>
