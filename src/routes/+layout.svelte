<script>
    import "../app.css";
    import { isLayoutHeaderVisible } from "$lib/stores/headerStore.js";

    let actualHeaderHeight = 0; // Will be bound to the header's clientHeight

    // Determine the padding for the main content based on header visibility and height
    let mainPaddingTop = "0px";
    const FALLBACK_HEADER_HEIGHT = "64px"; // Estimate (e.g., 4rem) for initial load if needed

    $: {
        if ($isLayoutHeaderVisible) {
            if (actualHeaderHeight > 0) {
                mainPaddingTop = `${actualHeaderHeight}px`;
            } else {
                // Fallback if header is visible but height not yet measured (e.g., initial render)
                mainPaddingTop = FALLBACK_HEADER_HEIGHT;
            }
        } else {
            mainPaddingTop = '0px';
        }
    }
</script>

{#if $isLayoutHeaderVisible}
    <header bind:clientHeight={actualHeaderHeight} transition:fly={{ y: -20, duration: 300, easing: quintOut }}>
        <nav class="main-nav">
            <div class="nav-left">
                <a href="/" class="logo">
                    <img src="logo.svg" alt="Logo">
                    Firm Foundation</a>
            </div>
            <div class="nav-right">
                <a href="/firm-foundation/basics">Christian basics</a>
                <a href="/firm-foundation/library">Library</a>
                <a href="/firm-foundation/about">About</a>
            </div>
        </nav>
    </header>
{/if}

<main style:padding-top={mainPaddingTop}>
    <slot />
</main>

<style>
    header {
        background: var(--background-2-trans);
        backdrop-filter: blur(150px);
        border-bottom: var(--border);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .main-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 10vw;
        margin: 0 auto;
    }

    .nav-left, .nav-right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 2rem;
    }

    .logo {
        color: var(--text);
        font-size: 1.5rem;
        text-decoration: none;
        font-weight: 300;
        font-family: 'Roboto';
        align-items: center;
        display: flex;
        gap: 0.5rem;
    }

    .logo img {
        height: 2rem;
    }

    .nav-right a {
        color: var(--text);
        text-decoration: none;
        font-weight: 300;
        font-family: 'Roboto';
    }

    .nav-right a:hover {
        color: var(--primary);
    }

    main {
        /* padding-top is now dynamically set via inline style */
        min-height: 100vh; /* Ensure main content area can fill viewport */
        transition: padding-top 0.3s ease-out; /* Smooth transition for content shift */
    }
</style>