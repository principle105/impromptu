import { writable } from "svelte/store";

export const selectedNote = writable({note: ""});
export const showKeys = writable(false);
export const selectedLine = writable(0);
export const selectedPrefab = writable(null);