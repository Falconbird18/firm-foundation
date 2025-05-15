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
   */
  export let text = "Tooltip content goes here.";

  /**
   * Tooltip position relative to the reference.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   */
  export let position = "top"; // Default to top

  let showTooltip = false;

  function handleMouseEnter() {
    showTooltip = true;
  }

  function handleMouseLeave() {
    showTooltip = false;
  }
</script>

<div class="bible-verse-hover-container">
  <span
    class="reference-text"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:focus={handleMouseEnter}
    on:blur={handleMouseLeave}
    tabindex="0"
    role="button"
    aria-describedby="tooltip-content-{reference.replace(/\s|:/g, '-')}"
  >
    {reference}
  </span>

  {#if showTooltip}
    <div class="tooltip tooltip-{position}" role="tooltip" id="tooltip-content-{reference.replace(/\s|:/g, '-')}">
      <div class="tooltip-arrow tooltip-arrow-{position}"></div>
      <div class="tooltip-inner">
        {@html text}
      </div>
    </div>
  {/if}
</div>

<style>
  .bible-verse-hover-container {
    position: relative;
    display: inline-block;
  }

  .reference-text {
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: var(--primary);
    text-decoration-thickness: 4px;
    cursor: pointer;
  }
  .reference-text:hover,
  .reference-text:focus {
    color: var(--primary);
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  .tooltip {
    position: absolute;
    z-index: 1080; /* High z-index to appear above other content */
    display: block;
    font-size: 1.5;
    line-height: 1.4;
    background-color: var(--background-3);
    color: var(--text);
    padding: calc(var(--spacing-unit) * 0.6) calc(var(--spacing-unit) * 0.9);
    border-radius: var(--primary-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 15vw;
    max-width: 25vw;
    text-align: left;
    /* pointer-events: none; */ /* Add if you don't want the tooltip to be interactive itself */
  }

  .tooltip-inner {
    /* Content specific styles if needed */
  }

  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  /* Top Tooltip (Default) */
  .tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px; /* Space for the arrow */
  }
  .tooltip-arrow-top {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px 8px 0;
    border-color: var(--background-3) transparent transparent transparent;
  }

  /* Bottom Tooltip */
  .tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  }
  .tooltip-arrow-bottom {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 8px 8px;
    border-color: transparent transparent var(--background-3) transparent;
  }

  /* Left Tooltip */
  .tooltip-left {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 8px;
  }
  .tooltip-arrow-left {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border-width: 8px 0 8px 8px;
    border-color: transparent transparent transparent var(--background-3);
  }

  /* Right Tooltip */
  .tooltip-right {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    margin-left: 8px;
  }
  .tooltip-arrow-right {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    border-width: 8px 8px 8px 0;
    border-color: transparent var(--background-3) transparent transparent;
  }
</style>