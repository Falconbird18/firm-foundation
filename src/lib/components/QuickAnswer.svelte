<script>
  /**
   * The text for the quick answer.
   * @type {string}
   */
  export let answer = "This is a quick answer.";

  /**
   * Optional: A label for the quick answer section.
   * @type {string}
   */
  export let label = "Quick Answer:";
</script>

<div class="quick-answer-container">
    <div class="quick-answer-border"></div>
  {#if label}
    <h2 class="quick-answer-label">{label}</h2>
  {/if}
  <p class="quick-answer-text">{answer}</p>
</div>

<style>
  .quick-answer-container {
    position: relative;
    background: var(--background-3);
    padding: var(--spacing-unit);
    padding-left: calc(30px + var(--spacing-unit)); /* This padding will apply to the text content */
    margin-top: var(--spacing-unit);
    margin-bottom: calc(var(--spacing-unit) * 1.5);
    border-radius: var(--primary-radius);
    overflow: hidden; /* Ensures the border is clipped by the rounded corners */
  }

  .quick-answer-border{
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 100%;
    background: linear-gradient(-45deg, var(--primary), var(--secondary));
  }

  .quick-answer-label {
    display: block;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    position: relative; /* Ensures it renders above the background in some stacking contexts if needed, though not strictly necessary here */
  }

  .quick-answer-text {
    margin: 0;
    line-height: 1.6;
  }
</style>