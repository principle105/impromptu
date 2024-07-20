<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { selectedNote, selectedLine, selectedPrefab } from "./stores";

    let viewport; // Stores a reference to the viewport element
    let currPrefab: RhythmPrefab | null;
    $: currPrefab = $selectedPrefab;

    //#region Rhythm Prefabs
    //#region Interfaces
    interface Note {
        note: string;
        length: number;
    }

    interface RhythmPrefab {
        notes: Note[];
        getNotesArray: () => Note[];
        getMinLength: () => number;
    }
    //#endregion

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

    /* PUT HARD-CODED PREFABS HERE */
    // This is an example prefab
    let Prefab1: Note[] = [
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 8 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 16 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 / 4 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
    ];

    //#endregion

    // Every time the note is updated from the keyboard, this method is called
    // to set the corresponding grid note
    const unsubscribe = selectedNote.subscribe(async ({ note: newNote }) => {
        if ($selectedPrefab) {
            console.log("Setting new note...");
            const prefab: RhythmPrefab = $selectedPrefab;
            if (prefab.notes[$selectedLine]) {
                prefab.notes[$selectedLine].note = newNote;
                $selectedPrefab = prefab;
            } else {
                console.error(`No note found at line ${$selectedLine}`);
            }
        }
    });

    // To handle note deletion (when grid note is dbl-clicked)
    function clearNote(index: number) {
        selectedPrefab.update((prefab) => {
            if (prefab) {
                let notes = [...prefab.notes];
                notes[index] = { ...notes[index], note: "" }; // Clear the note at the specified index
                return { ...prefab, notes: notes };
            }
            return prefab;
        });
    }

    let unsubLine = () => {};
    onMount(() => {
        // TODO: Handle prefab switching with a dropdown or some selection method
        selectedPrefab.set(createRhythmPrefab(Prefab1));

        // This scrolls the viewport to the selected line whenever it changes
        unsubLine = selectedLine.subscribe(async () => {
            await tick();

            const selectedLineElement = document.getElementById(
                `line-${$selectedLine}`,
            );
            if (selectedLineElement) {
                selectedLineElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        });
    });

    // Clean up
    onDestroy(() => {
        unsubscribe();
        unsubLine();
    });
</script>

<div class="viewport" bind:this={viewport}>
    {#if currPrefab}
        {#each currPrefab.getNotesArray() as note, i}
            <button
                id={`line-${i}`}
                class="line"
                style="height: {note.length *
                    200}px; background-color: {$selectedLine === i
                    ? 'rgb(62, 62, 62)'
                    : ''}; border-top: {currPrefab.notes.length - 1 === i
                    ? ''
                    : 'solid white 0.5px'};"
                on:click={() => {
                    selectedLine.update(() => i);
                }}
            >
                <div class="note" style="border-left: none;">
                    {#if note.note === "C3"}
                        <button
                            class="selected"
                            on:dblclick={() => clearNote(i)}
                        ></button>
                    {/if}
                </div>
                {#each ["CS3", "D3", "DS3", "E3", "F3", "FS3", "G3", "GS3", "A3", "AS3", "B3", "C4", "CS4", "D4", "DS4", "E4", "F4", "FS4", "G4", "GS4", "A4", "AS4", "B4"] as noteType}
                    <div class="note">
                        {#if note.note === noteType}
                            <button
                                class="selected"
                                on:dblclick={() => clearNote(i)}
                            ></button>
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
        height: fit-content;
        max-height: 300px;
        overflow: auto;
        display: flex;
        flex-direction: column-reverse;
        border: #595959 solid;
        padding: 2px;
    }

    .line {
        display: flex;
        flex-shrink: 0;
    }
    .line:hover {
        background-color: rgb(62, 62, 62);
    }

    .note {
        /* width: 10%; */
        flex: auto;
        justify-content: center;
        align-items: center;
        display: flex;

        height: 100%;
        border-left: dashed gray;
    }

    .note .selected {
        width: 100%;
        height: 100%;
        background-color: rgb(0, 153, 255);
        border: solid rgb(72, 182, 255);
        border-radius: 6px;
        z-index: 1;
    }
    .note .selected:hover {
        background-color: rgb(28, 164, 255);
    }
</style>
