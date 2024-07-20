<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { selectedNote, selectedLine, selectedPrefab } from "./stores";

    let currPrefab: RhythmPrefab | null;
    $: currPrefab = $selectedPrefab;

    let viewport;

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
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
        { note: "", length: 1 },
    ];

    const unsubscribe = selectedNote.subscribe(async ({note: newNote}) => {
        if (currPrefab) {
            console.log("Setting new note...");
            const prefab: RhythmPrefab = currPrefab;
            if (prefab.notes[$selectedLine]) {
                prefab.notes[$selectedLine].note = newNote;
                currPrefab = prefab;

                // Ensure DOM updates before scrolling
                await tick();

                // Scroll to the selected line
                const selectedLineElement = document.getElementById(
                    `line-${$selectedLine}`,
                );
                if (selectedLineElement) {
                    selectedLineElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            } else {
                console.error(`No note found at line ${$selectedLine}`);
            }
        }
    });

    onMount(() => {
        selectedPrefab.set(createRhythmPrefab(Prefab1));
    });

    onDestroy(unsubscribe);
</script>

<div class="viewport" bind:this={viewport}>
    {#if currPrefab}
        {#each currPrefab.getNotesArray() as note, i}
            <button
                id={`line-${i}`}
                class="line"
                style="height: {note.length *
                    30}px; background-color: {$selectedLine === i
                    ? 'rgb(62, 62, 62)'
                    : ''}; border-top: {currPrefab.notes.length - 1 === i
                    ? ''
                    : 'solid white'};"
                on:click={() => {
                    selectedLine.update(() => i);
                }}
            >
                <div class="note" style="border-left: none;">
                    {#if note.note === "C3"}
                        <div class="selected"></div>
                    {/if}
                </div>
                {#each ["CS3", "D3", "DS3", "E3", "F3", "FS3", "G3", "GS3", "A3", "AS3", "B3", "C4", "CS4", "D4", "DS4", "E4", "F4", "FS4", "G4", "GS4", "A4", "AS4", "B4"] as noteType}
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
        height: 100%;
        border-left: dashed gray;
    }

    .note .selected {
        width: 100%;
        height: 100%;
        background-color: rgb(0, 153, 255);
        border: solid rgb(72, 182, 255);
        border-radius: 6px;
    }
</style>
