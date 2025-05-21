<script>
    import "../app.css";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { isLayoutHeaderVisible } from "$lib/stores/headerStore.js";
    import { fly } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smooth animation

    let isSidebarOpen = false;
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
                <button class="menu-button" on:click={() => (isSidebarOpen = !isSidebarOpen)}>
                    <span class="menu-icon"></span>
                </button>
                <a href="/" class="logo">Firm Foundation</a>
            </div>
            <div class="nav-right">
                <a href="/firm-foundation/basics">Christian basics</a>
                <a href="/firm-foundation/library">Library</a>
                <a href="/firm-foundation/about">About</a>
            </div>
        </nav>
    </header>
{/if}

<Sidebar isOpen={isSidebarOpen} />

<main style:padding-top={mainPaddingTop}>
    <slot />
</main>

<style>
    header {
        background: var(--background-2);
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
        padding: 1rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .nav-left, .nav-right {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        color: var(--primary);
        font-size: 1.5rem;
        text-decoration: none;
        font-weight: 300;
        font-family: 'Roboto';
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

    .menu-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
    }

    .menu-icon {
        display: block;
        width: 24px;
        height: 2px;
        background: var(--text);
        position: relative;
    }

    .menu-icon::before,
    .menu-icon::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 2px;
        background: var(--text);
        left: 0;
    }

    .menu-icon::before {
        top: -8px;
    }

    .menu-icon::after {
        bottom: -8px;
    }

    main {
        /* padding-top is now dynamically set via inline style */
        min-height: 100vh; /* Ensure main content area can fill viewport */
        transition: padding-top 0.3s ease-out; /* Smooth transition for content shift */
    }
</style>