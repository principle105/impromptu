<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Note } from "$lib/notes";

    import Piano from "./Piano.svelte";

    const dispatch = createEventDispatcher<{
        initialNoteChosen: Note;
    }>();

    let hoverNote = "";
</script>

<section class="h-screen w-screen flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold text-white mb-8">Choose a key to start:</h1>
    <div class="p-10 flex items-center justify-center">
        <div
            class="bg-black border-[6px] p-10 pr-20 flex items-center justify-center"
            style="border-image: linear-gradient(45deg, red, yellow, green, cyan, blue, magenta) 1;"
        >
            <Piano
                {hoverNote}
                playNote={(key) => {
                    dispatch("initialNoteChosen", key);
                }}
            />
        </div>
    </div>
</section>
