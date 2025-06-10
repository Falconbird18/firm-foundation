<script>
    import { fly, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing"; // For smoother animations
    import Quote from "$lib/components/Quote.svelte";
    import BibleCitation from "$lib/components/BibleCitation.svelte";
    import { onMount, onDestroy } from "svelte";
    import { isLayoutHeaderVisible } from "$lib/stores/headerStore.js";

    const SCROLL_TARGET_OFFSET = 80; // Should match .content-section scroll-margin-top

    let noHeaderSectionRef; // Will hold the DOM element with id="no-header"
    let activeSectionId = ""; // Holds the ID of the currently active section for sidebar

    // Form state
    let formFullName = "";
    let formEmail = "";
    let formMessage = "";
    let submissionStatus = ""; // '', 'submitting', 'success', 'error'
    let showNotification = false;

    const googleFormUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSfV1RFbaoc-tBMALGae3aJvMFKIpbkaBtGoVeut5iwhhbLU_g/formResponse";
    const googleFormFullNameEntry = "entry.1933726439";
    const googleFormEmailEntry = "entry.1373301618";
    const googleFormMessageEntry = "entry.304407693";

    // Debounce timer for notification
    let notificationTimer = null;

    const handlePageScroll = () => {
        if (noHeaderSectionRef) {
            // @ts-ignore
            const rect = noHeaderSectionRef.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom > 0) {
                isLayoutHeaderVisible.set(false);
            } else {
                isLayoutHeaderVisible.set(true);
            }
        } else {
            isLayoutHeaderVisible.set(true);
        }
    };

    let emailError = "";
    let fullNameError = "";
    let messageError = "";
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
            // @ts-ignore
            const firstSectionRect = sections[0].getBoundingClientRect();
            if (
                firstSectionRect.top <= SCROLL_TARGET_OFFSET + 5 &&
                firstSectionRect.top >= SCROLL_TARGET_OFFSET - 5
            ) {
                activeSectionId = sections[0].id;
            } else if (
                // @ts-ignore
                firstSectionRect.top < SCROLL_TARGET_OFFSET &&
                firstSectionRect.bottom > SCROLL_TARGET_OFFSET
            ) {
                // @ts-ignore
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
                    // @ts-ignore
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

    function isValidEmail(email) {
        // Basic regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleSubmit() {
        emailError = ""; // Reset email error on new submission attempt
        fullNameError = ""; // Reset full name error
        messageError = ""; // Reset message error

        if (!formFullName.trim()) {
            fullNameError = "Please enter your full name.";
            // No return here yet, let all validations run to show all errors at once if desired,
            // or return early: if (fullNameError) return;
        }

        if (!formEmail || !isValidEmail(formEmail)) {
            emailError = "Please enter a valid email address.";
        }

        if (!formMessage.trim()) {
            messageError = "Please enter a message.";
        }

        submissionStatus = "submitting";
        showNotification = false; // Hide previous notification if any
        clearTimeout(notificationTimer); // Clear any existing timer

        const formData = new FormData();
        // Only proceed if all validations pass
        if (fullNameError || emailError || messageError) {
            submissionStatus = ""; // Reset submission status as we didn't actually submit
            return;
        }
        formData.append(googleFormFullNameEntry, formFullName);
        formData.append(googleFormEmailEntry, formEmail);
        formData.append(googleFormMessageEntry, formMessage);

        try {
            await fetch(googleFormUrl, {
                method: "POST",
                mode: "no-cors", // Google Forms doesn't support CORS for AJAX, so we can't read the response
                body: new URLSearchParams(formData), // Sends as application/x-www-form-urlencoded
                headers: {
                    // Though 'no-cors' limits what we can send/receive, this is good practice
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            submissionStatus = "success";
            formFullName = ""; // Clear fields
            formEmail = "";
            formMessage = "";
            emailError = ""; // Clear email error on success
            fullNameError = ""; // Clear full name error on success
            messageError = ""; // Clear message error on success
        } catch (error) {
            console.error("Form submission error:", error);
            submissionStatus = "error";
        } finally {
            showNotification = true;
            const duration = submissionStatus === "success" ? 3000 : 5000;
            notificationTimer = setTimeout(() => {
                showNotification = false;
                submissionStatus = ""; // Reset status after notification hides
            }, duration);
        }
    }

    // Reactive statement to clear email error when user types a valid email
    $: if (formEmail && emailError) {
        if (isValidEmail(formEmail)) {
            emailError = "";
        }
    }
    // Reactive statement to clear full name error when user types
    $: if (formFullName && fullNameError) {
        if (formFullName.trim()) {
            fullNameError = "";
        }
    }
    // Reactive statement to clear message error when user types
    $: if (formMessage && messageError) {
        if (formMessage.trim()) {
            messageError = "";
        }
    }
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
        <img src="intro-to-christianity.png" class="right-image" />
    </header>
</div>

<div class="page-layout" id="no-header">
    <nav class="sidebar" id="glass">
        <ul>
            <li>
                <a
                    href="#creation"
                    class:active={activeSectionId === "creation"}
                    >The Creation</a
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
                    href="#the-miracle"
                    class:active={activeSectionId === "the-miracle"}
                    >The Miracle</a
                >
            </li>
            <li>
                <a
                    href="#the-sacrifice"
                    class:active={activeSectionId === "the-sacrifice"}
                    >The Sacrifice</a
                >
            </li>
            <li>
                <a
                    href="#the-judgement"
                    class:active={activeSectionId === "the-judgement"}
                    >The Judgement</a
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
                        /> Christians believe that God the trinity created the universe
                        out of nothing in 6 regular days approximately 6,000 years
                        ago. God specialized the earth for life and created every
                        family of life.
                    </p>
                </div>
            </div>
            <div class="sub-cards-container">
                <div class="sub-card" id="glass">
                    <img src="creation.png" class="card-image" />
                    <h2>God created man</h2>
                    <p>
                        God created the first man — Adam — in his own image,
                        imbuing him with some of the characteristics of himself
                        such as love, compassion, and the ability to reason
                        <BibleCitation
                            verseRef="Genesis 1:27"
                            verseText="God created man in His own image, in the image of God He created him; male and female He created them."
                        />. God created the first woman — Eve — from Adam to be
                        a companion and joy to him.
                        <BibleCitation
                            verseRef="Genesis 2:21-22"
                            verseText="[v21]So the Lord God caused a deep sleep to fall upon the man, and he slept; then He took one of his ribs and closed up the flesh at that place. [v22] The Lord God fashioned into a woman the rib which He had taken from the man, and brought her to the man."
                        />.
                    </p>
                </div>
                <div class="sub-card" id="glass">
                    <img src="creation.png" class="card-image" />
                    <h2>The sabbath</h2>
                    <p>
                        God had finished creating the universe, and behold, it
                        was very good
                        <BibleCitation
                            verseRef="Genesis 1:31"
                            verseText="God saw all that He had made, and behold, it was very good. And there was evening and there was morning, the sixth day."
                        />, meaning that it was perfect and complete; there was
                        no evil, sin, or death. God rested on the seventh day,
                        and He blessed and sanctified it as a holy day of rest
                        <BibleCitation
                            verseRef="Genesis 2:2-3"
                            verseText={"[v2]By the seventh day God completed His work which He had done, and He rested on the seventh day from all His work which He had done. [v3]Then God blessed the seventh day and sanctified it, because in it He rested from all His work which God had created and made."}
                        />.
                    </p>
                </div>
            </div>
        </section>
        <section class="content-section" id="the-fall">
            <h1 class="colored-header">The Fall</h1>
            <img src="creation.png" class="card-image" />
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        Adam and Eve were happy. They lived in perfect harmony
                        with God and had fulfilling work to do <BibleCitation
                            verseRef="Genesis 1:28"
                            verseText={'God blessed them; and God said to them, "Be fruitful and multiply, and fill the earth, and subdue it; and rule over the fish of the sea and over the birds of the sky and over every living thing that moves on the earth."'}
                        />. However, Adam and Eve sinned and introduced death
                        and disease to the world.
                    </p>
                </div>
            </div>
            <div class="sub-cards-container">
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The first sin</h2>
                    <p>
                        Adam and Eve sinned when they ate the fruit of the tree
                        of the knowledge of good and evil
                        <BibleCitation
                            verseRef="Genesis 3:6"
                            verseText={"When the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was desirable to make _one_ wise, she took from its fruit and ate; and she gave also to her husband with her, and he ate."}
                        />, which God had commanded them not to eat
                        <BibleCitation
                            verseRef="Genesis 2:16-17"
                            verseText={'[v16]The Lord God commanded the man, saying, "From any tree of the garden you may eat freely; [v17] but from the tree of the knowledge of good and evil you shall not eat, for in the day that you eat from it you will surely die."'}
                        />
                        after they had been deceived by Satan, a fallen archangel
                        who was in the form of a snake
                        <BibleCitation
                            verseRef="Revelation 12:9"
                            verseText={"And the great dragon was thrown down, the serpent of old who is called the devil and Satan, who deceives the whole world; he was thrown down to the earth, and his angels were thrown down with him."}
                        />. By sinning, Adam and Eve disobeyed God and brought
                        death and disease into the world
                        <BibleCitation
                            verseRef="Genesis 3:17-19"
                            verseText={'[v17]Then to Adam He said, "Because you have listened to the voice of your wife, and have eaten from the tree about which I commanded you, saying, \'You shall not eat from it\'; Cursed is the ground because of you; [br] In toil you will eat of it [br] All the days of your life. [v18]"Both thorns and thistles it shall grow for you; [br] And you will eat the plants of the field; By the sweat of your face [br] You will eat bread, [br] Till you return to the ground [br] Because from it you were taken; [br] For you are dust, [br] And to dust you shall return.""'}
                            wide
                        />
                        <BibleCitation
                            verseRef="Romans 5:12"
                            verseText={"Therefore, just as through one man sin entered into the world, and death through sin, and so death spread to all men, because all sinned"}
                        />
                        and the whole of creation was affected by their sin
                        <BibleCitation
                            verseRef="Romans 8:20-22"
                            verseText={"[v20]For the creation was subjected to futility, not willingly, but because of Him who subjected it, in hope [v21] that the creation itself also will be set free from its slavery to corruption into the freedom of the glory of the children of God. [v22]For we know that the whole creation groans and suffers the pains of childbirth together until now."}
                        />.
                    </p>
                </div>
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The expulsion</h2>
                    <p>
                        As a result of their disobedience, Adam and Eve were
                        expelled from the Garden of Eden
                        <BibleCitation
                            verseRef="Genesis 3:23-24"
                            verseText={"[v23]therefore the Lord God sent him out from the garden of Eden, to cultivate the ground from which he was taken. [v24]So He drove the man out; and at the east of the garden of Eden He stationed the cherubim and the flaming sword which turned every direction to guard the way to the tree of life."}
                        />. This marked the end of humanity's direct
                        relationship with God in the Garden and the beginning of
                        a new chapter in human history.
                    </p>
                </div>
            </div>
            <div class="sub-cards-container">
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The promise</h2>
                    <p>
                        Despite the consequences of sin, God gave Adam and Eve
                        hope for the future by promising to send a Savior who
                        would defeat Satan and restore humanity's relationship
                        with God
                        <BibleCitation
                            verseRef="Genesis 3:15"
                            verseText={"And I will put enmity Between you and the woman, [br] And between your seed and her seed; [br] He shall bruise you on the head, [br] And you shall bruise him on the heel."}
                        />. This promise was the first glimpse of God's plan of
                        redemption, which would ultimately be fulfilled through
                        Jesus Christ.
                    </p>
                </div>
            </div>
        </section>

        <section class="content-section" id="the-miracle">
            <h1 class="colored-header">God in human form</h1>
            <img src="creation.png" class="card-image" />
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        God became man in the form of Jesus in order to liAdam
                        and Eve were happy. They lived in perfect harmony with
                        God and had fulfilling work to do <BibleCitation
                            verseRef="Genesis 1:28"
                            verseText={'God blessed them; and God said to them, "Be fruitful and multiply, and fill the earth, and subdue it; and rule over the fish of the sea and over the birds of the sky and over every living thing that moves on the earth."'}
                        />. However, Adam and Eve sinned and introduced death
                        and disease to the world.
                    </p>
                </div>
            </div>
            <div class="sub-cards-container">
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The first sin</h2>
                    <p>
                        Adam and Eve sinned when they ate the fruit of the tree
                        of the knowledge of good and evil
                        <BibleCitation
                            verseRef="Genesis 3:6"
                            verseText={"When the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was desirable to make _one_ wise, she took from its fruit and ate; and she gave also to her husband with her, and he ate."}
                        />, which God had commanded them not to eat
                        <BibleCitation
                            verseRef="Genesis 2:16-17"
                            verseText={'[v16]The Lord God commanded the man, saying, "From any tree of the garden you may eat freely; [v17] but from the tree of the knowledge of good and evil you shall not eat, for in the day that you eat from it you will surely die."'}
                        />
                        after they had been deceived by Satan, a fallen archangel
                        who was in the form of a snake
                        <BibleCitation
                            verseRef="Revelation 12:9"
                            verseText={"And the great dragon was thrown down, the serpent of old who is called the devil and Satan, who deceives the whole world; he was thrown down to the earth, and his angels were thrown down with him."}
                        />. By sinning, Adam and Eve disobeyed God and brought
                        death and disease into the world
                        <BibleCitation
                            verseRef="Genesis 3:17-19"
                            verseText={'[v17]Then to Adam He said, "Because you have listened to the voice of your wife, and have eaten from the tree about which I commanded you, saying, \'You shall not eat from it\'; Cursed is the ground because of you; [br] In toil you will eat of it [br] All the days of your life. [v18]"Both thorns and thistles it shall grow for you; [br] And you will eat the plants of the field; By the sweat of your face [br] You will eat bread, [br] Till you return to the ground [br] Because from it you were taken; [br] For you are dust, [br] And to dust you shall return.""'}
                            wide
                        />
                        <BibleCitation
                            verseRef="Romans 5:12"
                            verseText={"Therefore, just as through one man sin entered into the world, and death through sin, and so death spread to all men, because all sinned"}
                        />
                        and the whole of creation was affected by their sin
                        <BibleCitation
                            verseRef="Romans 8:20-22"
                            verseText={"[v20]For the creation was subjected to futility, not willingly, but because of Him who subjected it, in hope [v21] that the creation itself also will be set free from its slavery to corruption into the freedom of the glory of the children of God. [v22]For we know that the whole creation groans and suffers the pains of childbirth together until now."}
                        />.
                    </p>
                </div>
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The expulsion</h2>
                    <p>
                        As a result of their disobedience, Adam and Eve were
                        expelled from the Garden of Eden
                        <BibleCitation
                            verseRef="Genesis 3:23-24"
                            verseText={"[v23]therefore the Lord God sent him out from the garden of Eden, to cultivate the ground from which he was taken. [v24]So He drove the man out; and at the east of the garden of Eden He stationed the cherubim and the flaming sword which turned every direction to guard the way to the tree of life."}
                        />. This marked the end of humanity's direct
                        relationship with God in the Garden and the beginning of
                        a new chapter in human history.
                    </p>
                </div>
            </div>
            <div class="sub-cards-container">
                <div class="sub-card">
                    <img src="creation.png" class="card-image" />
                    <h2>The promise</h2>
                    <p>
                        Despite the consequences of sin, God gave Adam and Eve
                        hope for the future by promising to send a Savior who
                        would defeat Satan and restore humanity's relationship
                        with God
                        <BibleCitation
                            verseRef="Genesis 3:15"
                            verseText={"And I will put enmity Between you and the woman, [br] And between your seed and her seed; [br] He shall bruise you on the head, [br] And you shall bruise him on the heel."}
                        />. This promise was the first glimpse of God's plan of
                        redemption, which would ultimately be fulfilled through
                        Jesus Christ.
                    </p>
                </div>
            </div>
        </section>

        <section class="content-section" id="the-sacrifice">
            <h1 class="colored-header">The Sacrifice</h1>
            <img src="creation.png" class="card-image" />
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        At the heart of the Christian faith is the ultimate
                        sacrifice of Jesus Christ. Believers understand that
                        Jesus, being both fully God and fully man, died on the
                        cross to atone for the sins of humanity, offering a path
                        to reconciliation with God. This act of love is
                        foundational to Christian belief and practice.
                    </p>
                </div>
            </div>
            <a href="/library" class="cta-primary">Learn more</a>
        </section>

        <section class="content-section" id="the-judgement">
            <h1 class="colored-header">The Judgement</h1>
            <img src="creation.png" class="card-image" />
            <div class="card-flex">
                <div class="card-text">
                    <p>
                        Christian theology teaches that there will be a final
                        judgement where all people will be accountable to God
                        for their lives. This concept underscores the importance
                        of faith, repentance, and living according to God's
                        teachings, with the promise of eternal life for those
                        who believe in Jesus Christ.
                    </p>
                </div>
            </div>
            <a href="/library" class="cta-primary">Learn more</a>
        </section>
    </main>
</div>
<div class="form-container">
    <h2>Contact</h2>
    <form on:submit|preventDefault={handleSubmit} id="gform">
        <h3>Full Name:</h3>
        <br />
        <input
            type="text"
            bind:value={formFullName}
            placeholder="Enter your full name"
            required
            aria-invalid={fullNameError ? "true" : "false"}
            aria-describedby="fullname-error-message"
        />
        {#if fullNameError}
            <p id="fullname-error-message" class="error-message" role="alert">
                {fullNameError}
            </p>
        {/if}
        <br />
        <h3>Email:</h3>
        <br />
        <input
            type="email"
            bind:value={formEmail}
            placeholder="Enter your email"
            required
            aria-invalid={emailError ? "true" : "false"}
            aria-describedby="email-error-message"
        />
        {#if emailError}
            <p id="email-error-message" class="error-message" role="alert">
                {emailError}
            </p>
        {/if}
        <h3>Message</h3>
        <br />
        <textarea
            bind:value={formMessage}
            placeholder="Enter your message"
            required
            rows="5"
            aria-invalid={messageError ? "true" : "false"}
            aria-describedby="message-error-message"
        ></textarea>
        {#if messageError}
            <p id="message-error-message" class="error-message" role="alert">
                {messageError}
            </p>
        {/if}
        <button
            type="submit"
            disabled={submissionStatus === "submitting" ||
                !!emailError ||
                !!fullNameError ||
                !!messageError}
        >
            {#if submissionStatus === "submitting"}Submitting...{:else}Submit{/if}
        </button>
    </form>
    {#if showNotification && (submissionStatus === "success" || submissionStatus === "error")}
        <div
            class="notification"
            class:success={submissionStatus === "success"}
            class:error={submissionStatus === "error"}
        >
            {submissionStatus === "success"
                ? "Message sent successfully!"
                : "Failed to send message. Please try again."}
        </div>
    {/if}
</div>

<!-- https://docs.google.com/forms/d/e/1FAIpQLSfV1RFbaoc-tBMALGae3aJvMFKIpbkaBtGoVeut5iwhhbLU_g/viewform?usp=pp_url&entry.1933726439=FirstName&entry.1373301618=LastName -->

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
        top: 3.75vh;
        height: 90vh;
        overflow-y: auto;
        /* background-color: var(--background-2-trans); */
        backdrop-filter: blur(25px);
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
        background-color: #0000002d;
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

    .sub-cards-container {
        display: flex;
        gap: 1.5rem;
        margin-top: 2rem;
        width: 100%;
    }

    .sub-card {
        flex: 1;
        padding: 1rem;
    }

    .card-image {
        margin: 0;
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: var(--primary-radius);
    }

    .card-flex {
        margin-top: 1.5em;
        display: flex;
        width: 100%;
        flex: 1; /* Allow .card-flex to grow and fill remaining vertical space */
        justify-content: space-between;
        align-items: center;
        z-index: 1;
    }

    .card-text {
        width: 50vw;
        height: 100%;
        text-align: left;
        margin: 0;
        z-index: 1;
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
        padding-top: 15vh;
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

    .colored-header {
        /* Changed from ID to class */
        background: linear-gradient(-45deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        width: fit-content;
    }

    .form-container {
        padding: 2rem 10vw; /* Added top/bottom padding */
        text-align: center; /* Center the h2 */
        background: linear-gradient(0, var(--background), var(--secondary));
    }

    .form-container h2 {
        margin-bottom: 1.5rem;
        color: var(--text);
    }

    /* The form itself, previously just #gform implicitly */
    #gform {
        padding: 2.5vw;
        background-color: var(--background-2-trans);
        backdrop-filter: blur(50px);
        border-radius: var(--primary-radius);
        border: var(--border);
        display: inline-block; /* To allow text-align:center on parent to work if desired, or set margins */
        text-align: left; /* Align form content to the left */
    }

    #gform h3 {
        color: var(--text);
        margin-bottom: 0.25rem;
        margin-top: 0.5rem;
    }

    #gform input[type="text"],
    #gform input[type="email"],
    #gform textarea {
        padding: 0.75rem;
        border-radius: calc(var(--primary-radius) / 2);
        border: var(--border);
        background-color: var(--background);
        color: var(--text);
        width: 100%; /* Make inputs take full width of their container */
        box-sizing: border-box;
        margin-bottom: 1rem;
        font-family: inherit; /* Ensure textarea inherits font */
    }

    #gform textarea {
        resize: vertical; /* Allow vertical resizing */
    }

    #gform button {
        /* Using existing .cta-primary styles as a base and customizing */
        padding: 0.75rem 1.5rem;
        border-radius: var(--primary-radius);
        background: linear-gradient(45deg, var(--primary), var(--secondary));
        color: white; /* Explicitly white for buttons */
        border: none;
        cursor: pointer;
        font-size: 1rem;
        font-family: "Roboto", sans-serif; /* Match other CTAs */
        font-weight: 300; /* Match other CTAs */
        transition: all 0.3s ease;
        display: block; /* Make button take full width or use margin: auto to center */
        margin: 1rem auto 0; /* Center button */
    }

    #gform button:disabled {
        background: grey;
        cursor: not-allowed;
    }

    .notification {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: var(--primary-radius);
        color: white;
        text-align: center;
    }
    .notification.success {
        background-color: var(--success);
    }
    .notification.error {
        background-color: var(--error);
    }

    .error-message {
        color: var(--error-color, #dc3545); /* Or your theme's error color */
        font-size: 0.9rem;
        margin-top: -0.75rem; /* Adjust to position nicely below the input */
        margin-bottom: 0.5rem;
    }
</style>
