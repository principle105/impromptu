<script lang="ts">
    import { getFraction } from "$lib/util";

    export let notes: { name: string; length: number }[];
    export let mouseenter: () => void;
    export let mouseexit: () => void;
    export let click: () => void;
</script>

<button
    class="flex-col group text-slate-900 relative flex w-28 h-28 items-center justify-center overflow-hidden
            rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold
            transition-transform ease-out hover:scale-105"
    on:click={click}
    on:focus
    on:mouseenter={mouseenter}
    on:mouseleave={mouseexit}
>
    <div class="pointer-events-none flex flex-col">
        {#each notes as note}
            <div>
                <span>
                    {note.name}
                </span>
                <span>
                    {#if getFraction(note.length).denominator === 1}
                        {`${getFraction(note.length).denominator}`}
                    {:else}
                        {`${getFraction(note.length).numerator} / ${getFraction(note.length).denominator}`}
                    {/if}
                </span>
            </div>
        {/each}
    </div>
</button>
