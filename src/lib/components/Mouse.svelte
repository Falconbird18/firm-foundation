<!-- /home/austin/Documents/religion/firm-foundation/src/lib/components/MouseFollower.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';

    let x = 0;
    let y = 0;
    const sphereSize = 150; // Diameter of the sphere in pixels
    let isVisible = false; // Start hidden, show on first mouse move

    function handleMouseMove(event) {
        x = event.clientX;
        y = event.clientY;
        if (!isVisible) {
            isVisible = true;
        }
    }

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });
</script>

{#if isVisible}
    <div
        class="mouse-sphere"
        style="
            left: {x - sphereSize / 2}px;
            top: {y - sphereSize / 2}px;
            width: {sphereSize}px;
            height: {sphereSize}px;
        "
    >
    </div>
{/if}

<style>
    .mouse-sphere {
        position: fixed;
        border-radius: 50%;
        /* A soft radial gradient for a sphere-like appearance */
        background: radial-gradient(circle at 30% 30%, 
            hsla(217, 89%, 85%, 0.7), /* Lighter part of your primary color, more opaque */
            hsl(var(--primary-hsl), 0.5),
            hsla(217, 89%, 40%, 0.1)  /* Darker, more transparent edge */
        );
        pointer-events: none; /* Allows clicks to pass through */
        z-index: -5; /* Positioned behind most content, including glass elements' backgrounds */
        will-change: left, top; /* Hint for browser performance */
        /* Optional: add a subtle transition for smoother movement, can feel slightly laggy */
        /* transition: left 0.05s linear, top 0.05s linear; */
    }
</style>
