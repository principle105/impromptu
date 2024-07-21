<script lang="ts">
    // Icons
    import IconBack from "~icons/material-symbols/arrow-back-ios";
    import IconForward from "~icons/material-symbols/arrow-forward-ios";
    import IconWholeNote from "~icons/mdi/music-note-whole";
    import IconHalfNote from "~icons/mdi/music-note-half";
    import IconQuarterNote from "~icons/mdi/music-note-quarter";
    import IconEighthNote from "~icons/mdi/music-note-eighth";

    import * as Tone from "tone";
    import Piano from "$lib/components/Piano.svelte";
    import PianoRoll from "$lib/components/PianoRoll.svelte";
    import createSampler from "./sampler.js";
    import Graph from "./Graph.svelte";
    import {
        generateIntervals,
        exampleProgression,
        majorTriads,
        Note,
        Measure,
        generateEmptyMeasure,
        allNotes,
        realProgression,
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
            name: "Eighth Notes",
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
    }

    function previousMeasure() {
        if (measureIndex - 1 < 0 || finished) return;

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
    const dest = Tone.context.createMediaStreamDestination();
    let recorder;
    const audio = [];

    onMount(() => {
        recorder = new MediaRecorder(dest.stream);
    });

    let sampler: Tone.Synth<Tone.SynthOptions>;
    let backgroundSynth: Tone.Synth<Tone.SynthOptions>;

    onMount(() => {
        sampler = createSampler();
        backgroundSynth = createSampler();
        backgroundSynth.volume.value -= 20;
    });

    let recordedPrev = false;

    function stopPlayback() {
        isPlaying = false;
    }

    async function playbackRecord() {
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
            // console.log(now + " now");
            // console.log(startingTimeNow + " original now");

            if (
                (Math.floor(now * 8.0 + 0.001) -
                    Math.floor(startingTimeNow * 8.0 + 0.001)) %
                    1 ==
                0
            ) {
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
            // console.log(((Math.floor(now*8.0+0.001)) - (Math.floor(startingTimeNow*8.0+0.001))));
            // console.log(((Math.floor(now*8.0+0.001)) - (Math.floor(startingTimeNow*8.0+0.001))) % 1 == 0);
            if (isBacking == true) {
                // console.log("works backing");
                backgroundSynth.triggerAttackRelease(combineTracks, 1, now);
            }

            now += melodyToNotes[i].length;
            await delay(delayTime);
        }
        flagStart = false;
        hoverNote = "";
        isPlaying = false;
    }

    let showKeys = false;
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
        <div class="flex justify-between p-8 pb-12 items-center">
            <h1
                class="font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent inline-block text-5xl pl-12"
            >
                Impromptu
            </h1>
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
                    disabled={isPlaying}
                        class="
              bg-transparent
              text-[#f8f8ff]
              border-2
              border-[#f8f8ff]
              rounded
              px-4
              py-2
              cursor-pointer
              text-lg
              transition-colors
              hover:bg-[#f8f8ff]
              hover:text-black disabled:text-gray-500 disabled:border-gray-500 disabled:bg-gray-300 disabled:pointer-events-none
              {!isPlaying && finished
                ? 'border-green-400 text-green-300 hover:bg-green-100 hover:text-black'
                : ''}
            "
                        on:click={() => {
                            if (!finished) {
                                finish();
                            } else {
                                playbackRecord();
                                setTimeout(
                                    () => {
                                        recorder.stop();
                                        sampler.disconnect(dest);
                                        backgroundSynth.disconnect(dest);
                                    },
                                    1000 * (realProgression.length + 2) + 200,
                                );
                            }
                        }}
                        >{!finished ? "Finish" : isPlaying ? "Play" : "Play"}
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-7 gap-4">
            <div class="col-span-4 flex justify-center items-center flex-col">
                <div class="flex">
                    <div>
                        <button
                            disabled={finished}
                            on:click={previousMeasure}
                            class="text-gray-400 p-4 {!finished && "hover:text-gray-300"}"
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
                                    if (!finished) {
                                        setMeasureNote(key.note, key.octave);
                                        console.log("Setting note");
                                    }
                                }}
                                selectableNotes={!finished
                                    ? noteChoices[measureIndex].notes
                                    : allNotes()}
                                {showKeys}
                            ></Piano>
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
                            class="text-gray-400 p-4 {!finished && "hover:text-gray-300"}"
                        >
                            <IconForward />
                        </button>
                    </div>
                </div>
                <!-- RHYTHM BUTTONS -->
                <div
                    class="mt-8 flex flex-row items-center justify-center gap gap-2"
                >
                    {#each rhythmCatalog as { name, rhythm }}
                        <button
                            disabled={finished}
                            on:click={() => {
                                selectedRhythm = rhythm;
                                onChangeRhythm();
                            }}
                            class="flex justify-center items-center p-4 rounded-lg hover:border-2 {finished && "invisible"}"
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
