<script>
    import { onMount, onDestroy } from 'svelte';
    import ArticleTitle from "$lib/components/ArticleTitle.svelte";
    import QuickAnswer from "$lib/components/QuickAnswer.svelte";
    import BibleVerseHover from "$lib/components/BibleVerseHover.svelte";

    let introVideoElement;
    let loopingVideoElement;

    const introVideoFile = "intro-video.webm"; // Video to play once
    const loopingVideoFile = "repeating-video.webm"; // Video to play on repeat after the intro

    let introEndedListener = null;

    onMount(() => {
        if (introVideoElement && loopingVideoElement) {
            // Configure and start loading the looping video in the background
            loopingVideoElement.src = loopingVideoFile;
            loopingVideoElement.loop = true;
            loopingVideoElement.muted = true; // Essential for autoplay and consistency
            loopingVideoElement.load(); // Explicitly tell the browser to start loading

            // Configure the intro video
            introVideoElement.src = introVideoFile;
            introVideoElement.muted = true; // autoplay requires muted
            // `autoplay` attribute is on the tag, but an explicit play() can be a fallback
            introVideoElement.play().catch(error => {
                console.error("Error attempting to play intro video:", error);
            });

            const switchToLoopingVideo = () => {
                introVideoElement.style.display = 'none';
                loopingVideoElement.style.display = 'block';
                loopingVideoElement.play().catch(error => console.error("Error playing looping video:", error));
            };

            // Store listener for cleanup
            introEndedListener = switchToLoopingVideo;
            introVideoElement.addEventListener('ended', introEndedListener, { once: true });
        }

        return () => {
            // Cleanup event listener
            if (introVideoElement && introEndedListener) {
                introVideoElement.removeEventListener('ended', introEndedListener);
            }
            // Optional: pause videos if they might still be playing
            if (introVideoElement) {
                introVideoElement.pause();
            }
            if (loopingVideoElement) {
                loopingVideoElement.pause();
            }
        }
    });
</script>

<div class="hero">
    <!-- Intro Video -->
    <video bind:this={introVideoElement} autoplay muted class="hero-video-background">
        <!-- src will be set by script -->
        Your browser does not support the video tag.
    </video>

    <!-- Looping Video (initially hidden) -->
    <video bind:this={loopingVideoElement} loop muted class="hero-video-background" style="display:none;">
        <!-- src will be set by script, loop and muted attributes are set -->
        Your browser does not support the video tag.
    </video>
    <div class="hero-content">
        <h1>Build Your Faith on Solid Ground</h1>
        <p>
            Explore deep theological truths with clear, biblical answers to
            life's biggest questions
        </p>
        <div class="cta-buttons">
            <!-- Consider making these buttons slightly more prominent if the video is busy -->
            <a href="/library" class="cta-primary">Browse Articles</a>
            <a href="/about" class="cta-secondary">Learn More</a>
        </div>
    </div>
</div>

<section class="featured-articles">
    <h2>Popular Articles</h2>
    <div class="article-grid">
        <a href="firm-foundation/library/is-jesus-god" class="article-card">
            <h3>Is Jesus Really God?</h3>
            <p>Explore the biblical evidence for the deity of Christ</p>
        </a>
        <a
            href="firm-foundation/library/bible-reliability"
            class="article-card"
        >
            <h3>Is the Bible Reliable?</h3>
            <p>
                Discover the historical and textual evidence for the Bible's
                reliability
            </p>
        </a>
        <a href="firm-foundation/library/trinity" class="article-card">
            <h3>Understanding the Trinity</h3>
            <p>Learn about the nature of God as three persons in one being</p>
        </a>
    </div>
</section>

<div class="text-container">
    <ArticleTitle title="Is Jesus really God?" />
    <QuickAnswer
        answer="Yes, Jesus is fully God and fully man, the second person of the Trinity."
    />
    <p>
        Is Jesus really God? Many people, including Muslims, do not believe that
        Jesus is God. Either they say he was a great moral teacher or, as
        Muslims believe, he was just a powerful angle. There are several
        arguments that people use to claim that Jesus is not God. Here are some
        of the most common ones:
    </p>

    <ol>
        <li>
            <b>Jesus Never Explicitly Said "I Am God"</b> – Some, mainly Muslims,
            argue that Jesus never directly claimed to be God in the way that would
            remove all ambiguity and doubt, which lead to debates about his divine
            nature.
        </li>
        <li>
            <b>The bible calls many people "sons of God"</b> – Some argue that Jesus
            says that because the Bible uses the term "son of God" to refer to many
            people, it can't be referring to Jesus alone as God. They argue that
            the term "son of God" is just a description of an individual who trusts
            in God.
        </li>
        <li>
            <b>Jesus Had Limited Knowledge</b> – In <BibleVerseHover
                reference="Mark 13:32"
                text="But about that day or hour no one knows, not even the angels in heaven, nor the Son, but the Father alone."
                position="bottom"
            />, Jesus states that only the Father knows the timing of certain
            future events, implying that he lacks omniscience, which is an
            attribute of God.
        </li>
        <li>
            <b>Jesus Said the Father is Greater Than Him</b> – In <BibleVerseHover
                reference="John 14:28"
                text="You heard that I said to you, ‘I am going away, and I am coming to you.’ If you loved Me, you would have rejoiced because I am going to the Father, for the Father is greater than I."
                position="bottom"
            />, Jesus says, "The Father is greater than I," which some take as
            proof that Jesus is subordinate to God rather than being God
            himself.
        </li>
        <li>
            <b>Jesus Prayed to God</b> – Critics argue that if Jesus were truly
            God, he wouldn't need to pray. In passages like <BibleVerseHover
                reference="Luke 22:42"
                text="saying, “Father, if You are willing, remove this cup from Me; yet not My will, but Yours be done.”"
                position="bottom"
            />, Jesus prays to the Father, which some interpret as evidence that
            he is distinct from God and therefore not God himself.
        </li>

        <li>
            <b>Jesus could not be both God and man</b> – Since Jesus was raised from
            the dead by God's power, some believe this indicates that he was not
            God himself but rather a servant of God.
        </li>

        <li>
            <b>Jesus is Called the Son of God, Not God</b> – Some point out that
            Jesus is frequently referred to as the "Son of God" rather than God himself,
            suggesting a distinction between him and the Father.
        </li>

        <li>
            <b>Jesus Died on the Cross</b> – Since God is eternal and cannot die,
            some argue that Jesus' death proves he was not God.
        </li>
    </ol>
</div>

<style>
    .hero {
        position: relative;
        height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
        background: var(--background);
    }

    .hero-video-background {
        position: absolute;
        width: 100%;
        height: 100vh;
        object-fit: cover;
        background-color: transparent;
    }

    .hero-content {
        position: relative; /* Ensures content stays on top of the video */
        z-index: 1;
        max-width: 800px;
    }

    .hero h1 {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
    }

    .hero p {
        font-size: 1.5rem;
        color: var(--text);
        margin-bottom: 2rem;
        opacity: 0.9;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .cta-primary,
    .cta-secondary {
        padding: 1rem 2rem;
        border-radius: var(--primary-radius);
        text-decoration: none;
        color: var(--text);
        font-family: "Roboto";
        font-weight: 300;
        font-size: 1.2rem;
        transition: transform 0.2s;
    }

    .cta-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
    }

    .cta-secondary {
        background: var(--background-3);
        color: var(--text);
    }

    .cta-primary:hover,
    .cta-secondary:hover {
        transform: translateY(-2px);
    }

    .featured-articles {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .featured-articles h2 {
        text-align: center;
        margin-bottom: 3rem;
        color: var(--text);
    }

    .article-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .article-card {
        background: var(--background-2);
        padding: 2rem;
        border-radius: var(--secondary-radius);
        text-decoration: none;
        transition: transform 0.2s;
    }

    .article-card:hover {
        transform: translateY(-4px);
    }

    .article-card h3 {
        color: var(--primary);
        margin: 0 0 1rem 0;
    }

    .article-card p {
        color: var(--text);
        margin: 0;
        opacity: 0.9;
    }

    .text-container {
        width: 55vw;
        text-align: justify;
        margin-left: 20vw;
        margin-right: 20vw;
    }
</style>
