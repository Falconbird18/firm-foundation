<script>
    import { onMount } from "svelte";
    import { citationCounter } from "$lib/stores/citationStore.js";

    /** The full text of the Bible verse. Can include simple HTML for formatting. */
    export let verseText = "No verse text provided.";
    /** The Bible verse reference, e.g., "John 3:16". Displayed as a title in the popover. */
    export let verseRef = "";
    /** If true, the popover will have a wider max-width for longer texts. */
    export let wide = false;

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
    $: processedVerseText = (String(verseText ?? '')) // Ensure verseText is treated as a string, defaulting null/undefined to empty string
        .replace( // Process line breaks first - simple and non-interfering
            /\[br\]/g,
            "<br>"
        )
        .replace( // Then italics
            /_([^_]+)_/g, // Matches text between single underscores. $1 captures the content.
            "<em>$1</em>"    // Wraps with <em> for semantic italics
        )
        .replace( // Then single quotes (for nested quotes) - (?<!=) is a good safeguard for user input
            /(?<!=)'([^']+)'/g, 
            "<q class='inner-quote'>‘$1’</q>" // Wraps with <q> and typographic single quotes
        )
        .replace( // Then double quotes (main quotes)
            /"([^"]+)"/g, // Matches text between double quotes. $1 captures the content inside.
            "<span class='verse-quote'>“$1”</span>" // Use single quotes for HTML attributes for consistency
        )
        .replace(
            /\[v(\d+)\]/g,
            // Use single quotes for HTML attributes to avoid conflict with quote processing
            "<sup class='verse-num-ingroup'>$1</sup> " // HTML generation for verse numbers is now last
        );
</script>

<span class="citation-wrapper" title={verseRef || "View citation"}>
    <sup class="citation-number">{currentNumber}</sup>
    <div class="citation-popover" class:popover-wide={wide}>
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
        width: 15vw;
        padding: 1rem;
        z-index: 1000;
        text-align: left;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text);

        /* Applied glass styles directly to the popover */
        background-color: var(--background-2-trans, rgba(32, 32, 32, 0.35)); /* Slightly opaque background */
        backdrop-filter: blur(10px); /* Adjust blur as needed */
        border-radius: var(--secondary-radius, 15px); /* Consistent with other smaller elements */
        /* position: relative; is already set by position: absolute, good for ::before */
    }

    /* Edge effect for the popover's glass, similar to global #glass::before */
    .citation-popover::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit; /* Inherits from .citation-popover's border-radius */
        /* Adjusted shadow for a potentially smaller element, or match global one if preferred */
        box-shadow:
            inset 0px 0px 1px 0px rgba(255, 255, 255, 0.07),
            inset 0px 1px 2px 0px rgba(255, 255, 255, 0.05),
            inset 0px -1px 2px 1px rgba(0, 0, 0, 0.12);
        pointer-events: none;
        /* Sits behind the popover's direct content but above its background-color */
        z-index: -1; 
    }

    .citation-popover.popover-wide {
        width: 25vw;
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
        font-weight: 600;
        font-size: 0.75em;
        vertical-align: super;
        margin: 0 0.1em;
        color: var(--primary);
    }

    /* Style for quoted text within the popover */
    :global(.verse-quote) {
        font-style: italic;
    }

    /* Style for nested single quotes */
    :global(q.inner-quote) {
        quotes: none; /* Disable browser-default quotes for <q> as we provide them */
        /* font-style: italic; /* Optional: if inner quotes should also be distinct */
    }
</style>
