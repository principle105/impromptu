<script lang="ts">
    import { onMount, tick } from "svelte";
    import { Note } from "../notes";
    import IconTrash from "~icons/solar/trash-bin-minimalistic-line-duotone";

    export let notes: Note[];
    export let selectedIndex: number;
    export let canEdit: boolean = true;
    export let deleteNote: (i: number) => void;

    $: if (!notes || !notes.length) {
        notes = [
            new Note("", "", 1 / 4),
            new Note("", "", 1 / 4),
            new Note("", "", 1 / 4),
            new Note("", "", 1 / 4),
        ];
    }

    let viewport; // Stores a reference to the viewport element

    $: {
        if (typeof window !== "undefined") {
            scroll(selectedIndex);
        }
    }

    async function scroll(index: number) {
        await tick();

        if (typeof document !== "undefined") {
            const selectedLineElement = document.getElementById(
                `line-${index}`,
            );
            if (selectedLineElement) {
                selectedLineElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }

    onMount(() => {
        // Initial scroll on mount
        scroll(selectedIndex);
    });
</script>

{#if notes}
    <div
        class="viewport bg-black w-[642.9px] h-[300px] overflow-auto flex flex-col-reverse border border-[#595959] p-1"
        bind:this={viewport}
    >
        {#each notes as note, i}
            {#if note}
                <button
                    on:click={() => (selectedIndex = i)}
                    id={`line-${i}`}
                    class="flex-shrink-0 flex w-full"
                    style="height: {note.length *
                        100}%; background-color: {selectedIndex === i
                        ? 'rgb(62, 62, 62)'
                        : ''}; border-top: {notes[0].length - 1 === i
                        ? ''
                        : 'solid white'};"
                >
                    {#each ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"] as noteType}
                        <div
                            class="note w-fit flex-auto h-full border-l border-dashed border-gray-500 first:border-none"
                        >
                            {#if note.name() === noteType}
                                <button
                                    on:click={() => {
                                        if (canEdit) {
                                            deleteNote(i);
                                        }
                                    }}
                                    class="flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 border border-blue-700 rounded-md relative z-10 group w-full h-full transition duration-300 ease-in-out transform shadow-lg hover:shadow-xl {canEdit &&
                                        'hover:bg-blue-500'}"
                                >
                                    <IconTrash
                                        class="hidden absolute text-white {canEdit &&
                                            'group-hover:block'}"
                                    ></IconTrash>
                                </button>
                            {/if}
                        </div>
                    {/each}
                </button>
            {/if}
        {/each}
    </div>
{/if}
