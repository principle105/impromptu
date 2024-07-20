<script lang="ts">
    import * as Tone from "tone";
    import Piano from "../lib/components/Piano.svelte";
    import PianoRoll from "../lib/components/PianoRoll.svelte";
    import createSampler from "./sampler.js";
    import { showKeys } from "$lib/stores.js";
    import {
        type recording,
        cntIndex,
        previewSynthCreated,
        generateIntervals,
        exampleProgression,
    } from "./createPossibleNotes";
    import ChoiceButton from "$lib/components/ChoiceButton.svelte";
    import { onMount } from "svelte";
    import { shuffle, sum, delay } from "$lib/util";

    /* FOR PREVIEWING AND SELECTION */
    let hoverNote: string;
    let rollIndex = 0;
    let rollRow = 0;
    let pianoDisabled: boolean = false;

    // This keeps track of which choice in the progression we're on
    let noteChoices: string[][] = [];
    let choiceIndex = 0;

    // These are the choices that the user can pick from at given time
    let currentChoices: { name: string; length: number }[][] = [];

    $: choiceIndex !== 0 ? (pianoDisabled = true) : (pianoDisabled = false);

    $: updateCurrentChoices(noteChoices[choiceIndex]);
    function updateCurrentChoices(notes: string[]) {
        if (!notes) return;

        for (let i = 0; i < 3; i++) {
            currentChoices[i] = [];
            const rhythms = [1, 1 / 2, 1 / 4];
            let rhythmIndex = Math.floor(Math.random() * rhythms.length);
            while (sum(currentChoices[i]) < 1) {
                let noteIndex = Math.floor(Math.random() * (notes.length - 1));

                let note = {
                    name: notes[noteIndex],
                    length: rhythms[rhythmIndex],
                };

                currentChoices[i].push(note);
            }
        }
    }

    /* TO HANDLE SOUND AND PLAYBACK */
    let isPlaying = false;
    let playbackArr: { name: string; length: number }[] = [];

    let synthNotes: Tone.Synth<Tone.SynthOptions>;
    function loadSampler() {
        synthNotes = createSampler();
    }

    /* Synth Initialization */
    let synth: Tone.Synth<Tone.SynthOptions>;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function playPianoNote(key: string) {
        // Handle sound
        synth.triggerAttack(key);

        // Handle dynamically setting choices
        let realKey = key.length === 3 ? key.substring(0, 2) : key[0];

        // TODO: Randomize the chosen chord progression
        let chordProgression = exampleProgression;

        setNoteChoices(realKey, chordProgression);
    }

    function setNoteChoices(key: string, chordProgression: string[]) {
        let intervals = generateIntervals(key);
        // Generate the notes from the chord progression based on the key
        chordProgression.forEach((element: string, i) => {
            noteChoices[i] = [];

            intervals[element] = shuffle(intervals[element]);
            intervals[element].forEach((note: string) => {
                let octave = Math.floor(Math.random()) + 3;
                if (i === exampleProgression.length - 1) {
                    noteChoices[i].push(key + octave);
                    return;
                }
                noteChoices[i].push(note + octave);
            });
            console.log(i + ": " + noteChoices[i]);
        });
    }

    function onRelease() {
        synth.triggerRelease();
    }

    // This makes sure that the sound stops no matter where the mouse up occurs
    onMount(() => {
        window.addEventListener("mouseup", onRelease);
        return () => {
            window.removeEventListener("mouseup", onRelease);
        };
    });

    // This plays finished melody
    // TODO: Harmonize the melody with chords
    async function playbackRecord() {
        let sampler: Tone.Synth<Tone.SynthOptions>;
        sampler = createSampler();
        let now = Tone.now();
        for (let i = 0; i < playbackArr.length; i++) {
            let delayTime = 1000 * playbackArr[i].length;
            hoverNote = playbackArr[i].name;
            rollRow = i;

            if (playbackArr[i].name === "Rest") {
                await delay(delayTime);
                continue;
            }

            sampler.triggerAttackRelease(
                playbackArr[i].name,
                playbackArr[i].length,
                now,
            );
            now += playbackArr[i].length;

            await delay(delayTime);

            // if (playbackArr[i].name == "") {
            //     break;
            // }
            // if (playbackArr[i].name == "Rest") {
            //     //doesnt have to do anything because of how i set this up lmao
            // } else if (i == 0) {
            //     // make sure player cannot choose rest as first note lol
            //     sampler.triggerAttackRelease(
            //         playbackArr[i].name,
            //         playbackArr[i].length,
            //         now,
            //     );
            //     hoverNote = playbackArr[i].name;
            // } else {
            //     hoverNote = playbackArr[i].name;
            //     console.log(i);
            //     sampler.triggerAttackRelease(
            //         playbackArr[i].name,
            //         playbackArr[i].length - playbackArr[i - 1].length,
            //         now + playbackArr[i - 1].length,
            //     );
            // }
        }
    }

    export function saveNote(key: string, length: number) {
        choiceIndex++;

        console.log("save");
        let save: recording = {
            name: key,
            duration: length,
        };
        // qol to make playbacks easier
        // if (cntIndex[0] != 0) {
        //     save.duration += playbackArr[cntIndex[0] - 1].duration;
        // }
        playbackArr.push({ name: key, length });
        // playbackNotes.push({ name: key, length });
        cntIndex[0]++;
    }

    function saveNotes(notes: { name: string; length: number }[]) {
        notes.forEach((note) => {
            saveNote(note.name, note.length);
        });
    }

    export function playNote(
        key: string,
        length: number,
        delay: Tone.Unit.Seconds,
    ) {
        if (!key || !length) return;

        if (previewSynthCreated[0] == false) {
            loadSampler();
            previewSynthCreated[0] = true;
        }
        synthNotes.triggerAttackRelease(key, length);
    }

    let currentlyPlaying = null;

    async function playNotes(notes: { name: string; length: number }[]) {
        // Cancel the currently playing notes if any
        if (currentlyPlaying) {
            currentlyPlaying.cancel();
        }

        // Create a new cancel token for the current run
        const cancelToken = { canceled: false };
        currentlyPlaying = {
            cancel() {
                cancelToken.canceled = true;
            },
        };

        rollRow = 0;

        for (let i = 0; i < notes.length; i++) {
            if (cancelToken.canceled) {
                return;
            }

            let delayTime = 1000 * notes[i].length;
            hoverNote = notes[i].name;
            rollRow = i;

            playNote(notes[i].name, notes[i].length, delayTime);

            await delay(delayTime);
        }

        if (!cancelToken.canceled) {
            hoverNote = "";
        }
    }

    // To check if playback is allowed (if there are notes to be played)
    let canPlay = true;

    // $: {
    //     if (playbackArr) {
    //         canPlay = playbackArr.some(
    //             (note) => note !== undefined && note.name !== "",
    //         );
    //     } else {
    //         canPlay = false;
    //     }
    // }
</script>

<div class="page">
    <!-- HEADER -->
    <div class="header">
        <div class="showKeys">
            <span>Show Keys</span>
            <input type="checkbox" bind:checked={$showKeys} />
        </div>
        <div class="playback">
            <button
                class={isPlaying ? "stop" : ""}
                disabled={!canPlay}
                on:click={playbackRecord}
                >{isPlaying ? "Stop" : "Play"}
            </button>
        </div>
    </div>

    <!-- PIANO ROLL -->
    {#if choiceIndex < noteChoices.length}
        <PianoRoll notes={currentChoices[rollIndex]} selectedIndex={rollRow}
        ></PianoRoll>
    {:else if playbackArr}
        <PianoRoll notes={playbackArr} selectedIndex={rollRow}></PianoRoll>
    {/if}

    <!-- PIANO (for key selection) -->
    <Piano {hoverNote} disabled={pianoDisabled} playNote={playPianoNote}
    ></Piano>

    <!-- CHOICE BUTTONS -->
    {#if choiceIndex < noteChoices.length}
        <div class="mt-8 flex flex-row items-center justify-center">
            <!-- Rest -->
            <ChoiceButton
                notes={[{ name: "Rest", length: 1 }]}
                mouseenter={() => {
                    hoverNote = "";
                }}
                mouseexit={() => {
                    hoverNote = "";
                }}
                click={() => {
                    saveNote("Rest", 1);
                    hoverNote = "";
                }}
            >
                Add a rest
            </ChoiceButton>

            <!-- Choices -->
            {#each currentChoices as notes, i}
                {#if notes}
                    <ChoiceButton
                        {notes}
                        click={() => {
                            saveNotes(notes);
                            rollIndex = 0;
                        }}
                        mouseenter={() => {
                            playNotes(notes);
                            rollIndex = i;
                        }}
                        mouseexit={() => {}}
                    ></ChoiceButton>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .buttonthings {
        background-color: #008cba;
    }
    .page {
        display: flex;
        flex-direction: column;
        align-items: center;

        height: 100vh;
        background-color: #1e1e1e;
        padding: 20px;
    }

    .header {
        display: flex;
        justify-content: right;
        align-items: center;
        width: 100%;
        height: 80px;
        gap: 30px;
    }

    .showKeys {
        display: flex;
        justify-content: right;
        margin-top: 5px;
        gap: 10px;
        height: 100%;
        width: 100%;
        color: rgb(180, 180, 180);
    }

    .showKeys input {
        height: 30px;
        width: 60px;
        border-radius: 30px;
        cursor: pointer;
        appearance: none;
        position: relative;
        background: #4b4b4b;
    }
    .showKeys input::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #8c8c8c;
        transform: translateY(-50%);
        transition: all 0.3s ease;
    }
    .showKeys input:checked::before {
        left: 35px;
        background: #fff;
    }

    .playback {
        display: flex;
        justify-content: center;
        height: 100%;
    }

    .playback button {
        color: rgb(194, 245, 206);
        background-color: rgb(50, 219, 90);
        height: 40px;
        width: 75px;
        border-radius: 10px;
        border: 2px rgb(14, 215, 61) solid;
    }

    .playback button:hover {
        background-color: rgb(89, 210, 117);
    }

    .playback button:active {
        background-color: rgb(59, 191, 90);
    }

    .playback .stop {
        color: rgb(245, 194, 194);
        background-color: rgb(219, 50, 50);
        border: 2px rgb(215, 14, 14) solid;
        height: 40px;
        width: 75px;
        border-radius: 10px;
    }

    .playback .stop:hover {
        background-color: rgb(210, 89, 89);
    }

    .playback .stop:active {
        background-color: rgb(191, 59, 59);
    }

    .playback button:disabled {
        background-color: rgb(97, 97, 97);
        border: 2px rgb(126, 124, 124) solid;
        color: rgb(213, 213, 213);
    }
</style>
