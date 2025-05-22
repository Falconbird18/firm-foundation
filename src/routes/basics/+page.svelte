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
    <div class="background-image"></div>
    <div class="card">
        <h1 id="colored-header" style="margin: 0 auto;">In the beginning...</h1>
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
    </div>
    <div class="card">
        <h1 id="colored-header" style="margin: 0 auto;">The Fall</h1>
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
</section>

<style>
    .card {
        position: sticky;
        top: 2.5vh;
        box-shadow:
            0.5px 0.5px 1px 1px rgba(176, 176, 206, 0.212) inset,
            -0.5px -0.5px 1px 1px rgba(17, 17, 20, 0.37);
        border: 0.5px solid rgba(176, 176, 206, 0.37);
        background-color: var(--background-2-trans);
        backdrop-filter: blur(50px);
        border-radius: var(--primary-radius);
        height: 90vh;
        width: calc(100% - 1.5rem);
        padding: 1.5rem;
        margin-bottom: 2em;
        transition: all 0.3s ease;
        display: flex; /* Make .card a flex container */
        flex-direction: column; /* Arrange children (h1, .card-flex) vertically */
    }

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("stars.jpg");
        background-size: cover;
        background-position: center;
        -webkit-mask-image: linear-gradient(0deg, rgba(255,255,255,0.5), transparent);
        mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0.5), transparent);
    }

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
        /* width: 40vw; */
        /* margin: 1em auto; */
    }

    .card-stack {
        position: relative;
        /* display: grid;
        grid-template-rows: 1fr max-content; */
        height: 500vh;
        width: 100%;
        padding: 0 5vw;
        padding-top: 10vh;
        box-sizing: border-box;
        top: 0;
        background: linear-gradient(0, var(--secondary), var(--background));
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
