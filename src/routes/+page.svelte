<script lang="ts">
    import * as Tone from "tone";
    import Piano from "../lib/components/Piano.svelte";
    import PianoRoll from "../lib/components/PianoRoll.svelte";
    import {
        selectedLine,
        selectedNote,
        selectedPrefab,
    } from "../lib/stores.js";
    import createSampler from "./sampler.js";
    import { showKeys } from "$lib/stores.js";
    import {
        selectQuarterNotesRandom,
        createPossibleNotes,
        noteChoices,
        noteLength,
        playbackArr,
        type recording,
        cntIndex,
        fullNoteLength,
        exampleProgression,
        generateIntervals,
    } from "./createPossibleNotes";
    import ChoiceButton from "$lib/components/ChoiceButton.svelte";

    let hoverNote: string;
    let rollIndex = 0;
    let pianoDisabled: boolean = false;

    let choiceIndex = 0;

    export function playbackRecord() {
        let sampler: Tone.Synth<Tone.SynthOptions>;
        sampler = createSampler();
        const now = Tone.now();
        for (let i = 0; i < playbackArr.length; i++) {
            if (playbackArr[i].name == "") {
                break;
            }
            if (playbackArr[i].name == "Rest") {
                //doesnt have to do anything because of how i set this up lmao
            } else if (i == 0) {
                // make sure player cannot choose rest as first note lol
                sampler.triggerAttackRelease(
                    playbackArr[i].name,
                    playbackArr[i].duration,
                    now,
                );
                hoverNote = playbackArr[i].name;
            } else {
                hoverNote = playbackArr[i].name;
                console.log(i);
                sampler.triggerAttackRelease(
                    playbackArr[i].name,
                    playbackArr[i].duration - playbackArr[i - 1].duration,
                    now + playbackArr[i].duration,
                );
            }
        }
    }

    let playbackNotes: string[][] = [[""]];

    export function saveNote(key: string, length: number) {
        console.log("save");
        let save: recording = {
            name: key,
            duration: length,
        };
        playbackNotes[0].push(save.name);
        // qol to make playbacks easier
        if (cntIndex[0] != 0) {
            save.duration += playbackArr[cntIndex[0] - 1].duration;
        }
        playbackArr[cntIndex[0]] = save;
        cntIndex[0]++;

        // let temp = $noteChoices;
        // // change to be based on chord progression
        // temp[0] = selectQuarterNotesRandom(createPossibleNotes("C3"));
        // $noteChoices = temp;

        console.log(playbackArr);
        noteLength;
        choiceIndex++;
    }

    export function playNote(key: string, length: number) {
        console.log("play");
        console.log(key);
        const synthNotes = new Tone.PolySynth(Tone.Synth).toDestination();
        synthNotes.triggerAttackRelease(key, length);
    }

    let canPlay = false;

    $: {
        if ($noteChoices) {
            canPlay = $noteChoices[0].some(
                (note) => note !== undefined && note !== "",
            );
        } else {
            canPlay = false;
        }
    }

    function delay(ms: number, cancelFlag: { isCancelled: boolean }) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (cancelFlag.isCancelled) {
                    reject("Playback cancelled");
                } else {
                    resolve();
                }
            }, ms);
            cancelFlag.cleanup = () => clearTimeout(timeout);
        });
    }

    let isPlaying = false;
    let cancelFlag = { isCancelled: false, cleanup: () => {} };

    let playback = async () => {
        if (isPlaying) {
            cancelFlag.isCancelled = true;
            cancelFlag.cleanup();
            isPlaying = false;
            return;
        }

        isPlaying = true;
        cancelFlag.isCancelled = false;

        try {
            for (let i = $selectedLine; i < $selectedPrefab.notes.length; i++) {
                let element = $selectedPrefab.notes[i];
                selectedLine.update(() => i);
                if (element.note) {
                    let src = `/piano-samples/${element.note}.wav`; // Ensure the correct file extension
                    const newAudio = new Audio(src);
                    newAudio.play();
                    await delay(element.length * 1000, cancelFlag);
                } else {
                    await delay(element.length * 1000, cancelFlag);
                }
                if (cancelFlag.isCancelled) {
                    throw new Error("Playback cancelled");
                }
            }
        } catch (e) {
            console.log(e.message);
        } finally {
            isPlaying = false;
        }
    };
</script>

<div class="page">
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

    {#if choiceIndex < $noteChoices.length}
        <PianoRoll
            notes={$noteChoices}
            index={choiceIndex}
            lengths={$noteLength}
            {hoverNote}
        ></PianoRoll>
    {:else}
        <PianoRoll
            notes={playbackNotes}
            index={0}
            lengths={$noteLength}
            {hoverNote}
        ></PianoRoll>
    {/if}
    <Piano {hoverNote} disabled={pianoDisabled}></Piano>

    {#if choiceIndex < $noteChoices.length}
        <div class="mt-8 flex flex-row items-center justify-center">
            <ChoiceButton
                mouseenter={() => {
                    hoverNote = "";
                }}
                mouseexit={() => {
                    hoverNote = "";
                }}
                note={"Rest"}
                length={fullNoteLength / 4}
                click={() => {
                    saveNote("Rest", fullNoteLength / 4);
                    hoverNote = "";
                }}
            >
                Add a rest
            </ChoiceButton>
            {#each $noteChoices[choiceIndex] as note, i}
                {#if note && $noteLength[i]}
                    <ChoiceButton
                        click={() => {
                            saveNote(note, $noteLength[i]);
                            hoverNote = ""; 
                        }}
                        mouseenter={() => {
                            hoverNote = note;
                            playNote(note, $noteLength[i]);
                        }}
                        mouseexit={() => {
                            hoverNote = "";
                        }}
                        {note}
                        length={$noteLength[i]}
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
