<script>
    import ArticleTitle from "$lib/components/ArticleTitle.svelte";
    import QuickAnswer from "$lib/components/QuickAnswer.svelte";
    import BibleVerseHover from "$lib/components/BibleVerseHover.svelte";
</script>

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
            <b>Jesus could not be both God and man</b> – Since Jesus was raised from the
            dead by God's power, some believe this indicates that he was not God
            himself but rather a servant of God.
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
    .text-container {
        width: 55vw;
        text-align: justify;
        margin-left: 20vw;
        margin-right: 20vw;
    }
</style>
