<script lang="ts">
    import { onMount, tick } from "svelte";

    export let notes: { name: string; length: number }[];
    export let selectedIndex: number;

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
    <div class="viewport" bind:this={viewport}>
        {#each notes as note, i}
            {#if note}
                <div
                    id={`line-${i}`}
                    class="line"
                    style="height: {note.length *
                        100}%; background-color: {selectedIndex === i
                        ? 'rgb(62, 62, 62)'
                        : ''}; border-top: {notes[0].length - 1 === i
                        ? ''
                        : 'solid white'};"
                >
                    <div class="note" style="border-left: none;">
                        {#if note.name === "C3"}
                            <div class="selected"></div>
                        {/if}
                    </div>
                    {#each ["C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"] as noteType}
                        <div class="note">
                            {#if note.name === noteType}
                                <div class="selected"></div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    .viewport {
        background-color: black;
        margin-left: 42.9px;
        width: 642.9px;
        height: fit-content;
        height: 300px;
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
        z-index: 1;
    }
    .note .selected:hover {
        background-color: rgb(28, 164, 255);
    }
</style>
