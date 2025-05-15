<script>
    import { fly, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smoother animations
    import Quote from "$lib/components/Quote.svelte";
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

    <section class="topic-section" in:fade={{ delay: 300, duration: 800 }}>
        <div class="center-text">
            <h1 id="colored-header" style="margin: 0 auto;">In the beginning</h1>
            <p> 
                Genesis 1:1 says <Quote quote="In the beginning God created the heavens and the earth." />
                At the very heart of Christianity is the belief in one God who
                created everything. But who is this God? The Bible describes God
                as an eternal, all-powerful, all-knowing, and ever-present
                spirit. He's not limited by time or space! Christians believe
                God is perfectly loving, just, and holy. Think of the most
                brilliant artist, the wisest teacher, and the most loving parent
                you can imagine – God is all of that and infinitely more! He
                desires a real relationship with the people He created.
            </p>
            <p>
                A key Christian belief is the Trinity: that God exists as three
                distinct persons—the Father, the Son (Jesus Christ), and the
                Holy Spirit—yet is one God. This is a profound mystery, often
                illustrated imperfectly by things like water (liquid, solid,
                gas) or a three-leaf clover. It means God is a community of
                perfect love within Himself.
            </p>
        </div>
    </section>

</div>

<style>
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

    .intro-footer {
        text-align: center;
        margin-top: 4rem;
        padding: 2rem;
        background-color: var(--background-2, #fff);
        border-radius: var(--secondary-radius, 12px);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    }

    .intro-footer p {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }

    .intro-footer a {
        color: var(--primary, #007bff);
        text-decoration: none;
        font-weight: bold;
    }
    .intro-footer a:hover {
        text-decoration: underline;
    }

    .footer-image {
        max-width: 200px;
        margin-top: 1rem;
        opacity: 0.8;
    }
</style>
