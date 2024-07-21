<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";

    import { Note, getAllNotes } from "$lib/notes";

    export let hoverNote: string;
    export let playNote: (key: Note) => void;
    export let selectableNotes: Note[] = getAllNotes();
    export let showKeys = false;

    if (!selectableNotes) selectableNotes = getAllNotes();

    const activateSelectableNotes = (notes: Note[]) => {
        if (!notes) return;

        for (let i = 0; i < pianoNoteComponents.length; i++) {
            for (let j = 0; j < notes.length; j++) {
                if (pianoNoteComponents[i].note.note === notes[j].note) {
                    pianoNoteComponents[i].disabled = false;
                    break;
                }
                pianoNoteComponents[i].disabled = true;
            }
        }
    };

    $: activateSelectableNotes(selectableNotes);

    let pianoNoteComponents = [
        { note: new Note("C", "3"), disabled: false },
        { note: new Note("C#", "3"), disabled: false },
        { note: new Note("D", "3"), disabled: false },
        { note: new Note("D#", "3"), disabled: false },
        { note: new Note("E", "3"), disabled: false },
        { note: new Note("F", "3"), disabled: false },
        { note: new Note("F#", "3"), disabled: false },
        { note: new Note("G", "3"), disabled: false },
        { note: new Note("G#", "3"), disabled: false },
        { note: new Note("A", "3"), disabled: false },
        { note: new Note("A#", "3"), disabled: false },
        { note: new Note("B", "3"), disabled: false },
        { note: new Note("C", "4"), disabled: false },
        { note: new Note("C#", "4"), disabled: false },
        { note: new Note("D", "4"), disabled: false },
        { note: new Note("D#", "4"), disabled: false },
        { note: new Note("E", "4"), disabled: false },
        { note: new Note("F", "4"), disabled: false },
        { note: new Note("F#", "4"), disabled: false },
        { note: new Note("G", "4"), disabled: false },
        { note: new Note("G#", "4"), disabled: false },
        { note: new Note("A", "4"), disabled: false },
        { note: new Note("A#", "4"), disabled: false },
        { note: new Note("B", "4"), disabled: false },
        { note: new Note("C", "5"), disabled: false },
    ];

    const notesVisible = writable({
        "key-1": false,
        "key-2": false,
        "key-3": false,
        "key-4": false,
        "key-5": false,
        "key-6": false,
        "key-7": false,
        "key-8": false,
        "key-9": false,
        "key-10": false,
        "key-11": false,
        "key-12": false,
        "key-13": false,
        "key-14": false,
        "key-15": false,
        "key-16": false,
        "key-17": false,
        "key-18": false,
        "key-19": false,
        "key-20": false,
        "key-21": false,
        "key-22": false,
        "key-23": false,
        "key-24": false,
        "key-25": false,
    });

    const showNote = (key: string) => {
        notesVisible.update((nv) => ({ ...nv, [key]: true }));
    };

    const hideNote = (key: string) => {
        notesVisible.update((nv) => ({ ...nv, [key]: false }));
    };
</script>

<div class="relative container h-[200px] w-[600px]">
    <button
        disabled={pianoNoteComponents[0].disabled}
        id="key-1"
        class={`key white ${hoverNote === pianoNoteComponents[0].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-1")}
        on:focus
        on:mouseleave={() => hideNote("key-1")}
        on:mousedown={() => playNote(pianoNoteComponents[0].note)}
    >
        {#if $notesVisible["key-1"] || showKeys || hoverNote === pianoNoteComponents[0].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[0].note.name() ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[1].disabled}
        id="key-2"
        class={`key black ${hoverNote === pianoNoteComponents[1].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-2")}
        on:focus
        on:mouseleave={() => hideNote("key-2")}
        on:mousedown={() => playNote(pianoNoteComponents[1].note)}
    >
        {#if $notesVisible["key-2"] || showKeys || hoverNote === pianoNoteComponents[1].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[1].note.name() ? "font-bold" : ""}`}
            >
                C#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[2].disabled}
        id="key-3"
        class={`key white ${hoverNote === pianoNoteComponents[2].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-3")}
        on:focus
        on:mouseleave={() => hideNote("key-3")}
        on:mousedown={() => playNote(pianoNoteComponents[2].note)}
    >
        {#if $notesVisible["key-3"] || showKeys || hoverNote === pianoNoteComponents[2].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[2].note.name() ? "font-bold" : ""}`}
            >
                D
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[3].disabled}
        id="key-4"
        class={`key black ${hoverNote === pianoNoteComponents[3].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-4")}
        on:focus
        on:mouseleave={() => hideNote("key-4")}
        on:mousedown={() => playNote(pianoNoteComponents[3].note)}
    >
        {#if $notesVisible["key-4"] || showKeys || hoverNote === pianoNoteComponents[3].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[3].note.name() ? "font-bold" : ""}`}
            >
                D#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[4].disabled}
        id="key-5"
        class={`key white ${hoverNote === pianoNoteComponents[4].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-5")}
        on:focus
        on:mouseleave={() => hideNote("key-5")}
        on:mousedown={() => playNote(pianoNoteComponents[4].note)}
    >
        {#if $notesVisible["key-5"] || showKeys || hoverNote === pianoNoteComponents[4].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[4].note.name() ? "font-bold" : ""}`}
            >
                E
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[5].disabled}
        id="key-6"
        class={`key white ${hoverNote === pianoNoteComponents[5].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-6")}
        on:focus
        on:mouseleave={() => hideNote("key-6")}
        on:mousedown={() => playNote(pianoNoteComponents[5].note)}
    >
        {#if $notesVisible["key-6"] || showKeys || hoverNote === pianoNoteComponents[5].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[5].note.name() ? "font-bold" : ""}`}
            >
                F
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[6].disabled}
        id="key-7"
        class={`key black ${hoverNote === pianoNoteComponents[6].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-7")}
        on:focus
        on:mouseleave={() => hideNote("key-7")}
        on:mousedown={() => playNote(pianoNoteComponents[6].note)}
    >
        {#if $notesVisible["key-7"] || showKeys || hoverNote === pianoNoteComponents[6].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[6].note.name() ? "font-bold" : ""}`}
            >
                F#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[7].disabled}
        id="key-8"
        class={`key white ${hoverNote === pianoNoteComponents[7].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-8")}
        on:focus
        on:mouseleave={() => hideNote("key-8")}
        on:mousedown={() => playNote(pianoNoteComponents[7].note)}
    >
        {#if $notesVisible["key-8"] || showKeys || hoverNote === pianoNoteComponents[7].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[7].note.name() ? "font-bold" : ""}`}
            >
                G
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[8].disabled}
        id="key-9"
        class={`key black ${hoverNote === pianoNoteComponents[8].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-9")}
        on:focus
        on:mouseleave={() => hideNote("key-9")}
        on:mousedown={() => playNote(pianoNoteComponents[8].note)}
    >
        {#if $notesVisible["key-9"] || showKeys || hoverNote === pianoNoteComponents[8].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[8].note.name() ? "font-bold" : ""}`}
            >
                G#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[9].disabled}
        id="key-10"
        class={`key white ${hoverNote === pianoNoteComponents[9].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-10")}
        on:focus
        on:mouseleave={() => hideNote("key-10")}
        on:mousedown={() => playNote(pianoNoteComponents[9].note)}
    >
        {#if $notesVisible["key-10"] || showKeys || hoverNote === pianoNoteComponents[9].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[9].note.name() ? "font-bold" : ""}`}
            >
                A
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[10].disabled}
        id="key-11"
        class={`key black ${hoverNote === pianoNoteComponents[10].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-11")}
        on:focus
        on:mouseleave={() => hideNote("key-11")}
        on:mousedown={() => playNote(pianoNoteComponents[10].note)}
    >
        {#if $notesVisible["key-11"] || showKeys || hoverNote === pianoNoteComponents[10].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[10].note.name() ? "font-bold" : ""}`}
            >
                A#
            </div>
        {/if}
    </button>
    <button
        disabled={pianoNoteComponents[11].disabled}
        id="key-12"
        class={`key white ${hoverNote === pianoNoteComponents[11].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-12")}
        on:focus
        on:mouseleave={() => hideNote("key-12")}
        on:mousedown={() => playNote(pianoNoteComponents[11].note)}
    >
        {#if $notesVisible["key-12"] || showKeys || hoverNote === pianoNoteComponents[11].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[11].note.name() ? "font-bold" : ""}`}
            >
                B
            </div>
        {/if}
    </button>
    <button
        disabled={pianoNoteComponents[12].disabled}
        id="key-13"
        class={`key white ${hoverNote === pianoNoteComponents[12].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-13")}
        on:focus
        on:mouseleave={() => hideNote("key-13")}
        on:mousedown={() => playNote(pianoNoteComponents[12].note)}
    >
        {#if $notesVisible["key-13"] || showKeys || hoverNote === pianoNoteComponents[12].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[12].note.name() ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[13].disabled}
        id="key-14"
        class={`key black ${hoverNote === pianoNoteComponents[13].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-14")}
        on:focus
        on:mouseleave={() => hideNote("key-14")}
        on:mousedown={() => playNote(pianoNoteComponents[13].note)}
    >
        {#if $notesVisible["key-14"] || showKeys || hoverNote === pianoNoteComponents[13].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[13].note.name() ? "font-bold" : ""}`}
            >
                C#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[14].disabled}
        id="key-15"
        class={`key white ${hoverNote === pianoNoteComponents[14].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-15")}
        on:focus
        on:mouseleave={() => hideNote("key-15")}
        on:mousedown={() => playNote(pianoNoteComponents[14].note)}
    >
        {#if $notesVisible["key-15"] || showKeys || hoverNote === pianoNoteComponents[14].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[14].note.name() ? "font-bold" : ""}`}
            >
                D
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[15].disabled}
        id="key-16"
        class={`key black ${hoverNote === pianoNoteComponents[15].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-16")}
        on:focus
        on:mouseleave={() => hideNote("key-16")}
        on:mousedown={() => playNote(pianoNoteComponents[15].note)}
    >
        {#if $notesVisible["key-16"] || showKeys || hoverNote === pianoNoteComponents[15].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[15].note.name() ? "font-bold" : ""}`}
            >
                D#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[16].disabled}
        id="key-17"
        class={`key white ${hoverNote === pianoNoteComponents[16].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-17")}
        on:focus
        on:mouseleave={() => hideNote("key-17")}
        on:mousedown={() => playNote(pianoNoteComponents[16].note)}
    >
        {#if $notesVisible["key-17"] || showKeys || hoverNote === pianoNoteComponents[16].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[16].note.name() ? "font-bold" : ""}`}
            >
                E
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[17].disabled}
        id="key-18"
        class={`key white ${hoverNote === pianoNoteComponents[17].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-18")}
        on:focus
        on:mouseleave={() => hideNote("key-18")}
        on:mousedown={() => playNote(pianoNoteComponents[17].note)}
    >
        {#if $notesVisible["key-18"] || showKeys || hoverNote === pianoNoteComponents[17].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[17].note.name() ? "font-bold" : ""}`}
            >
                F
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[18].disabled}
        id="key-19"
        class={`key black ${hoverNote === pianoNoteComponents[18].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-19")}
        on:focus
        on:mouseleave={() => hideNote("key-19")}
        on:mousedown={() => playNote(pianoNoteComponents[18].note)}
    >
        {#if $notesVisible["key-19"] || showKeys || hoverNote === pianoNoteComponents[18].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[18].note.name() ? "font-bold" : ""}`}
            >
                F#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[19].disabled}
        id="key-20"
        class={`key white ${hoverNote === pianoNoteComponents[19].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-20")}
        on:focus
        on:mouseleave={() => hideNote("key-20")}
        on:mousedown={() => playNote(pianoNoteComponents[19].note)}
    >
        {#if $notesVisible["key-20"] || showKeys || hoverNote === pianoNoteComponents[19].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[19].note.name() ? "font-bold" : ""}`}
            >
                G
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[20].disabled}
        id="key-21"
        class={`key black ${hoverNote === pianoNoteComponents[20].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-21")}
        on:focus
        on:mouseleave={() => hideNote("key-21")}
        on:mousedown={() => playNote(pianoNoteComponents[20].note)}
    >
        {#if $notesVisible["key-21"] || showKeys || hoverNote === pianoNoteComponents[20].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[20].note.name() ? "font-bold" : ""}`}
            >
                G#
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[21].disabled}
        id="key-22"
        class={`key white ${hoverNote === pianoNoteComponents[21].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-22")}
        on:focus
        on:mouseleave={() => hideNote("key-22")}
        on:mousedown={() => playNote(pianoNoteComponents[21].note)}
    >
        {#if $notesVisible["key-22"] || showKeys || hoverNote === pianoNoteComponents[21].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[21].note.name() ? "font-bold" : ""}`}
            >
                A
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[22].disabled}
        id="key-23"
        class={`key black ${hoverNote === pianoNoteComponents[22].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-23")}
        on:focus
        on:mouseleave={() => hideNote("key-23")}
        on:mousedown={() => playNote(pianoNoteComponents[22].note)}
    >
        {#if $notesVisible["key-23"] || showKeys || hoverNote === pianoNoteComponents[22].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[22].note.name() ? "font-bold" : ""}`}
            >
                A#
            </div>
        {/if}
    </button>
    <button
        disabled={pianoNoteComponents[23].disabled}
        id="key-24"
        class={`key white ${hoverNote === pianoNoteComponents[23].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-24")}
        on:focus
        on:mouseleave={() => hideNote("key-24")}
        on:mousedown={() => playNote(pianoNoteComponents[23].note)}
    >
        {#if $notesVisible["key-24"] || showKeys || hoverNote === pianoNoteComponents[23].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[23].note.name() ? "font-bold" : ""}`}
            >
                B
            </div>
        {/if}
    </button>

    <button
        disabled={pianoNoteComponents[24].disabled}
        id="key-25"
        class={`key white ${hoverNote === pianoNoteComponents[24].note.name() ? "playing" : ""}`}
        on:mouseover={() => showNote("key-25")}
        on:focus
        on:mouseleave={() => hideNote("key-25")}
        on:mousedown={() => playNote(pianoNoteComponents[24].note)}
    >
        {#if $notesVisible["key-25"] || showKeys || hoverNote === pianoNoteComponents[24].note.name()}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === pianoNoteComponents[24].note.name() ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>
</div>

<style>
    .key {
        @apply flex justify-center items-end text-zinc-600 text-base;
    }

    .key:disabled {
        @apply bg-zinc-500 text-zinc-300 opacity-95 shadow-none cursor-not-allowed;
    }

    .note {
        user-select: none;
    }

    .white.playing {
        border: solid 3px rgb(66, 224, 255);
    }

    .black.playing {
        border: solid 3px rgb(66, 224, 255);
    }

    .white {
        @apply bg-zinc-100;
        width: 7.15%;
        height: 100%;
        border: solid 1px black;
        box-sizing: border-box;
        position: absolute;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
    }

    .white:active {
        background-color: rgb(232, 232, 232);
    }

    .black {
        width: 4%;
        height: 60%;
        background-color: black;
        border: solid 1px rgb(74, 74, 74);
        position: absolute;
        z-index: 1;
        box-shadow:
            0 0 20px rgba(255, 255, 255, 0.7),
            0 4px 10px rgba(0, 0, 0, 0.5);
    }

    .black:active {
        background-color: black;
    }
    .black:disabled {
        @apply bg-zinc-800 cursor-not-allowed;
    }

    /* Positioning white keys */
    #key-1 {
        left: 0%;
    }
    #key-3 {
        left: 7.15%;
    }
    #key-5 {
        left: 14.3%;
    }
    #key-6 {
        left: 21.45%;
    }
    #key-8 {
        left: 28.6%;
    }
    #key-10 {
        left: 35.75%;
    }
    #key-12 {
        left: 42.9%;
    }
    #key-13 {
        left: 50.05%;
    }
    #key-15 {
        left: 57.2%;
    }
    #key-17 {
        left: 64.35%;
    }
    #key-18 {
        left: 71.5%;
    }
    #key-20 {
        left: 78.65%;
    }
    #key-22 {
        left: 85.8%;
    }
    #key-24 {
        left: 92.95%;
    }
    #key-25 {
        left: 100.1%;
    }

    /* Positioning black keys */
    #key-2 {
        left: 5%;
    }
    #key-4 {
        left: 12.15%;
    }
    #key-7 {
        left: 26.45%;
    }
    #key-9 {
        left: 33.6%;
    }
    #key-11 {
        left: 40.75%;
    }
    #key-14 {
        left: 55%;
    }
    #key-16 {
        left: 62.15%;
    }
    #key-19 {
        left: 76.45%;
    }
    #key-21 {
        left: 83.6%;
    }
    #key-23 {
        left: 90.75%;
    }
</style>
