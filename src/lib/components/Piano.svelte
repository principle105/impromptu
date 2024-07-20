<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import { showKeys } from "../stores";
    import createSampler from "../../routes/sampler.js";
    import * as Tone from "tone";
    import {
        createPossibleNotes,
        noteChoices,
        selectQuarterNotesRandom,
    } from "../../routes/createPossibleNotes";
    // manually imported, might be incorrect
    // import { Synth } from "tone/build/esm/instrument/Synth";
    // import { PolySynth } from "tone/build/esm/instrument/PolySynth";
    // import { time } from "console";

    //note played, duration of note played (or lack thereof) in 0.01 secs
    //any space between the previous end and next start is a rest, pretty straightforward

    // old attempt
    // interface RecordNote{
    //   name: string;
    //   durationStart: number;
    //   durationEnd: number;
    // }
    // let empty_thing = {name: "", durationStart: -1, durationEnd: -1};
    // export let cnt = 0;
    // export let recording: RecordNote[] = Array.from({ length: 10000 }, () => empty_thing);
    // the time of the entire piece
    export let timePiece = 0;
    export let hoverNote: string;

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

    // add a thing for timing in a different function (so we can play the entire piece, or something similar)
    export function playNotes(key: Note, length: number, time: number) {
        const synthNotes = new Tone.PolySynth(Tone.Synth).toDestination();
        const now = Tone.now();
        //length is the length of the note (8 = 8th note) (16 = 16th note) etc..
        let realLength = length + "n";
        // key.name is the note's name, realLength is the length of the note, now+time determines when it is played
        synthNotes.triggerAttack(key.name, realLength, now + time);
    }

    export function playNote(key: string, length: number) {
        const synthNotes = new Tone.PolySynth(Tone.Synth).toDestination();
        synthNotes.triggerAttackRelease(key, length);
    }

    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    // const synth = new Tone.Synth().toDestination();
    // for a singular note
    export function playNoteDown(key: Note, length: number, play: boolean) {
        // console.log(recordingArr);
        // console.log(createPossibleNotes(key.name));
        // console.log(selectQuarterNotesRandom(createPossibleNotes(key.name)));
        $noteChoices[0] = selectQuarterNotesRandom(
            createPossibleNotes(key.name),
        );
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
        aria-roledescription="C note"
        id="key-1"
        class="key white"
        on:mouseover={() => showNote("key-1")}
        on:focus
        on:mouseleave={() => hideNote("key-1")}
        on:mousedown={() => playNoteDown(C3, 32, true)}
        on:mouseup={() => playNoteDown(C3, 32, false)}
    >
        {#if $notesVisible["key-1"] || $showKeys || hoverNote === "C3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C</div>
        {/if}
    </button>
    <button
        id="key-2"
        class="key black"
        on:mouseover={() => showNote("key-2")}
        on:focus
        on:mouseleave={() => hideNote("key-2")}
        on:mousedown={() => playNoteDown(CS3, 32, true)}
        on:mouseup={() => playNoteDown(CS3, 32, false)}
    >
        {#if $notesVisible["key-2"] || $showKeys || hoverNote === "C#3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C#</div>
        {/if}
    </button>
    <button
        id="key-3"
        class="key white"
        on:mouseover={() => showNote("key-3")}
        on:focus
        on:mouseleave={() => hideNote("key-3")}
        on:mousedown={() => playNoteDown(D3, 32, true)}
        on:mouseup={() => playNoteDown(D3, 32, false)}
    >
        {#if $notesVisible["key-3"] || $showKeys || hoverNote === "D"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D</div>
        {/if}
    </button>
    <button
        id="key-4"
        class="key black"
        on:mouseover={() => showNote("key-4")}
        on:focus
        on:mouseleave={() => hideNote("key-4")}
        on:mousedown={() => playNoteDown(DS3, 32, true)}
        on:mouseup={() => playNoteDown(DS3, 32, false)}
    >
        {#if $notesVisible["key-4"] || $showKeys || hoverNote === "D#3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D#</div>
        {/if}
    </button>
    <button
        id="key-5"
        class="key white"
        on:mouseover={() => showNote("key-5")}
        on:focus
        on:mouseleave={() => hideNote("key-5")}
        on:mousedown={() => playNoteDown(E3, 32, true)}
        on:mouseup={() => playNoteDown(E3, 32, false)}
    >
        {#if $notesVisible["key-5"] || $showKeys || hoverNote === "E3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">E</div>
        {/if}
    </button>
    <button
        id="key-6"
        class="key white"
        on:mouseover={() => showNote("key-6")}
        on:focus
        on:mouseleave={() => hideNote("key-6")}
        on:mousedown={() => playNoteDown(F3, 32, true)}
        on:mouseup={() => playNoteDown(F3, 32, false)}
    >
        {#if $notesVisible["key-6"] || $showKeys || hoverNote === "F3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F</div>
        {/if}
    </button>
    <button
        id="key-7"
        class="key black"
        on:mouseover={() => showNote("key-7")}
        on:focus
        on:mouseleave={() => hideNote("key-7")}
        on:mousedown={() => playNoteDown(FS3, 32, true)}
        on:mouseup={() => playNoteDown(FS3, 32, false)}
    >
        {#if $notesVisible["key-7"] || $showKeys || hoverNote === "F#3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F#</div>
        {/if}
    </button>
    <button
        id="key-8"
        class="key white"
        on:mouseover={() => showNote("key-8")}
        on:focus
        on:mouseleave={() => hideNote("key-8")}
        on:mousedown={() => playNoteDown(G3, 32, true)}
        on:mouseup={() => playNoteDown(G3, 32, false)}
    >
        {#if $notesVisible["key-8"] || $showKeys || hoverNote === "G3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G</div>
        {/if}
    </button>
    <button
        id="key-9"
        class="key black"
        on:mouseover={() => showNote("key-9")}
        on:focus
        on:mouseleave={() => hideNote("key-9")}
        on:mousedown={() => playNoteDown(GS3, 32, true)}
        on:mouseup={() => playNoteDown(GS3, 32, false)}
    >
        {#if $notesVisible["key-9"] || $showKeys || hoverNote === "G#3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G#</div>
        {/if}
    </button>
    <button
        id="key-10"
        class="key white"
        on:mouseover={() => showNote("key-10")}
        on:focus
        on:mouseleave={() => hideNote("key-10")}
        on:mousedown={() => playNoteDown(A3, 32, true)}
        on:mouseup={() => playNoteDown(A3, 32, false)}
    >
        {#if $notesVisible["key-10"] || $showKeys || hoverNote === "A3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A</div>
        {/if}
    </button>
    <button
        id="key-11"
        class="key black"
        on:mouseover={() => showNote("key-11")}
        on:focus
        on:mouseleave={() => hideNote("key-11")}
        on:mousedown={() => playNoteDown(AS3, 32, true)}
        on:mouseup={() => playNoteDown(AS3, 32, false)}
    >
        {#if $notesVisible["key-11"] || $showKeys || hoverNote === "A#3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A#</div>
        {/if}
    </button>
    <button
        id="key-12"
        class="key white"
        on:mouseover={() => showNote("key-12")}
        on:focus
        on:mouseleave={() => hideNote("key-12")}
        on:mousedown={() => playNoteDown(B3, 32, true)}
        on:mouseup={() => playNoteDown(B3, 32, false)}
    >
        {#if $notesVisible["key-12"] || $showKeys || hoverNote === "B3"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">B</div>
        {/if}
    </button>
    <button
        id="key-13"
        class="key white"
        on:mouseover={() => showNote("key-13")}
        on:focus
        on:mouseleave={() => hideNote("key-13")}
        on:mousedown={() => playNoteDown(C4, 32, true)}
        on:mouseup={() => playNoteDown(C4, 32, false)}
    >
        {#if $notesVisible["key-13"] || $showKeys || hoverNote === "C4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C</div>
        {/if}
    </button>
    <button
        id="key-14"
        class="key black"
        on:mouseover={() => showNote("key-14")}
        on:focus
        on:mouseleave={() => hideNote("key-14")}
        on:mousedown={() => playNoteDown(CS4, 32, true)}
        on:mouseup={() => playNoteDown(CS4, 32, false)}
    >
        {#if $notesVisible["key-14"] || $showKeys || hoverNote === "C#4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C#</div>
        {/if}
    </button>
    <button
        id="key-15"
        class="key white"
        on:mouseover={() => showNote("key-15")}
        on:focus
        on:mouseleave={() => hideNote("key-15")}
        on:mousedown={() => playNoteDown(D4, 32, true)}
        on:mouseup={() => playNoteDown(D4, 32, false)}
    >
        {#if $notesVisible["key-15"] || $showKeys || hoverNote === "D4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D</div>
        {/if}
    </button>
    <button
        id="key-16"
        class="key black"
        on:mouseover={() => showNote("key-16")}
        on:focus
        on:mouseleave={() => hideNote("key-16")}
        on:mousedown={() => playNoteDown(DS4, 32, true)}
        on:mouseup={() => playNoteDown(DS4, 32, false)}
    >
        {#if $notesVisible["key-16"] || $showKeys || hoverNote === "D#4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D#</div>
        {/if}
    </button>
    <button
        id="key-17"
        class="key white"
        on:mouseover={() => showNote("key-17")}
        on:focus
        on:mouseleave={() => hideNote("key-17")}
        on:mousedown={() => playNoteDown(E4, 32, true)}
        on:mouseup={() => playNoteDown(E4, 32, false)}
    >
        {#if $notesVisible["key-17"] || $showKeys || hoverNote === "E4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">E</div>
        {/if}
    </button>
    <button
        id="key-18"
        class="key white"
        on:mouseover={() => showNote("key-18")}
        on:focus
        on:mouseleave={() => hideNote("key-18")}
        on:mousedown={() => playNoteDown(F4, 32, true)}
        on:mouseup={() => playNoteDown(F4, 32, false)}
    >
        {#if $notesVisible["key-18"] || $showKeys || hoverNote === "F4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F</div>
        {/if}
    </button>
    <button
        id="key-19"
        class="key black"
        on:mouseover={() => showNote("key-19")}
        on:focus
        on:mouseleave={() => hideNote("key-19")}
        on:mousedown={() => playNoteDown(FS4, 32, true)}
        on:mouseup={() => playNoteDown(FS4, 32, false)}
    >
        {#if $notesVisible["key-19"] || $showKeys || hoverNote === "F#4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F#</div>
        {/if}
    </button>
    <button
        id="key-20"
        class="key white"
        on:mouseover={() => showNote("key-20")}
        on:focus
        on:mouseleave={() => hideNote("key-20")}
        on:mousedown={() => playNoteDown(G4, 32, true)}
        on:mouseup={() => playNoteDown(G4, 32, false)}
    >
        {#if $notesVisible["key-20"] || $showKeys || hoverNote === "G4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G</div>
        {/if}
    </button>
    <button
        id="key-21"
        class="key black"
        on:mouseover={() => showNote("key-21")}
        on:focus
        on:mouseleave={() => hideNote("key-21")}
        on:mousedown={() => playNoteDown(GS4, 32, true)}
        on:mouseup={() => playNoteDown(GS4, 32, false)}
    >
        {#if $notesVisible["key-21"] || $showKeys || hoverNote === "G#4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G#</div>
        {/if}
    </button>
    <button
        id="key-22"
        class="key white"
        on:mouseover={() => showNote("key-22")}
        on:focus
        on:mouseleave={() => hideNote("key-22")}
        on:mousedown={() => playNoteDown(A4, 32, true)}
        on:mouseup={() => playNoteDown(A4, 32, false)}
    >
        {#if $notesVisible["key-22"] || $showKeys || hoverNote === "A4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A</div>
        {/if}
    </button>
    <button
        id="key-23"
        class="key black"
        on:mouseover={() => showNote("key-23")}
        on:focus
        on:mouseleave={() => hideNote("key-23")}
        on:mousedown={() => playNoteDown(AS4, 32, true)}
        on:mouseup={() => playNoteDown(AS4, 32, false)}
    >
        {#if $notesVisible["key-23"] || $showKeys || hoverNote === "A#4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A#</div>
        {/if}
    </button>
    <button
        id="key-24"
        class="key white"
        on:mouseover={() => showNote("key-24")}
        on:focus
        on:mouseleave={() => hideNote("key-24")}
        on:mousedown={() => playNoteDown(B4, 32, true)}
        on:mouseup={() => playNoteDown(B4, 32, false)}
    >
        {#if $notesVisible["key-24"] || $showKeys || hoverNote === "B4"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">B</div>
        {/if}
    </button>
    <button
        id="key-25"
        class="key white"
        on:mouseover={() => showNote("key-25")}
        on:focus
        on:mouseleave={() => hideNote("key-25")}
        on:mousedown={() => playNoteDown(C5, 32, true)}
        on:mouseup={() => playNoteDown(C5, 32, false)}
    >
        {#if $notesVisible["key-25"] || $showKeys || hoverNote === "C5"}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C</div>
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

    .key.white {
        width: 7.15%;
        height: 100%;
        background-color: white;
        border: solid 1px black;
        box-sizing: border-box;
        position: absolute;
    }

    .key.white:active {
        background-color: rgb(232, 232, 232);
    }

    .key.black {
        width: 4%;
        height: 60%;
        background-color: black;
        border: solid 1px rgb(74, 74, 74);
        position: absolute;
        z-index: 1;
    }

    .key.black:active {
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
