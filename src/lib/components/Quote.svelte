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

<blockquote class="custom-quote">
    <span class="quote-mark open-mark">“</span>
    <span class="quote-text">{@html quote}</span>
    <span class="quote-mark close-mark">”</span>
</blockquote>

<style>
    .custom-quote {
        font-family: 'Georgia', serif; /* 2. Changed font */
        font-size: 1.5rem; /* 1. Paragraph-like font size */
        font-style: italic; /* Keep text italicized */
        font-weight: 300; /* Original weight for the quote text */
        color: var(--text-secondary, var(--text)); /* Use a secondary text color or fallback */
        text-align: center; /* Center the quote block */
        display: block; /* Ensure it behaves as a block element */
        line-height: 1.6; /* Good readability for the quote text */
        margin: 0;
    }

    .quote-mark { /* 3 & 4. Styling for the quotation marks */
        font-family: 'Georgia', serif; /* Consistent font for marks */
        font-size: 2.8em; /* Significantly larger quotes (relative to .custom-quote font-size) */
        font-style: normal; /* Marks are typically not italic */
        font-weight: 600; /* Bolder marks */
        color: var(--primary); /* Use primary color for emphasis */
        
        /* Vertical alignment helpers */
        line-height: 0; /* Collapse line height of the mark itself to prevent extra space */
        display: inline-block; /* Allows for transform and better vertical alignment control */
        vertical-align: middle; /* Align middle of mark with middle of text line */
    }

    .open-mark {
        margin-right: 0.1em; /* Space after opening quote */
        transform: translateY(0.1em); /* Fine-tune vertical position (adjust as needed) */
    }

    .close-mark {
        margin-left: 0.1em; /* Space before closing quote */
        transform: translateY(0.1em); /* Consistent vertical adjustment */
    }
    .quote-text {
        /* This span primarily inherits styles from .custom-quote */
        /* It helps in the structure for applying quote marks around the content */
        display: inline; /* Keep the actual quote text flowing naturally */
    }
</style>
