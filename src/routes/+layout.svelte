<script>
    import { fly, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smoother animations
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
        <nav class="main-nav" id="glass">
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

<footer>
    <div class="footer-content">
        <div class="footer-left">
            <a href="/" class="footer-logo">
                <!-- Using logo.svg from header for consistency -->
                <img src="logo.svg" alt="Firm Foundation Logo" />
                Firm Foundation
            </a>
            <p class="footer-tagline">Building lives on the truth of God&apos;s Word.</p>
            <div class="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa fa-facebook"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa fa-twitter"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa fa-instagram"></i></a>
            </div>
        </div>

        <div class="footer-right">
            <h2>Quick Links</h2>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/firm-foundation/about">About Us</a></li>
                <li><a href="/firm-foundation/basics">Christian Basics</a></li>
                <li><a href="/firm-foundation/library">Library</a></li>
                <li><a href="/firm-foundation/contact">Contact</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p class="copyright">&copy; {new Date().getFullYear()} Firm Foundation. All rights reserved.</p>
    </div>
</footer>

<style>
    footer {
        margin: 1em 10vw;
        background: var(--background);
        border-top: var(--border);
        color: var(--text);
        font-family: 'Roboto';
        padding-top: 2.5vw;
        box-sizing: border-box;
    }

    .footer-content {
        display: flex; /* Ensure this is flex */
        justify-content: space-between;
        gap: 2.5rem; /* Adjusted space between sections */
        flex-wrap: wrap; /* Allow wrapping on smaller screens */
        margin-bottom: 2rem; /* Space before footer-bottom */
        padding-bottom: 1rem;
        border-bottom: var(--border);
    }

    a {
        color: var(--text); /* Default link color */
        text-decoration: none;
        transition: color 0.2s ease;
    }

    a:hover {
        color: var(--primary); /* Hover color */
    }

    .footer-left {
        flex: 1;
        min-width: 50vw;
    }

    .footer-right {
        flex: 1;
    }

    .footer-right h2 {
        margin-top: 0;
    }

    .footer-left .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 300;
        color: var(--text); /* Ensure logo text color is correct */
        margin-bottom: 0.5rem;
    }

    .footer-left .footer-logo img {
        height: 2rem; /* Match header logo size */
        width: auto;
        border-radius: 0; /* Remove border-radius for logo */
        margin-right: 0;
    }

    .footer-tagline {
        font-size: 0.9rem;
        color: rgba(var(--text-rgb, 255, 255, 255), 0.8); /* Assuming --text is light */
        margin-bottom: 1.5rem;
    }

    .footer-social {
        display: flex;
        gap: 1rem; /* Space between social icons */
    }

    .footer-social a {
        font-size: 1.5rem; /* Size of social icons */
        color: var(--text); /* Color of icons */
    }

    .footer-social a:hover {
        color: var(--primary); /* Hover color for icons */
    }

    .footer-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-nav li {
        margin-bottom: 0.75rem; /* Space between nav links */
    }

    header {
        position: fixed;
        top: 0;
        left: 10vw;
        right: 0;
        width: 80vw;
        z-index: 100;
        margin: 1em 0;
        background: transparent;
        border-radius: var(--border-radius);
    }

    .main-nav {
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
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