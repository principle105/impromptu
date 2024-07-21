<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import Piano from "$lib/components/Piano.svelte";
    import PianoRoll from "$lib/components/PianoRoll.svelte";
    import Graph from "$lib/components/Graph.svelte";

    import createSampler from "$lib/sampler";
    import {
        generateIntervals,
        Note,
        Measure,
        generateEmptyMeasure,
        getAllNotes,
    } from "$lib/notes";
    import {
        DOMINANT_CADENCE,
        POSSIBLE_PROGRESSIONS,
        MAJOR_TRIADS_MAP,
    } from "$lib/constants";
    import { delay } from "$lib/utils";
    import type { Chord, NoteName } from "$lib/types";

    // Icons
    import IconBack from "~icons/material-symbols/arrow-back-ios";
    import IconForward from "~icons/material-symbols/arrow-forward-ios";
    import IconWholeNote from "~icons/mdi/music-note-whole";
    import IconHalfNote from "~icons/mdi/music-note-half";
    import IconQuarterNote from "~icons/mdi/music-note-quarter";
    import IconEighthNote from "~icons/mdi/music-note-eighth";
    import ChooseKeyToStart from "$lib/components/ChooseKeyToStart.svelte";

    // The current measure and chord (noteChoices) both correspond to the same index
    let melody: Measure[] = [];
    let noteChoices: Measure[] = [{ notes: [] }];
    let measureIndex = 0;
    let inMeasureIndex = 0;

    let isFirstKeyChosen = false;

    const playPianoNote = (key: string) => {
        synth.triggerAttack(key);
    };

    const rand = Math.floor(Math.random() * POSSIBLE_PROGRESSIONS.length);

    const chordProgression = [
        ...POSSIBLE_PROGRESSIONS[rand],
        ...DOMINANT_CADENCE,
    ];

    const setKey = (key: Note) => {
        if (key.note === "") return;

        setNoteChoices(key.note, chordProgression);

        melody[measureIndex] = { notes: generateEmptyMeasure(selectedRhythm) };
        isFirstKeyChosen = true;
    };

    const setNoteChoices = (key: NoteName, chordProgression: Chord[]) => {
        let intervals = generateIntervals(key);

        chordProgression.forEach((element, i) => {
            noteChoices[i] = { notes: [] };

            intervals[element].forEach((note: NoteName) => {
                noteChoices[i].notes.push(new Note(note));
            });
        });
    };

    const rhythms = [
        { name: "Whole Note", rhythm: [1] },
        { name: "Half Notes", rhythm: [1 / 2, 1 / 2] },
        { name: "Quarter Notes", rhythm: [1 / 4, 1 / 4, 1 / 4, 1 / 4] },
        {
            name: "Eighth Notes",
            rhythm: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
        },
    ];

    let selectedRhythm: number[] = rhythms[2].rhythm;

    const setMeasureNote = (note: NoteName, octave: string) => {
        melody[measureIndex].notes[inMeasureIndex].note = note;
        melody[measureIndex].notes[inMeasureIndex].octave = octave;

        // Either increment the current line or go to the next measure or finish
        if (inMeasureIndex + 1 < melody[measureIndex].notes.length) {
            inMeasureIndex++;
        } else if (measureIndex < noteChoices.length - 1) {
            nextMeasure();
        } else {
            finished = true;
        }
    };

    const deleteMeasureNote = (i: number) => {
        melody[measureIndex].notes[i].note = "";
        melody[measureIndex].notes[i].octave = "";
    };

    const nextMeasure = () => {
        if (finished) return;

        measureIndex++;

        setTimeout(() => {
            synth.triggerRelease();
        }, 100);

        if (!melody[measureIndex]) {
            melody[measureIndex] = { notes: [] };
            melody[measureIndex].notes = generateEmptyMeasure(selectedRhythm);
        }

        inMeasureIndex = 0;
    };

    const previousMeasure = () => {
        if (measureIndex - 1 < 0 || finished) return;

        measureIndex--;
        inMeasureIndex = 0;
    };

    const onChangeRhythm = () => {
        melody[measureIndex].notes = generateEmptyMeasure(selectedRhythm);
        inMeasureIndex = 0;
    };

    let finished = false;

    const measureArrayToNoteArray = (melody: Measure[]) => {
        const notes: Note[] = [];
        for (let i = 0; i < melody.length; i++) {
            for (let j = 0; j < melody[i].notes.length; j++) {
                notes.push(melody[i].notes[j]);
            }
        }
        return notes;
    };

    $: melodyToNotes = measureArrayToNoteArray(melody);

    let hoverNote: string;
    let rollRow = 0;

    let graphRef;

    let isPlaying = false;

    let synth: Tone.Synth<Tone.SynthOptions>;

    onMount(() => {
        synth = new Tone.Synth().toDestination();

        recorder = new MediaRecorder(dest.stream);

        sampler = createSampler();
        backgroundSynth = createSampler();
        backgroundSynth.volume.value -= 20;
    });

    const onRelease = () => {
        synth.triggerRelease();
    };

    let flagStart = false;
    let startingTimeNow = -1;

    const dest = Tone.getContext().createMediaStreamDestination();

    let recorder: MediaRecorder;
    const audio: Blob[] = [];

    let sampler: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
    let backgroundSynth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;

    let recordedPrev = false;

    const stopPlayback = () => {
        isPlaying = false;
    };

    const playbackRecord = async () => {
        isPlaying = true;

        let now = Tone.now();

        sampler.connect(dest);
        backgroundSynth.connect(dest);
        recorder.ondataavailable = (event) => {
            audio.push(event.data);
        };
        recorder.onstop = () => {
            const audioBlob = new Blob(audio, {
                type: "audio/ogg; codecs=opus",
            });
            const downloadUrl = URL.createObjectURL(audioBlob);
            const downloadAnchor = document.createElement("a");
            downloadAnchor.style.display = "none";
            downloadAnchor.href = downloadUrl;
            downloadAnchor.download = "myImpromptuPiece.ogg";
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            document.body.removeChild(downloadAnchor);
            URL.revokeObjectURL(downloadUrl);
        };
        if (recordedPrev == false) {
            recorder.start();
            recordedPrev = true;
        }

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

            const noteName = melodyToNotes[i].note;

            if (
                (Math.floor(now * 8.0 + 0.001) -
                    Math.floor(startingTimeNow * 8.0 + 0.001)) %
                    1 ==
                    0 &&
                noteName !== ""
            ) {
                backingTrack = MAJOR_TRIADS_MAP[noteName];

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

            if (isBacking == true && combineTracks) {
                backgroundSynth.triggerAttackRelease(combineTracks, 1, now);
            }

            now += melodyToNotes[i].length;
            await delay(delayTime);
        }

        flagStart = false;
        hoverNote = "";
        isPlaying = false;
    };

    let showKeys = false;
</script>

<svelte:window on:mouseup={onRelease} />

{#if !isFirstKeyChosen}
    <ChooseKeyToStart
        on:initialNoteChosen={(e) => {
            synth.triggerAttack(e.detail.name());

            setTimeout(() => {
                synth.triggerRelease();
            }, 200);

            setKey(e.detail);
        }}
    />
{:else}
    <div class="bg-[#1e1e1e] min-h-screen">
        <!-- HEADER -->
        <div>
            <div class="ml-auto flex gap-8">
                <div class="flex items-center text-white gap-2">
                    <span
                        class="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent inline-block"
                        >Show Keys</span
                    >
                    <label class="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            class="sr-only peer"
                            bind:checked={showKeys}
                        />
                        <div
                            class="relative w-12 h-6 bg-gray-300 rounded-full
                                peer peer-checked:after:translate-x-full
                                rtl:peer-checked:after:-translate-x-full
                                peer-checked:after:border-white after:content-['']
                                after:absolute after:top-[2px] after:start-[2px]
                                after:bg-white after:border-gray-300 after:border
                                after:rounded-full after:h-5
                                after:w-5 after:transition-all
                                peer-checked:bg-gray-500"
                        ></div>
                    </label>
                </div>
                <div>
                    <button
                        class="bg-transparent text-[#f8f8ff] border-2 border-[#f8f8ff] rounded px-4 py-2 cursor-pointer text-lg transition-colors hover:bg-[#f8f8ff] hover:text-black
                        {!isPlaying && finished
                            ? 'border-green-400 text-green-300 hover:bg-green-100 hover:text-black'
                            : finished
                              ? 'border-red-400 text-red-300 hover:bg-red-100 hover:text-black'
                              : ''}"
                        on:click={() => {
                            if (!finished) {
                                finished = true;
                            } else {
                                playbackRecord();
                                setTimeout(
                                    () => {
                                        recorder.stop();
                                        sampler.disconnect(dest);
                                        backgroundSynth.disconnect(dest);
                                    },
                                    1000 * (chordProgression.length + 2) + 200,
                                );
                            }
                        }}
                    >
                        {!finished ? "Finish" : "Play"}
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-7 gap-4">
            <div class="col-span-4 flex justify-center items-center flex-col">
                <div class="flex">
                    <div>
                        <button
                            on:click={previousMeasure}
                            class="text-gray-400 p-4 {!finished &&
                                'hover:text-gray-300'}"
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
                                />
                            {:else}
                                <PianoRoll
                                    notes={melodyToNotes}
                                    selectedIndex={rollRow}
                                    canEdit={false}
                                    deleteNote={deleteMeasureNote}
                                />
                            {/if}

                            <!-- KEYS -->
                            <Piano
                                {hoverNote}
                                playNote={(key) => {
                                    playPianoNote(key.name());

                                    if (finished || key.note === "") return;

                                    setMeasureNote(key.note, key.octave);
                                }}
                                selectableNotes={!finished
                                    ? noteChoices[measureIndex].notes
                                    : getAllNotes()}
                                {showKeys}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            disabled={finished}
                            on:click={() => {
                                if (measureIndex < noteChoices.length - 1) {
                                    nextMeasure();
                                }
                            }}
                            class="text-gray-400 p-4 {!finished &&
                                'hover:text-gray-300'}"
                        >
                            <IconForward />
                        </button>
                    </div>
                </div>
                <!-- RHYTHM BUTTONS -->
                <div
                    class="mt-8 flex flex-row items-center justify-center gap-2"
                >
                    {#each rhythms as { name, rhythm }}
                        <button
                            on:click={() => {
                                selectedRhythm = rhythm;
                                onChangeRhythm();
                            }}
                            class="flex justify-center items-center p-4 rounded-lg hover:border-2 {finished &&
                                'invisible'}"
                        >
                            {#if name === "Whole Note"}
                                <IconWholeNote class="text-gray-400 text-xl" />
                            {:else if name === "Half Notes"}
                                <IconHalfNote class="text-gray-400 text-xl" />
                            {:else if name === "Quarter Notes"}
                                <IconQuarterNote
                                    class="text-gray-400 text-xl"
                                />
                            {:else if name === "Eighth Notes"}
                                <IconEighthNote class="text-gray-400 text-xl" />
                            {/if}
                            <span
                                class="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-clip-text text-transparent inline-block"
                            >
                                {name}
                            </span>
                        </button>
                    {/each}
                </div>
            </div>
            <div class="col-span-3 p-4 max-h-full box-border">
                <Graph bind:this={graphRef} notes={melodyToNotes} />
            </div>
        </div>
    </div>
{/if}
