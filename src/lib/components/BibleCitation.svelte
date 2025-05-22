<script>
    import { onMount } from "svelte";
    import { citationCounter } from "$lib/stores/citationStore.js";

    /** The full text of the Bible verse. Can include simple HTML for formatting. */
    export let verseText = "No verse text provided.";
    /** The Bible verse reference, e.g., "John 3:16". Displayed as a title in the popover. */
    export let verseRef = "";

    let currentNumber;
    let processedVerseText; // Declare processedVerseText here

    onMount(() => {
        // Atomically get the current number for this instance and increment for the next
        citationCounter.update((n) => {
            currentNumber = n; // Assign the current count to this instance
            return n + 1; // Return the incremented count for the store
        });
    });

    // Reactive statement to process verseText for inline verse numbers
    // Looks for placeholders like [v2], [v3] and replaces them with styled <sup> tags.
    $: processedVerseText = verseText.replace(
        /\[v(\d+)\]/g,
        '<sup class="verse-num-ingroup">$1</sup> ', // $1 is the captured number, add a space after
    );
</script>

<span class="citation-wrapper" title={verseRef || "View citation"}>
    <sup class="citation-number">{currentNumber}</sup>
    <div class="citation-popover">
        {#if verseRef}
            <strong class="verse-reference">{verseRef}</strong>
        {/if}
        <p class="verse-text">{@html processedVerseText}</p>
    </div>
</span>

<style>
    .citation-wrapper {
        position: relative;
        display: inline-block; /* Allows popover to be positioned relative to it */
        cursor: pointer;
    }

    .citation-number {
        font-size: 0.75em;
        line-height: 1;
        vertical-align: super;
        padding: 0.1em 0.3em;
        border-radius: var(--secondary-radius);
        background-color: var(--background-trans, rgba(200, 200, 200, 0.3));
        color: var(--text);
        margin-left: 1px;
        margin-right: 1px;
    }

    .citation-popover {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        min-width: 250px;
        max-width: 400px;
        padding: 1rem;
        /* Updated background properties for proper blur effect */
        background-color: var(--background-2-trans);
        backdrop-filter: blur(50px);
        border: var(--border);
        border-radius: var(--primary-radius);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 100;
        text-align: left;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text);
    }

    .citation-wrapper:hover .citation-popover {
        display: block;
    }

    .verse-reference {
        display: block;
        font-weight: bold;
        font-size: 1.25rem;
        margin-bottom: 0.5em;
        color: var(--primary, #007bff); /* Theme variable */
    }

    .verse-text {
        margin: 0;
    }

    /* Style for inline verse numbers within the popover text */
    :global(.verse-num-ingroup) {
        /* Use :global if <sup> is directly in slot, not needed here as it's generated */
        font-weight: 600; /* Make them slightly bolder */
        font-size: 0.75em; /* Slightly smaller than surrounding text */
        vertical-align: super; /* Ensure proper superscript alignment */
        margin: 0 0.1em; /* Tiny bit of space around the number */
        color: var(--primary); /* Use primary color or another subtle color */
    }
</style>
