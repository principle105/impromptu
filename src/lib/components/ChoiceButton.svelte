<script lang="ts">
    export let note: string;
    export let length: number;
    export let mouseenter: () => void;
    export let mouseexit: () => void;
    export let click: () => void;
</script>

<button
    class="flex-col group text-slate-900 relative flex w-fit items-center justify-center overflow-hidden
            rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold
            transition-transform ease-out hover:scale-105"
    on:click={click}
    on:focus
    on:mouseenter={mouseenter}
    on:mouseleave={mouseexit}
>
    <div class="pointer-events-none">
        <span>
            {note}
        </span>
        <span>
            {length}
        </span>
    </div>
</button>
