<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import { showKeys } from "../stores";
    import createSampler from "../../routes/sampler.js";
    import * as Tone from "tone";
    import {
        createPossibleNotes,
        exampleProgression,
        generateIntervals,
    } from "../../routes/createPossibleNotes";
    import { shuffle } from "$lib/util";

    export let timePiece = 0;
    export let hoverNote: string;
    export let disabled: boolean = false;
    export let playNote: (key: string) => void;

    let seconds = 0;
    let interval: any;
    let sampler: Tone.Synth<Tone.SynthOptions>;
    let hasLoaded = true;
    function loadSampler() {
        sampler = createSampler();
    }

    interface Note {
        name: string;
    }
    let C3: Note = { name: "C3" };
    let CS3: Note = { name: "C#3" };
    let D3: Note = { name: "D3" };
    let DS3: Note = { name: "D#3" };
    let E3: Note = { name: "E3" };
    let F3: Note = { name: "F3" };
    let FS3: Note = { name: "F#3" };
    let G3: Note = { name: "G3" };
    let GS3: Note = { name: "G#3" };
    let A3: Note = { name: "A3" };
    let AS3: Note = { name: "A#3" };
    let B3: Note = { name: "B3" };
    let C4: Note = { name: "C4" };
    let CS4: Note = { name: "C#4" };
    let D4: Note = { name: "D4" };
    let DS4: Note = { name: "D#4" };
    let E4: Note = { name: "E4" };
    let F4: Note = { name: "F4" };
    let FS4: Note = { name: "F#4" };
    let G4: Note = { name: "G4" };
    let GS4: Note = { name: "G#4" };
    let A4: Note = { name: "A4" };
    let AS4: Note = { name: "A#4" };
    let B4: Note = { name: "B4" };
    let C5: Note = { name: "C5" };

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

    // export function togglePiano() {
    //   // doesnt export properly in page.tsx in custom
    //   disabled = !disabled;
    // }

    function showNote(key: string) {
        notesVisible.update((nv) => ({ ...nv, [key]: true }));
    }

    function hideNote(key: string) {
        notesVisible.update((nv) => ({ ...nv, [key]: false }));
    }

    const startInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => {
            seconds++;
            // console.log(seconds);
        }, 10);
    };

    // export function playNote(key: string, length: number) {
    //     const synthNotes = new Tone.PolySynth(Tone.Synth).toDestination();
    //     synthNotes.triggerAttackRelease(key, length);
    // }

    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    // const synth = new Tone.Synth().toDestination();
    // for a singular note
    export function playNoteDown(key: Note, length: number, play: boolean) {
        // console.log(recordingArr);
        console.log(createPossibleNotes(key.name));
        // console.log(selectQuarterNotesRandom(createPossibleNotes(key.name)));

        // $noteChoices[0] = selectQuarterNotesRandom(
        //     createPossibleNotes(key.name),
        // );

        // let why = Array.from({ length: 10000 }, () => empty_thing);
        // console.log(why);
        // console.log("j");
        if (hasLoaded) {
            loadSampler();
            hasLoaded = false;
            startInterval();
        }
        const now = Tone.now();
        //length is the length of the note (8 = 8th note) (16 = 16th note) etc..
        if (play) {
            // console.log("attack");
            // recording[cnt].name = key.name;
            // recording[cnt].durationStart = seconds;
            let realLength = length + "n";
            const now = Tone.now();
            console.log(key.name);
            // key.name is the note's name, realLength is the length of the note
            sampler.triggerAttack(key.name);
        } else {
            // console.log("release");
            // recording[cnt].durationEnd = seconds;

            // change it so that timepiece is completely
            timePiece = seconds;

            // console.log(timePiece);
            // console.log(recording);
            let realLength = length + "n";
            // console.log(key.name);
            sampler.triggerRelease("+0");
            // console.log(cnt);
            // cnt++;
        }
    }
</script>

<div class="container">
    <button
        {disabled}
        id="key-1"
        class={`key white ${hoverNote === "C3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-1")}
        on:focus
        on:mouseleave={() => hideNote("key-1")}
        on:mousedown={() => playNote("C3")}
    >
        {#if $notesVisible["key-1"] || $showKeys || hoverNote === "C3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "C3" ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-2"
        class={`key black ${hoverNote === "C#3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-2")}
        on:focus
        on:mouseleave={() => hideNote("key-2")}
        on:mousedown={() => playNote("C#3")}
    >
        {#if $notesVisible["key-2"] || $showKeys || hoverNote === "C#3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "C#3" ? "font-bold" : ""}`}
            >
                C#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-3"
        class={`key white ${hoverNote === "D3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-3")}
        on:focus
        on:mouseleave={() => hideNote("key-3")}
        on:mousedown={() => playNote("D3")}
    >
        {#if $notesVisible["key-3"] || $showKeys || hoverNote === "D"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "D3" ? "font-bold" : ""}`}
            >
                D
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-4"
        class={`key black ${hoverNote === "D#3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-4")}
        on:focus
        on:mouseleave={() => hideNote("key-4")}
        on:mousedown={() => playNote("D#3")}
    >
        {#if $notesVisible["key-4"] || $showKeys || hoverNote === "D#3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "D#3" ? "font-bold" : ""}`}
            >
                D#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-5"
        class={`key white ${hoverNote === "E3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-5")}
        on:focus
        on:mouseleave={() => hideNote("key-5")}
        on:mousedown={() => playNote("E3")}
    >
        {#if $notesVisible["key-5"] || $showKeys || hoverNote === "E3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "E3" ? "font-bold" : ""}`}
            >
                E
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-6"
        class={`key white ${hoverNote === "F3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-6")}
        on:focus
        on:mouseleave={() => hideNote("key-6")}
        on:mousedown={() => playNote("F3")}
    >
        {#if $notesVisible["key-6"] || $showKeys || hoverNote === "F3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "F3" ? "font-bold" : ""}`}
            >
                F
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-7"
        class={`key black ${hoverNote === "F#3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-7")}
        on:focus
        on:mouseleave={() => hideNote("key-7")}
        on:mousedown={() => playNote("F#3")}
    >
        {#if $notesVisible["key-7"] || $showKeys || hoverNote === "F#3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "F#3" ? "font-bold" : ""}`}
            >
                F#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-8"
        class={`key white ${hoverNote === "G3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-8")}
        on:focus
        on:mouseleave={() => hideNote("key-8")}
        on:mousedown={() => playNote("G3")}
    >
        {#if $notesVisible["key-8"] || $showKeys || hoverNote === "G3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "G3" ? "font-bold" : ""}`}
            >
                G
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-9"
        class={`key black ${hoverNote === "G#3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-9")}
        on:focus
        on:mouseleave={() => hideNote("key-9")}
        on:mousedown={() => playNote("G#3")}
    >
        {#if $notesVisible["key-9"] || $showKeys || hoverNote === "G#3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "G#3" ? "font-bold" : ""}`}
            >
                G#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-10"
        class={`key white ${hoverNote === "A3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-10")}
        on:focus
        on:mouseleave={() => hideNote("key-10")}
        on:mousedown={() => playNote("A3")}
    >
        {#if $notesVisible["key-10"] || $showKeys || hoverNote === "A3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "A3" ? "font-bold" : ""}`}
            >
                A
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-11"
        class={`key black ${hoverNote === "A#3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-11")}
        on:focus
        on:mouseleave={() => hideNote("key-11")}
        on:mousedown={() => playNote("A#3")}
    >
        {#if $notesVisible["key-11"] || $showKeys || hoverNote === "A#3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "A#3" ? "font-bold" : ""}`}
            >
                A#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-12"
        class={`key white ${hoverNote === "B3" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-12")}
        on:focus
        on:mouseleave={() => hideNote("key-12")}
        on:mousedown={() => playNote("B3")}
    >
        {#if $notesVisible["key-12"] || $showKeys || hoverNote === "B3"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "B3" ? "font-bold" : ""}`}
            >
                B
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-13"
        class={`key white ${hoverNote === "C4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-13")}
        on:focus
        on:mouseleave={() => hideNote("key-13")}
        on:mousedown={() => playNote("C4")}
    >
        {#if $notesVisible["key-13"] || $showKeys || hoverNote === "C4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "C4" ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-14"
        class={`key black ${hoverNote === "C#4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-14")}
        on:focus
        on:mouseleave={() => hideNote("key-14")}
        on:mousedown={() => playNote("C#4")}
    >
        {#if $notesVisible["key-14"] || $showKeys || hoverNote === "C#4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "C#4" ? "font-bold" : ""}`}
            >
                C#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-15"
        class={`key white ${hoverNote === "D4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-15")}
        on:focus
        on:mouseleave={() => hideNote("key-15")}
        on:mousedown={() => playNote("D4")}
    >
        {#if $notesVisible["key-15"] || $showKeys || hoverNote === "D4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "D4" ? "font-bold" : ""}`}
            >
                D
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-16"
        class={`key black ${hoverNote === "D#4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-16")}
        on:focus
        on:mouseleave={() => hideNote("key-16")}
        on:mousedown={() => playNote("D#4")}
    >
        {#if $notesVisible["key-16"] || $showKeys || hoverNote === "D#4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "D#4" ? "font-bold" : ""}`}
            >
                D#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-17"
        class={`key white ${hoverNote === "E4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-17")}
        on:focus
        on:mouseleave={() => hideNote("key-17")}
        on:mousedown={() => playNote("E4")}
    >
        {#if $notesVisible["key-17"] || $showKeys || hoverNote === "E4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "E4" ? "font-bold" : ""}`}
            >
                E
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-18"
        class={`key white ${hoverNote === "F4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-18")}
        on:focus
        on:mouseleave={() => hideNote("key-18")}
        on:mousedown={() => playNote("F4")}
    >
        {#if $notesVisible["key-18"] || $showKeys || hoverNote === "F4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "F4" ? "font-bold" : ""}`}
            >
                F
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-19"
        class={`key black ${hoverNote === "F#4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-19")}
        on:focus
        on:mouseleave={() => hideNote("key-19")}
        on:mousedown={() => playNote("F#4")}
    >
        {#if $notesVisible["key-19"] || $showKeys || hoverNote === "F#4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "F#4" ? "font-bold" : ""}`}
            >
                F#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-20"
        class={`key white ${hoverNote === "G4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-20")}
        on:focus
        on:mouseleave={() => hideNote("key-20")}
        on:mousedown={() => playNote("G4")}
    >
        {#if $notesVisible["key-20"] || $showKeys || hoverNote === "G4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "G4" ? "font-bold" : ""}`}
            >
                G
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-21"
        class={`key black ${hoverNote === "G#4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-21")}
        on:focus
        on:mouseleave={() => hideNote("key-21")}
        on:mousedown={() => playNote("G#4")}
    >
        {#if $notesVisible["key-21"] || $showKeys || hoverNote === "G#4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "G#4" ? "font-bold" : ""}`}
            >
                G#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-22"
        class={`key white ${hoverNote === "A4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-22")}
        on:focus
        on:mouseleave={() => hideNote("key-22")}
        on:mousedown={() => playNote("A4")}
    >
        {#if $notesVisible["key-22"] || $showKeys || hoverNote === "A4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "A4" ? "font-bold" : ""}`}
            >
                A
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-23"
        class={`key black ${hoverNote === "A#4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-23")}
        on:focus
        on:mouseleave={() => hideNote("key-23")}
        on:mousedown={() => playNote("A#4")}
    >
        {#if $notesVisible["key-23"] || $showKeys || hoverNote === "A#4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "A#4" ? "font-bold" : ""}`}
            >
                A#
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-24"
        class={`key white ${hoverNote === "B4" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-24")}
        on:focus
        on:mouseleave={() => hideNote("key-24")}
        on:mousedown={() => playNote("B4")}
    >
        {#if $notesVisible["key-24"] || $showKeys || hoverNote === "B4"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "B4" ? "font-bold" : ""}`}
            >
                B
            </div>
        {/if}
    </button>
    <button
        {disabled}
        id="key-25"
        class={`key white ${hoverNote === "C5" ? "playing" : ""}`}
        on:mouseover={() => showNote("key-25")}
        on:focus
        on:mouseleave={() => hideNote("key-25")}
        on:mousedown={() => playNote("C5")}
    >
        {#if $notesVisible["key-25"] || $showKeys || hoverNote === "C5"}
            <div
                transition:fly={{ y: 10, duration: 300 }}
                class={`note ${hoverNote === "C5" ? "font-bold" : ""}`}
            >
                C
            </div>
        {/if}
    </button>
</div>

<style>
    .container {
        position: relative;
        height: 200px;
        width: 600px;
    }

    .key {
        display: flex;
        justify-content: center;
        align-items: end;
        color: gray;
        font-size: 16px;
        font-family: sans-serif;
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
        width: 7.15%;
        height: 100%;
        background-color: white;
        border: solid 1px black;
        box-sizing: border-box;
        position: absolute;
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
    }

    .black:active {
        background-color: rgb(18, 18, 18);
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
