<script>
    import { fly, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smoother animations
    import Quote from "$lib/components/Quote.svelte";
    import { onMount, onDestroy } from "svelte";
    import { isLayoutHeaderVisible } from "$lib/stores/headerStore.js";

    const SCROLL_TARGET_OFFSET = 80; // Should match .content-section scroll-margin-top

    let noHeaderSectionRef; // Will hold the DOM element with id="no-header"
    let activeSectionId = ""; // Holds the ID of the currently active section for sidebar

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
        const sections = Array.from(
            document.querySelectorAll(".main-content .content-section"),
        );

        window.addEventListener("scroll", handlePageScroll, { passive: true });
        handlePageScroll(); // Initial check for scroll position on load

        if (sections.length > 0) {
            // Set initial active section if one is at the top, otherwise default to first
            // The observer will quickly correct this if needed.
            const firstSectionRect = sections[0].getBoundingClientRect();
            if (
                firstSectionRect.top <= SCROLL_TARGET_OFFSET + 5 &&
                firstSectionRect.top >= SCROLL_TARGET_OFFSET - 5
            ) {
                activeSectionId = sections[0].id;
            } else if (
                firstSectionRect.top < SCROLL_TARGET_OFFSET &&
                firstSectionRect.bottom > SCROLL_TARGET_OFFSET
            ) {
                activeSectionId = sections[0].id;
            } else if (window.scrollY === 0) {
                activeSectionId = sections[0].id;
            }
        }

        const observerOptions = {
            root: null, // relative to viewport
            rootMargin: `-${SCROLL_TARGET_OFFSET}px 0px -${window.innerHeight - SCROLL_TARGET_OFFSET - 1}px 0px`,
            threshold: 0.0, // Trigger if any part of the element crosses this 1px "tripwire"
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSectionId = entry.target.id;
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions,
        );
        sections.forEach((section) => observer.observe(section));

        return () => {
            window.removeEventListener("scroll", handlePageScroll);
            observer.disconnect();
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
            <li>
                <a
                    href="#creation"
                    class:active={activeSectionId === "creation"}>Creation</a
                >
            </li>
            <li>
                <a
                    href="#the-fall"
                    class:active={activeSectionId === "the-fall"}>The Fall</a
                >
            </li>
            <li>
                <a
                    href="#the-promise"
                    class:active={activeSectionId === "the-promise"}
                    >The Promise</a
                >
            </li>
            <li>
                <a
                    href="#new-hope"
                    class:active={activeSectionId === "new-hope"}>A New Hope</a
                >
            </li>
        </ul>
    </nav>

    <main class="main-content" id="no-header">
        <section class="content-section" id="creation">
            <h1 class="colored-header">In the beginning...</h1>
            <img src="creation.png" class="card-image" />
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        Genesis 1:1 says <Quote
                            quote="In the beginning God created the heavens and the earth."
                        /> Christians believe that God created the universe in 6
                        days approximately 6,000 years ago, and that God created
                        man in his own image.
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
                        /> Christians believe that God created the universe in 6
                        days approximately 6,000 years ago, and that God created
                        man in his own image.
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
        position: relative; /* For positioning the ::after pseudo-element */
        display: block;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: var(--text);
        border-radius: var(--primary-radius);
        transition: background-color 0.2s ease;
    }

    .sidebar li a.active::after {
        content: "";
        position: absolute;
        bottom: -0.33rem;
        left: 0;
        width: 100%;
        height: 2px;
        border-radius: var(--primary-radius);
        background: linear-gradient(45deg, var(--primary), var(--secondary));
    }

    .sidebar li a:hover {
        background-color: var(--background-2);
    }

    .main-content {
        flex-grow: 1;
        box-sizing: border-box;
    }

    .content-section {
        width: 100%;
        height: fit-content;
        margin-bottom: 2em;
        display: flex; /* Make .card a flex container */
        flex-direction: column; /* Arrange children (h1, .card-flex) vertically */
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

    .colored-header {
        /* Changed from ID to class */
        background: linear-gradient(-45deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        width: fit-content;
    }
</style>
