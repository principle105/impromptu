<script lang="ts">
    import * as Tone from "tone";
    import Piano from "$lib/components/Piano.svelte";
    import PianoRoll from "$lib/components/PianoRoll.svelte";
    import createSampler from "./sampler.js";
    import Graph from "./Graph.svelte";
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

    import IconBack from "~icons/material-symbols/arrow-back-ios";
    import IconForward from "~icons/material-symbols/arrow-forward-ios";

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
        melody[measureIndex] = { notes: generateEmptyMeasure(selectedRhythm) };
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
        {
            name: "Eigth Notes",
            rhythm: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
        },
    ];

    let selectedRhythm: number[] = rhythmCatalog[2].rhythm;

    function setMeasureNote(note: string, octave: string) {
        melody[measureIndex].notes[inMeasureIndex].note = note;
        melody[measureIndex].notes[inMeasureIndex].octave = octave;

        // Either increment the current line or go to the next measure or finish
        if (inMeasureIndex + 1 < melody[measureIndex].notes.length) {
            inMeasureIndex++;
        } else {
            if (measureIndex < noteChoices.length - 1) {
                nextMeasure();
            } else {
                finish();
            }
        }
    }

    function deleteMeasureNote(i: number) {
        melody[measureIndex].notes[i].note = "";
        melody[measureIndex].notes[i].octave = "";
    }

    function nextMeasure() {
        measureIndex++;

        setTimeout(() => {
            synth.triggerRelease();
        }, 100);

        if (!melody[measureIndex]) {
            melody[measureIndex] = { notes: [] };
            melody[measureIndex].notes = generateEmptyMeasure(selectedRhythm);
        }

        inMeasureIndex = 0;
    }

    function previousMeasure() {
        if (measureIndex - 1 < 0) return;

        measureIndex--;
        inMeasureIndex = 0;
    }

    function onChangeRhythm() {
        melody[measureIndex].notes = generateEmptyMeasure(selectedRhythm);
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
        // melody[measureIndex] = { notes: [] };
        // melody[measureIndex].notes = measure;
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
</script>

{#if !keyInitialized}
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
    <div class="bg-[#1e1e1e] min-h-screen">
        <!-- HEADER -->
        <div class="flex justify-between p-4">
            <div class="flex items-center text-white">
                <span class="mr-2">Show Keys</span>
                <input
                    type="checkbox"
                    bind:checked={$showKeys}
                    class="form-checkbox"
                />
            </div>
            <div class="playback">
                <button
                    class="{isPlaying
                        ? 'stop'
                        : ''} bg-transparent text-[#f8f8ff] border-2 border-[#f8f8ff] rounded px-4 py-2 cursor-pointer text-lg transition-colors hover:bg-[#f8f8ff] hover:text-black"
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
        <div class="grid grid-cols-6 gap-4">
            <div class="col-span-4 flex justify-center items-center flex-col">
                <div class="flex">
                    <div>
                        <button
                            on:click={previousMeasure}
                            class="text-gray-400 p-4 hover:text-gray-300"
                        >
                            <IconBack />
                        </button>
                    </div>
                    <div>
                        <!-- PIANO -->
                        <div class="bg-gray h-fit w-fit">
                            <!-- ROLL -->
                            {#if !finished}
                                <PianoRoll
                                    notes={melody[measureIndex].notes}
                                    bind:selectedIndex={inMeasureIndex}
                                    deleteNote={deleteMeasureNote}
                                ></PianoRoll>
                            {:else}
                                <PianoRoll
                                    notes={melodyToNotes}
                                    selectedIndex={rollRow}
                                    canEdit={false}
                                    deleteNote={deleteMeasureNote}
                                ></PianoRoll>
                            {/if}

                            <!-- KEYS -->
                            <Piano
                                {hoverNote}
                                playNote={(key) => {
                                    playPianoNote(key.name());
                                    if (!finished)
                                        setMeasureNote(key.note, key.octave);
                                }}
                                selectableNotes={!finished
                                    ? noteChoices[measureIndex].notes
                                    : allNotes()}
                            ></Piano>
                        </div>
                    </div>
                    <div>
                        <button
                            on:click={() => {
                                if (measureIndex < noteChoices.length - 1) {
                                    nextMeasure();
                                } else {
                                    finish();
                                }
                            }}
                            class="text-gray-400 p-4 hover:text-gray-300"
                        >
                            <IconForward />
                        </button>
                    </div>
                </div>
                <!-- RHYTHM BUTTONS -->
                <div
                    class="mt-8 flex flex-row items-center justify-center gap-2"
                >
                    {#each rhythmCatalog as { name, rhythm }}
                        <button
                            on:click={() => {selectedRhythm = rhythm; onChangeRhythm()}}
                            class="bg-slate-100 m-2"
                        >
                            {name}
                        </button>
                    {/each}
                </div>
            </div>
            <div class="col-span-2">
                <Graph bind:this={graphRef} notes={melodyToNotes} />
            </div>
        </div>
    </div>
{/if}
