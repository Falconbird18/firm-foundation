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

<section class="card-stack" id="no-header">
    <div class="card">
        <h1 id="colored-header" style="margin: 0 auto;">In the beginning...</h1>
        <img src="creation.png" class="card-image" />
        <p class="card-text">
            Genesis 1:1 says <Quote
                quote="In the beginning God created the heavens and the earth."
            /> Christians believe that God created the universe in 6 days approximately
            6,000 years ago, and that God created man in his own image.
        </p>
        <a href="/library" class="cta-primary">Learn more</a>
    </div>
    <div class="card">
        <h1 id="colored-header" style="margin: 0 auto;">In the beginning...</h1>
        <img src="creation.png" class="card-image" />
        <p class="card-text">
            Genesis 1:1 says <Quote
                quote="In the beginning God created the heavens and the earth."
            /> Christians believe that God created the universe in 6 days approximately
            6,000 years ago, and that God created man in his own image.
        </p>
        <a href="/library" class="cta-primary">Learn more</a>
    </div>
    <div class="card">
        <h1 id="colored-header" style="margin: 0 auto;">In the beginning...</h1>
        <img src="creation.png" class="card-image" />
        <p class="card-text">
            Genesis 1:1 says <Quote
                quote="In the beginning God created the heavens and the earth."
            /> Christians believe that God created the universe in 6 days approximately
            6,000 years ago, and that God created man in his own image.
        </p>
        <a href="/library" class="cta-primary">Learn more</a>
    </div>
    <div class="card">Journey begins</div>
    <div class="card">Unveil the secrets</div>
    <div class="card">Discover your path</div>
    <div class="card">Celebrate the moments</div>
    <div class="card">Unlock the potential</div>
    <div class="card">Embrace the adventure</div>
</section>

<style>
    .card {
        position: sticky;
        top: 5vh;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
        background-color: var(--background-2);
        border-radius: var(--primary-radius);
        height: 90vh;
        width: calc(90vw - 1.5rem);
        padding: 1.5rem;
        margin-bottom: 2em;
        transition: all 0.3s ease;
    }

    .card-image {
        margin: 0 auto;
        margin-top: 1.5em;
        width: 100%;
        border-radius: var(--primary-radius);
    }

    .card-stack {
        position: relative;
        display: grid;
        grid-template-rows: 1fr max-content;
        height: 500vh;
        width: 90vw;
        padding: 0 5vw;
        top: 0;
        background: linear-gradient(0, var(--secondary), var(--background));
    }

    .card-text {
        width: 40vw;
        margin: 1em auto;
        text-align: justify;
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

    .card.stuck {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Add a box shadow effect */
        background-color: red;
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

    #colored-header {
        background: linear-gradient(-45deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        width: fit-content;
    }
</style>
