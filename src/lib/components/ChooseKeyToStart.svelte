<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Note } from "$lib/notes";

    import Piano from "./Piano.svelte";

    const dispatch = createEventDispatcher<{
        initialNoteChosen: Note;
    }>();

    let hoverNote = "";
</script>

<div
    class="h-screen w-screen bg-[#1e1e1e] flex flex-col items-center justify-center"
>
    <h1
        class="text-4xl font-bold bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-clip-text text-transparent mb-20"
    >
        Choose a key to start:
    </h1>
    <div class="relative p-10 pr-20 flex items-center justify-center">
        <div
            class="bg-black border-2 p-10 pr-20 flex items-center justify-center"
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
</div>
