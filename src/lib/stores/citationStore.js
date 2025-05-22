import { writable } from 'svelte/store';

// Initialize the counter. It starts at 1 for the first citation.
export const citationCounter = writable(1);

// If you need to reset the counter (e.g., for specific SPA navigation scenarios,
// though typically it resets naturally on a full page load or when the root component remounts).
// export const resetCitationCounter = () => citationCounter.set(1);