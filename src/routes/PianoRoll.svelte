<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { selectedNote } from "./stores";

    let selectedPrefab: RhythmPrefab | null = null;

    let selectedLine: number = 0;

    interface Note {
        note: string;
        length: number;
    }

    interface RhythmPrefab {
        notes: Note[];
        getNotesArray: () => Note[];
        getMinLength: () => number;
    }

    function createRhythmPrefab(notes: Note[]): RhythmPrefab {
        return {
            notes,
            getNotesArray() {
                return Object.values(this.notes);
            },
            getMinLength() {
                let min: number = this.notes[0].length;

                Object.values(this.notes).forEach((element) => {
                    if (element.length < min) min = element.length;
                });

                return min;
            },
        };
    }

    let Prefab1: Note[] = [
        { note: "A", length: 1 },
        { note: "", length: 1 },
        { note: "AS", length: 1 },
        { note: "", length: 1 },
    ];

    const unsubscribe = selectedNote.subscribe((newNote: string) => {
        if (selectedPrefab) {
            console.log("Setting new note...");
            const prefab: RhythmPrefab = selectedPrefab;
            if (prefab.notes[selectedLine]) {
                prefab.notes[selectedLine].note = newNote;
                selectedPrefab = prefab;
            } else {
                console.error(
                    `No note found at line ${selectedLine}` +
                        selectedPrefab.notes,
                );
            }
        }
    });

    onMount(() => {
        selectedPrefab = createRhythmPrefab(Prefab1);
    });

    onDestroy(unsubscribe);
</script>

<div class="viewport">
    {#if selectedPrefab}
        {#each selectedPrefab.getNotesArray() as note, i}
            <button
                class="line"
                style="height: {note.length * 10}%; background-color: {selectedLine === i ? "rgb(62, 62, 62)" : ""}"
                on:click={() => (selectedLine = i)}
            >
                <div class="note" style="border-left: none;">
                    {#if note.note === "C3"}
                        <div class="selected"></div>
                    {/if}
                </div>
                {#each ["CS3", "D3", "DS3", "E3", "F3", "FS3", "G3", "GS3", "A3", "AS3", "B3", "C4","CS4", "D4", "DS4", "E4", "F4", "FS4", "G4", "GS4", "A4", "AS4", "B4"] as noteType}
                    <div class="note">
                        {#if note.note === noteType}
                            <div class="selected"></div>
                        {/if}
                    </div>
                {/each}
            </button>
        {/each}
    {/if}
</div>

<style>
    .viewport {
        background-color: black;
        width: 600px;
        height: 300px;
        display: flex;
        flex-direction: column-reverse;
    }

    .line {
        border-top: solid white;
        display: flex;
    }
    .line:hover {
        background-color: rgb(62, 62, 62);
    }

    .note {
        /* width: 10%; */
        flex: auto;
        height: 100%;
        border-left: dashed gray;
    }

    .note .selected {
        width: 100%;
        height: 100%;
        background-color: rgb(6, 133, 212);
        border-radius: 10px;
    }
</style>
