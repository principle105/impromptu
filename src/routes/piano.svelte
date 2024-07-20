<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import {
        selectedNote,
        selectedLine,
        showKeys,
        selectedPrefab,
    } from "./stores";

    const currAudio = writable<HTMLAudioElement | null>(null);

    interface Note {
        value: HTMLAudioElement;
        name: string;
    }

    let C3: Note = { value: null, name: "C3" };
    let CS3: Note = { value: null, name: "CS3" };
    let D3: Note = { value: null, name: "D3" };
    let DS3: Note = { value: null, name: "DS3" };
    let E3: Note = { value: null, name: "E3" };
    let F3: Note = { value: null, name: "F3" };
    let FS3: Note = { value: null, name: "FS3" };
    let G3: Note = { value: null, name: "G3" };
    let GS3: Note = { value: null, name: "GS3" };
    let A3: Note = { value: null, name: "A3" };
    let AS3: Note = { value: null, name: "AS3" };
    let B3: Note = { value: null, name: "B3" };
    let C4: Note = { value: null, name: "C4" };
    let CS4: Note = { value: null, name: "CS4" };
    let D4: Note = { value: null, name: "D4" };
    let DS4: Note = { value: null, name: "DS4" };
    let E4: Note = { value: null, name: "E4" };
    let F4: Note = { value: null, name: "F4" };
    let FS4: Note = { value: null, name: "FS4" };
    let G4: Note = { value: null, name: "G4" };
    let GS4: Note = { value: null, name: "GS4" };
    let A4: Note = { value: null, name: "A4" };
    let AS4: Note = { value: null, name: "AS4" };
    let B4: Note = { value: null, name: "B4" };

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
    });

    function showNote(key: string) {
        notesVisible.update((nv) => ({ ...nv, [key]: true }));
    }

    function hideNote(key: string) {
        notesVisible.update((nv) => ({ ...nv, [key]: false }));
    }

    function playNote(key: Note) {
        selectedNote.update(() => {
            return { note: key.name };
        });
        if (
            $selectedPrefab &&
            $selectedLine + 1 < $selectedPrefab.notes.length
        ) {
            selectedLine.update((n) => n + 1);
        }

        currAudio.update((current) => {
            if (current) {
                current.pause();
                current.currentTime = 0;
            }

            const newAudio = new Audio(key.value.src);
            newAudio.play();
            return newAudio;
        });
    }
</script>

<audio src="/piano-samples/C3.wav" bind:this={C3.value} />
<audio src="/piano-samples/CS3.wav" bind:this={CS3.value} />
<audio src="/piano-samples/D3.wav" bind:this={D3.value} />
<audio src="/piano-samples/DS3.wav" bind:this={DS3.value} />
<audio src="/piano-samples/E3.wav" bind:this={E3.value} />
<audio src="/piano-samples/F3.wav" bind:this={F3.value} />
<audio src="/piano-samples/FS3.wav" bind:this={FS3.value} />
<audio src="/piano-samples/G3.wav" bind:this={G3.value} />
<audio src="/piano-samples/GS3.wav" bind:this={GS3.value} />
<audio src="/piano-samples/A3.wav" bind:this={A3.value} />
<audio src="/piano-samples/AS3.wav" bind:this={AS3.value} />
<audio src="/piano-samples/B3.wav" bind:this={B3.value} />
<audio src="/piano-samples/C4.wav" bind:this={C4.value} />
<audio src="/piano-samples/CS4.wav" bind:this={CS4.value} />
<audio src="/piano-samples/D4.wav" bind:this={D4.value} />
<audio src="/piano-samples/DS4.wav" bind:this={DS4.value} />
<audio src="/piano-samples/E4.wav" bind:this={E4.value} />
<audio src="/piano-samples/F4.wav" bind:this={F4.value} />
<audio src="/piano-samples/FS4.wav" bind:this={FS4.value} />
<audio src="/piano-samples/G4.wav" bind:this={G4.value} />
<audio src="/piano-samples/GS4.wav" bind:this={GS4.value} />
<audio src="/piano-samples/A4.wav" bind:this={A4.value} />
<audio src="/piano-samples/AS4.wav" bind:this={AS4.value} />
<audio src="/piano-samples/B4.wav" bind:this={B4.value} />

<div class="container">
    <button
        aria-roledescription="C note"
        id="key-1"
        class="key white"
        on:mouseover={() => showNote("key-1")}
        on:focus
        on:mouseleave={() => hideNote("key-1")}
        on:click={() => playNote(C3)}
    >
        {#if $notesVisible["key-1"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C3</div>
        {/if}
    </button>
    <button
        id="key-2"
        class="key black"
        on:mouseover={() => showNote("key-2")}
        on:focus
        on:mouseleave={() => hideNote("key-2")}
        on:click={() => playNote(CS3)}
    >
        {#if $notesVisible["key-2"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C#</div>
        {/if}
    </button>
    <button
        id="key-3"
        class="key white"
        on:mouseover={() => showNote("key-3")}
        on:focus
        on:mouseleave={() => hideNote("key-3")}
        on:click={() => playNote(D3)}
    >
        {#if $notesVisible["key-3"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D</div>
        {/if}
    </button>
    <button
        id="key-4"
        class="key black"
        on:mouseover={() => showNote("key-4")}
        on:focus
        on:mouseleave={() => hideNote("key-4")}
        on:click={() => playNote(DS3)}
    >
        {#if $notesVisible["key-4"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D#</div>
        {/if}
    </button>
    <button
        id="key-5"
        class="key white"
        on:mouseover={() => showNote("key-5")}
        on:focus
        on:mouseleave={() => hideNote("key-5")}
        on:click={() => playNote(E3)}
    >
        {#if $notesVisible["key-5"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">E</div>
        {/if}
    </button>
    <button
        id="key-6"
        class="key white"
        on:mouseover={() => showNote("key-6")}
        on:focus
        on:mouseleave={() => hideNote("key-6")}
        on:click={() => playNote(F3)}
    >
        {#if $notesVisible["key-6"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F</div>
        {/if}
    </button>
    <button
        id="key-7"
        class="key black"
        on:mouseover={() => showNote("key-7")}
        on:focus
        on:mouseleave={() => hideNote("key-7")}
        on:click={() => playNote(FS3)}
    >
        {#if $notesVisible["key-7"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F#</div>
        {/if}
    </button>
    <button
        id="key-8"
        class="key white"
        on:mouseover={() => showNote("key-8")}
        on:focus
        on:mouseleave={() => hideNote("key-8")}
        on:click={() => playNote(G3)}
    >
        {#if $notesVisible["key-8"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G</div>
        {/if}
    </button>
    <button
        id="key-9"
        class="key black"
        on:mouseover={() => showNote("key-9")}
        on:focus
        on:mouseleave={() => hideNote("key-9")}
        on:click={() => playNote(GS3)}
    >
        {#if $notesVisible["key-9"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G#</div>
        {/if}
    </button>
    <button
        id="key-10"
        class="key white"
        on:mouseover={() => showNote("key-10")}
        on:focus
        on:mouseleave={() => hideNote("key-10")}
        on:click={() => playNote(A3)}
    >
        {#if $notesVisible["key-10"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A</div>
        {/if}
    </button>
    <button
        id="key-11"
        class="key black"
        on:mouseover={() => showNote("key-11")}
        on:focus
        on:mouseleave={() => hideNote("key-11")}
        on:click={() => playNote(AS3)}
    >
        {#if $notesVisible["key-11"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A#</div>
        {/if}
    </button>
    <button
        id="key-12"
        class="key white"
        on:mouseover={() => showNote("key-12")}
        on:focus
        on:mouseleave={() => hideNote("key-12")}
        on:click={() => playNote(B3)}
    >
        {#if $notesVisible["key-12"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">B</div>
        {/if}
    </button>
    <button
        id="key-13"
        class="key white"
        on:mouseover={() => showNote("key-13")}
        on:focus
        on:mouseleave={() => hideNote("key-13")}
        on:click={() => playNote(C4)}
    >
        {#if $notesVisible["key-13"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C4</div>
        {/if}
    </button>
    <button
        id="key-14"
        class="key black"
        on:mouseover={() => showNote("key-14")}
        on:focus
        on:mouseleave={() => hideNote("key-14")}
        on:click={() => playNote(CS4)}
    >
        {#if $notesVisible["key-14"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">C#</div>
        {/if}
    </button>
    <button
        id="key-15"
        class="key white"
        on:mouseover={() => showNote("key-15")}
        on:focus
        on:mouseleave={() => hideNote("key-15")}
        on:click={() => playNote(D4)}
    >
        {#if $notesVisible["key-15"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D</div>
        {/if}
    </button>
    <button
        id="key-16"
        class="key black"
        on:mouseover={() => showNote("key-16")}
        on:focus
        on:mouseleave={() => hideNote("key-16")}
        on:click={() => playNote(DS4)}
    >
        {#if $notesVisible["key-16"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">D#</div>
        {/if}
    </button>
    <button
        id="key-17"
        class="key white"
        on:mouseover={() => showNote("key-17")}
        on:focus
        on:mouseleave={() => hideNote("key-17")}
        on:click={() => playNote(E4)}
    >
        {#if $notesVisible["key-17"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">E</div>
        {/if}
    </button>
    <button
        id="key-18"
        class="key white"
        on:mouseover={() => showNote("key-18")}
        on:focus
        on:mouseleave={() => hideNote("key-18")}
        on:click={() => playNote(F4)}
    >
        {#if $notesVisible["key-18"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F</div>
        {/if}
    </button>
    <button
        id="key-19"
        class="key black"
        on:mouseover={() => showNote("key-19")}
        on:focus
        on:mouseleave={() => hideNote("key-19")}
        on:click={() => playNote(FS4)}
    >
        {#if $notesVisible["key-19"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">F#</div>
        {/if}
    </button>
    <button
        id="key-20"
        class="key white"
        on:mouseover={() => showNote("key-20")}
        on:focus
        on:mouseleave={() => hideNote("key-20")}
        on:click={() => playNote(G4)}
    >
        {#if $notesVisible["key-20"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G</div>
        {/if}
    </button>
    <button
        id="key-21"
        class="key black"
        on:mouseover={() => showNote("key-21")}
        on:focus
        on:mouseleave={() => hideNote("key-21")}
        on:click={() => playNote(GS4)}
    >
        {#if $notesVisible["key-21"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">G#</div>
        {/if}
    </button>
    <button
        id="key-22"
        class="key white"
        on:mouseover={() => showNote("key-22")}
        on:focus
        on:mouseleave={() => hideNote("key-22")}
        on:click={() => playNote(A4)}
    >
        {#if $notesVisible["key-22"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A</div>
        {/if}
    </button>
    <button
        id="key-23"
        class="key black"
        on:mouseover={() => showNote("key-23")}
        on:focus
        on:mouseleave={() => hideNote("key-23")}
        on:click={() => playNote(AS4)}
    >
        {#if $notesVisible["key-23"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">A#</div>
        {/if}
    </button>
    <button
        id="key-24"
        class="key white"
        on:mouseover={() => showNote("key-24")}
        on:focus
        on:mouseleave={() => hideNote("key-24")}
        on:click={() => playNote(B4)}
    >
        {#if $notesVisible["key-24"] || $showKeys}
            <div transition:fly={{ y: 10, duration: 300 }} class="note">B</div>
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
        font-size: 20px;
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
