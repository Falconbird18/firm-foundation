<script>
    /**
     * The reference text to display (e.g., "Genesis 1:1", "G25 ἀγάπη").
     * @type {string}
     */
    export let reference = "Reference";

    /**
     * The content to show in the tooltip (e.g., verse text, definition).
     * Can include HTML.
     * @type {string}
     *
     * Renamed from 'quote' in user prompt to avoid confusion with the component's purpose.
     * Assuming this is the actual text of the quotation.
     */
    export let quote = "Quote content goes here.";

</script>

<div class="custom-quote">
    <span class="quote-mark open-mark">“</span>
    <span class="quote-text">{@html quote}</span>
    <span class="quote-mark close-mark">”</span>
</div>

<style>
    .custom-quote {
        font-family: 'Georgia', serif; /* 2. Changed font */
        font-size: inherit; /* 1. Inherit font size from parent for inline behavior */
        font-style: italic; /* Keep text italicized */
        font-weight: 300; /* Original weight for the quote text */
        color: var(--text-secondary, var(--text)); /* Use a secondary text color or fallback */
        display: inline; /* Make it an inline element */
        line-height: inherit; /* Inherit line-height for better flow with surrounding text */
        width: fit-content;
        height: fit-content;
    }

    .quote-mark { /* 3 & 4. Styling for the quotation marks */
        font-family: 'Georgia', serif; /* Consistent font for marks */
        font-size: 1.5em; /* Significantly larger quotes (relative to .custom-quote font-size) */
        font-style: normal; /* Marks are typically not italic */
        font-weight: 600; /* Bolder marks */
        color: var(--primary); /* Use primary color for emphasis */
        
        /* line-height: 0;
        display: inline-block;
        vertical-align: top; */
    }

    .open-mark {
        margin: 0;
        position: relative;
        top: 0;
        left: 0;
        /* transform: translateY(0.1em); */
    }

    .close-mark {
        margin: 0;
        position: relative;
        top: 0;
        right: 0;
    }
    .quote-text {
        display: inline;
    }
</style>
