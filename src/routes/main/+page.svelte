<script lang="ts">
    import * as Tone from "tone";
    import Piano from "$lib/components/Piano.svelte";
    import PianoRoll from "$lib/components/PianoRoll.svelte";
    import createSampler from "./sampler.js";
    import Graph from "$lib/components/Graph.svelte";
    import { showKeys } from "$lib/stores.js";
    import {
        generateIntervals,
        exampleProgression,
        majorTriads,
        Note,
        Measure,
        generateEmptyMeasure,
        allNotes,
    } from "./createPossibleNotes";
    import { onMount } from "svelte";
    import { delay } from "$lib/util";

    // The current measure and chord (noteChoices) both correspond to the same index
    let melody: Measure[] = [];
    let noteChoices: Measure[] = [{ notes: [] }];
    let measureIndex = 0;
    let inMeasureIndex = 0;

    function playPianoNote(key: string) {
        synth.triggerAttack(key);
    }

    let keyInitialized = false;

    function setKey(key: Note) {
        let chordProgression = exampleProgression;
        setNoteChoices(key.note, chordProgression);
        keyInitialized = true;
    }

    function setNoteChoices(key: string, chordProgression: string[]) {
        let intervals = generateIntervals(key);
        chordProgression.forEach((element: string, i) => {
            noteChoices[i] = { notes: [] };
            intervals[element].forEach((note: string) => {
                noteChoices[i].notes.push(new Note(note));
            });
        });
    }

    let rhythmCatalog = [
        { name: "Whole Note", rhythm: [1] },
        { name: "Half Notes", rhythm: [1 / 2, 1 / 2] },
        { name: "Quarter Notes", rhythm: [1 / 4, 1 / 4, 1 / 4, 1 / 4] },
        { name: "Eigth Notes", rhythm: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8] },
    ];

    let selectedRhythm: number[] = rhythmCatalog[2].rhythm;
    $: measure = generateEmptyMeasure(selectedRhythm);

    function setMeasureNote(note: string, octave: string) {
        measure[inMeasureIndex].note = note;
        measure[inMeasureIndex].octave = octave;

        if (inMeasureIndex + 1 < measure.length) inMeasureIndex++;
    }

    function nextMeasure() {
        melody[measureIndex] = { notes: [] };
        melody[measureIndex].notes = measure;
        measure = generateEmptyMeasure(selectedRhythm);
        measureIndex++;
        inMeasureIndex = 0;
    }

    let finished = false;

    function measureArrayToNoteArray(melody: Measure[]) {
        const notes: Note[] = [];
        for (let i = 0; i < melody.length; i++) {
            for (let j = 0; j < melody[i].notes.length; j++) {
                notes.push(melody[i].notes[j]);
            }
        }
        return notes;
    }

    $: melodyToNotes = measureArrayToNoteArray(melody);

    function finish() {
        melody[measureIndex] = { notes: [] };
        melody[measureIndex].notes = measure;
        finished = true;
    }

    let hoverNote: string;
    let rollRow = 0;

    let graphRef;

    let isPlaying = false;

    let synth: Tone.Synth<Tone.SynthOptions>;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function onRelease() {
        synth.triggerRelease();
    }

    onMount(() => {
        window.addEventListener("mouseup", onRelease);
        return () => {
            window.removeEventListener("mouseup", onRelease);
        };
    });

    let flagStart = false;
    let startingTimeNow = -1;

    function stopPlayback() {
        isPlaying = false;
    }

    async function playbackRecord() {
        isPlaying = true;
        let sampler: Tone.Synth<Tone.SynthOptions>;
        sampler = createSampler();
        let backgroundSynth: Tone.Synth<Tone.SynthOptions>;
        backgroundSynth = createSampler();
        backgroundSynth.volume.value -= 20;
        let now = Tone.now();
        if (flagStart == false) {
            startingTimeNow = now;
        }
        for (let i = 0; i < melodyToNotes.length; i++) {
            if (!isPlaying) break;

            let delayTime = 1000 * melodyToNotes[i].length;
            hoverNote = melodyToNotes[i].name();
            rollRow = i;

            if (melodyToNotes[i].note === "") {
                now += melodyToNotes[i].length;
                await delay(delayTime);
                continue;
            }

            let backingTrack;
            let combineTracks;
            let isBacking = false;
            console.log(now + " now");
            console.log(startingTimeNow + " original now");

            if ((now - startingTimeNow) % 1 == 0) {
                backingTrack = majorTriads[melodyToNotes[i].note];
                isBacking = true;
                combineTracks = [
                    backingTrack[0],
                    backingTrack[1],
                    backingTrack[2],
                ];
            }

            sampler.triggerAttackRelease(
                melodyToNotes[i].name(),
                melodyToNotes[i].length,
                now,
            );
            if (isBacking == true) {
                console.log("works backing");
                backgroundSynth.triggerAttackRelease(combineTracks, 1, now);
            }

            now += melodyToNotes[i].length;
            await delay(delayTime);
        }
        flagStart = false;
        hoverNote = "";
        isPlaying = false;
    }

    const noteFrequencies = {
        C3: 130.81,
        "C#3": 138.59,
        D3: 146.83,
        "D#3": 155.56,
        E3: 164.81,
        F3: 174.61,
        "F#3": 185.0,
        G3: 196.0,
        "G#3": 207.65,
        A3: 220.0,
        "A#3": 233.08,
        B3: 246.94,
        C4: 261.63,
        "C#4": 277.18,
        D4: 293.66,
        "D#4": 311.13,
        E4: 329.63,
        F4: 349.23,
        "F#4": 369.99,
        G4: 392.0,
        "G#4": 415.3,
        A4: 440.0,
        "A#4": 466.16,
        B4: 493.88,
        C5: 523.25,
    };
</script>

{#if !keyInitialized}
    <div
        class="h-[100vh] w-[100vw] bg-[#1e1e1e] flex flex-col items-center justify-center"
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
                        synth.triggerAttack(key.name());
                        setTimeout(() => {
                            synth.triggerRelease();
                        }, 200);
                        setKey(key);
                    }}
                ></Piano>
            </div>
        </div>
    </div>
{:else}
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
                    disabled={!finished}
                    on:click={() => {
                        if (isPlaying) {
                            stopPlayback();
                        } else {
                            playbackRecord();
                        }
                    }}
                    >{isPlaying ? "Stop" : "Play"}
                </button>
            </div>
        </div>
        <div class="grid grid-cols-6">
            <div
                class="left flex justify-center items-center flex-col col-span-4"
            >
                <div class="bg-gray h-fit w-fit">
                    <!-- PIANO ROLL -->
                    {#if !finished}
                        <PianoRoll
                            notes={measure}
                            bind:selectedIndex={inMeasureIndex}
                        ></PianoRoll>
                    {:else}
                        <PianoRoll
                            notes={melodyToNotes}
                            selectedIndex={rollRow}
                            canEdit={false}
                        ></PianoRoll>
                    {/if}

                    <!-- PIANO (for key selection) -->
                    <Piano
                        {hoverNote}
                        playNote={(key) => {
                            playPianoNote(key.name());

                            setMeasureNote(key.note, key.octave);
                        }}
                        selectableNotes={!finished
                            ? noteChoices[measureIndex].notes
                            : allNotes()}
                    ></Piano>
                </div>
                <!-- CHOICE BUTTONS -->

                <div class="mt-8 flex flex-row items-center justify-center">
                    {#each rhythmCatalog as { name, rhythm }}
                        <button
                            on:click={() => (selectedRhythm = rhythm)}
                            class="bg-slate-100 m-2"
                        >
                            {name}
                        </button>
                    {/each}
                    {#if measureIndex < noteChoices.length - 1}
                        <div>
                            <button on:click={nextMeasure}>
                                Next Measure
                            </button>
                        </div>
                    {:else}
                        <div>
                            <button on:click={finish}> Finish </button>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="right">
                <Graph bind:this={graphRef} playbackArr={melodyToNotes} />
            </div>
        </div>
    </div>
{/if}

<!-- <html>
    <body class="mainContainer">
        <div class="home-screen">
            <div class="title">Impromptu</div>
            <div class="buttons">
                <a href="/main">
                    <button id="play">Start</button>
                </a>
                <a>
                    <button id="learn"> Tutorial </button>
                </a>
            </div>
        </div>
    </body>
</html> -->

<style>
    body,
    html {
        margin: 0;
        padding: 0;
        height: 100%;
        background-image: url(../background.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        font-family: Arial, sans-serif;
    }

    .home-screen {
        color: white;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 0;
        text-align: center;
    }

    a {
        text-decoration: none;
    }

    .title {
        cursor: pointer;
        margin-top: 20vw;
        font-size: 6vw;
        font-weight: bold;
        color: #e6e6fa;
    }

    .title:hover {
        transform: scale(1.1);
        color: #e0ffff;
    }

    .buttons {
        margin-top: 1vw;
        display: flex;
        flex-direction: row;
        gap: 4vw;
    }

    button {
        background-color: transparent;
        color: #f8f8ff;
        border: 2px solid #f8f8ff;
        border-radius: 5px;
        padding: 0.75vw 1.5vw;
        margin: 1vw 0;
        cursor: pointer;
        font-size: 1.2vw;
        transition:
            background-color 0.3s,
            color 0.3s;
    }

    button:hover {
        background-color: #f8f8ff;
        color: black;
    }

    .fade-out {
        animation: fadeOutAnimation 1s ease forwards;
    }

    @keyframes fadeOutAnimation {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
