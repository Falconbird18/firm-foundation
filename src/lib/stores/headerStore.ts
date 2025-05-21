import { writable } from 'svelte/store';

/**
 * Controls the visibility of the main layout header.
 * true: header is visible
 * false: header is hidden
 */
export const isLayoutHeaderVisible = writable(true);
