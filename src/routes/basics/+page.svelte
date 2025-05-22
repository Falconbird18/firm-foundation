<script>
    import { fly, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smoother animations
    import Quote from "$lib/components/Quote.svelte";
    import { onMount, onDestroy } from "svelte";
    import { isLayoutHeaderVisible } from "$lib/stores/headerStore.js";

    let noHeaderSectionRef; // Will hold the DOM element with id="no-header"

    const handlePageScroll = () => {
        if (noHeaderSectionRef) {
            const rect = noHeaderSectionRef.getBoundingClientRect();
            // Hide header if the 'no-header' section's top is at or above viewport top (<=0),
            // AND its bottom is still below the viewport top (>0) (i.e., it's actively at the top).
            if (rect.top <= 0 && rect.bottom > 0) {
                isLayoutHeaderVisible.set(false);
            } else {
                isLayoutHeaderVisible.set(true);
            }
        } else {
            // If this page doesn't have an element with id="no-header",
            // or it's not found, ensure layout header is visible.
            isLayoutHeaderVisible.set(true);
        }
    };

    onMount(() => {
        noHeaderSectionRef = document.getElementById("no-header");
        window.addEventListener("scroll", handlePageScroll, { passive: true });
        handlePageScroll(); // Initial check for scroll position on load

        return () => {
            window.removeEventListener("scroll", handlePageScroll);
            // When this component is destroyed (e.g., navigating away),
            // reset the header to visible. The next page/component
            // can then decide if it needs to be hidden again.
            isLayoutHeaderVisible.set(true);
        };
    });
</script>

<div class="intro-container">
    <header
        class="intro-header"
        in:fly={{ y: -50, duration: 800, easing: quintOut }}
    >
        <div class="left-text">
            <h1>Learn the basics of Christianity</h1>
            <p>
                Let's explore some foundational ideas about faith, life, and
                hope in a fun and engaging way.
            </p>
        </div>
        <img src="front.png" class="right-image" />
    </header>
</div>

<div class="page-layout">
    <nav class="sidebar">
        <ul>
            <li><a href="#creation">Creation</a></li>
            <li><a href="#the-fall">The Fall</a></li>
            <li><a href="#the-promise">The Promise</a></li>
            <li><a href="#new-hope">A New Hope</a></li>
        </ul>
    </nav>

    <main class="main-content" id="no-header">
        <section class="content-section" id="creation">
            <h1 class="colored-header">In the beginning...</h1>
            <div class="card-flex">
                <img src="creation.png" class="card-image" />
                <div class="card-text">
                    <p>
                        Genesis 1:1 says <Quote
                            quote="In the beginning God created the heavens and the earth."
                        /> Christians believe that God created the universe in 6 days
                        approximately 6,000 years ago, and that God created man in his
                        own image.
                    </p>
                    <a href="/library" class="cta-primary">Learn more</a>
                </div>
            </div>
        </section>

        <section class="content-section" id="the-fall">
            <h1 class="colored-header">The Fall</h1>
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        Genesis 1:1 says <Quote
                            quote="In the beginning God created the heavens and the earth."
                        /> Christians believe that God created the universe in 6 days
                        approximately 6,000 years ago, and that God created man in his
                        own image.
                    </p>
                    <a href="/library" class="cta-primary">Learn more</a>
                </div>
                <img src="creation.png" class="card-image" />
            </div>
        </section>

        <section class="content-section" id="the-promise">
            <h1 class="colored-header">The Promise</h1>
            <img src="creation.png" class="card-image" />
            <p class="card-text">
                Genesis 1:1 says <Quote
                    quote="In the beginning God created the heavens and the earth."
                /> Christians believe that God created the universe in 6 days approximately
                6,000 years ago, and that God created man in his own image.
            </p>
            <a href="/library" class="cta-primary">Learn more</a>
        </section>

        <section class="content-section" id="new-hope">
            <h1 class="colored-header">A New Hope</h1>
            <img src="creation.png" class="card-image" />
            <p class="card-text">
                Genesis 1:1 says <Quote
                    quote="In the beginning God created the heavens and the earth."
                /> Christians believe that God created the universe in 6 days approximately
                6,000 years ago, and that God created man in his own image.
            </p>
            <a href="/library" class="cta-primary">Learn more</a>
        </section>
    </main>
</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    .page-layout {
        padding: 0 10vw;
        display: flex;
        gap: 2rem;
        background: linear-gradient(0, var(--secondary), var(--background));
    }

    .sidebar {
        width: 15vw;
        flex-shrink: 0;
        position: sticky;
        top: 2.5vh;
        height: 90vh;
        overflow-y: auto;
        background-color: var(--background-2-trans);
        backdrop-filter: blur(50px);
        border-radius: var(--primary-radius);
        padding: 1rem;
        border: 0.25px solid rgba(176, 176, 206, 0.1);
    }

    .sidebar ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar li a {
        display: block;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: var(--text);
        border-radius: var(--primary-radius);
        transition: background-color 0.2s ease;
    }

    .sidebar li a:hover {
        background-color: var(--background-2);
    }

    .main-content {
        flex-grow: 1; /* Takes remaining space */
        padding-top: 10vh; /* Replicates old card-stack top padding */
        box-sizing: border-box;
    }

    .content-section {
        /* Formerly .card styles, adapted */
        box-shadow:
            0.5px 0.5px 1px 1px rgba(176, 176, 206, 0.212) inset,
            -0.5px -0.5px 1px 1px rgba(17, 17, 20, 0.37);
        border: 0.5px solid rgba(176, 176, 206, 0.37);
        background-color: var(--background-2-trans);
        backdrop-filter: blur(50px);
        border-radius: var(--primary-radius);
        /* height: 90vh; Removed - height will be natural */
        width: 100%; /* Takes full width of its container (.main-content padding handles spacing) */
        padding: 1.5rem;
        margin-bottom: 2em;
        transition: all 0.3s ease;
        display: flex; /* Make .card a flex container */
        flex-direction: column; /* Arrange children (h1, .card-flex) vertically */
        scroll-margin-top: 80px; /* Adjust if you have a fixed header, to prevent overlap on jump */
    }

    /* .background-image styles removed as the div is removed */

    .card-image {
        margin: 0;
        width: 45%;
        height: 100%; /* This will now be 100% of the calculated height of .card-flex */
        object-fit: cover;
        border-radius: var(--primary-radius);
    }

    .card-flex {
        margin-top: 1.5em;
        display: flex;
        width: 100%;
        flex: 1; /* Allow .card-flex to grow and fill remaining vertical space */
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
    }

    .card-text {
        width: 50%;
        text-align: justify;
        margin: 0;
    }

    .cta-primary {
        padding: 1rem 2rem;
        border-radius: var(--primary-radius);
        background: linear-gradient(45deg, var(--primary), var(--secondary));
        text-decoration: none;
        color: var(--text);
        font-family: "Roboto";
        font-weight: 300;
        font-size: 1.2rem;
        transition: all 1s ease;
    }

    .cta-primary:hover {
        background: linear-gradient(45deg, var(--secondary), var(--primary));
    }

    .intro-container {
        padding-left: 10vw;
        padding-right: 10vw;
        color: var(--text);
        overflow-x: hidden; /* Prevent horizontal scroll from animations */
    }

    .intro-header {
        margin-bottom: 3rem;
        display: flex;
        width: 100%;
        align-items: center;
    }

    .left-text {
        text-align: left;
        width: 30vw;
        padding-right: 2.5vw;
    }

    .center-text {
        text-align: center;
        width: 50vw;
        margin: 0 auto;
    }

    .right-image {
        width: 50vw;
        border-radius: var(--primary-radius);
    }

    .intro-header h1 {
        font-size: 2.8rem;
        margin-bottom: 0.5rem;
    }

    .intro-header p {
        font-size: 1.2rem;
        opacity: 0.9;
    }

    .colored-header { /* Changed from ID to class */
        background: linear-gradient(-45deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        width: fit-content;
        margin: 0 auto 1em auto; /* Added bottom margin for spacing, kept auto horizontal margins */
    }
</style>
