<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let C, CS, D, DS, E, F, FS, G, GS, A, AS, B;

    let showKeys = false;

    $: currentKey = "";

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
    });

    function showNote(key: string) {
        $notesVisible[key] = true;
    }

    function hideNote(key: string) {
        $notesVisible[key] = false;
    }

    function playNote(key) {
        currentKey = key;
        key.play();
    }
</script>

<audio src="/piano-samples/A.wav" bind:this={A} />
<audio src="/piano-samples/AS.wav" bind:this={AS} />
<audio src="/piano-samples/B.wav" bind:this={B} />
<audio src="/piano-samples/C.wav" bind:this={C} />
<audio src="/piano-samples/CS.wav" bind:this={CS} />
<audio src="/piano-samples/D.wav" bind:this={D} />
<audio src="/piano-samples/DS.wav" bind:this={DS} />
<audio src="/piano-samples/E.wav" bind:this={E} />
<audio src="/piano-samples/F.wav" bind:this={F} />
<audio src="/piano-samples/FS.wav" bind:this={FS} />
<audio src="/piano-samples/G.wav" bind:this={G} />
<audio src="/piano-samples/GS.wav" bind:this={GS} />

<div class="piano">
    <div class="top">
        <div class="title">Keyboard</div>
        <div class="showKeys">
            <span>Show Keys</span>
            <input type="checkbox" bind:checked={showKeys} />
        </div>
    </div>
    <div class="container">
        <div
            aria-roledescription="C note"
            id="key-1"
            class="key white"
            on:mouseover={() => showNote("key-1")}
            on:mouseleave={() => hideNote("key-1")}
            on:click={() => playNote(C)}
        >
            {#if $notesVisible["key-1"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    C
                </div>
            {/if}
        </div>
        <div
            id="key-2"
            class="key black"
            on:mouseover={() => showNote("key-2")}
            on:mouseleave={() => hideNote("key-2")}
            on:click={() => playNote(CS)}
        >
            {#if $notesVisible["key-2"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    C#
                </div>
            {/if}
        </div>
        <div
            id="key-3"
            class="key white"
            on:mouseover={() => showNote("key-3")}
            on:mouseleave={() => hideNote("key-3")}
            on:click={() => playNote(D)}
        >
            {#if $notesVisible["key-3"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    D
                </div>
            {/if}
        </div>
        <div
            id="key-4"
            class="key black"
            on:mouseover={() => showNote("key-4")}
            on:mouseleave={() => hideNote("key-4")}
            on:click={() => playNote(DS)}
        >
            {#if $notesVisible["key-4"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    D#
                </div>
            {/if}
        </div>
        <div
            id="key-5"
            class="key white"
            on:mouseover={() => showNote("key-5")}
            on:mouseleave={() => hideNote("key-5")}
            on:click={() => playNote(E)}
        >
            {#if $notesVisible["key-5"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    E
                </div>
            {/if}
        </div>
        <div
            id="key-6"
            class="key white"
            on:mouseover={() => showNote("key-6")}
            on:mouseleave={() => hideNote("key-6")}
            on:click={() => playNote(F)}
        >
            {#if $notesVisible["key-6"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    F
                </div>
            {/if}
        </div>
        <div
            id="key-7"
            class="key black"
            on:mouseover={() => showNote("key-7")}
            on:mouseleave={() => hideNote("key-7")}
            on:click={() => playNote(FS)}
        >
            {#if $notesVisible["key-7"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    F#
                </div>
            {/if}
        </div>
        <div
            id="key-8"
            class="key white"
            on:mouseover={() => showNote("key-8")}
            on:mouseleave={() => hideNote("key-8")}
            on:click={() => playNote(G)}
        >
            {#if $notesVisible["key-8"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    G
                </div>
            {/if}
        </div>
        <div
            id="key-9"
            class="key black"
            on:mouseover={() => showNote("key-9")}
            on:mouseleave={() => hideNote("key-9")}
            on:click={() => playNote(GS)}
        >
            {#if $notesVisible["key-9"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    G#
                </div>
            {/if}
        </div>
        <div
            id="key-10"
            class="key white"
            on:mouseover={() => showNote("key-10")}
            on:mouseleave={() => hideNote("key-10")}
            on:click={() => playNote(A)}
        >
            {#if $notesVisible["key-10"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    A
                </div>
            {/if}
        </div>
        <div
            id="key-11"
            class="key black"
            on:mouseover={() => showNote("key-11")}
            on:mouseleave={() => hideNote("key-11")}
            on:click={() => playNote(AS)}
        >
            {#if $notesVisible["key-11"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    A#
                </div>
            {/if}
        </div>
        <div
            id="key-12"
            class="key white"
            on:mouseover={() => showNote("key-12")}
            on:mouseleave={() => hideNote("key-12")}
            on:click={() => playNote(B)}
        >
            {#if $notesVisible["key-12"] || showKeys}
                <div transition:fly={{ y: 10, duration: 300 }} class="note">
                    B
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .piano {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #1f1f1f;
        height: 350px;
        width: 500px;
        border-radius: 40px;
        padding: 50px;
    }

    .top {
        display: flex;

        width: 100%;
    }

    .container {
        position: relative;
        height: 200px;
        width: 400px;
    }

    .title {
        display: flex;
        justify-content: left;
        gap: 10px;
        height: 80px;
        width: 100%;
        color: rgb(205, 205, 205);
        font-size: 24px;
    }

    .showKeys {
        display: flex;
        justify-content: right;
        margin-top: 5px;
        gap: 10px;
        height: 80px;
        width: 100%;
        color: rgb(180, 180, 180);
    }

    input {
        height: 30px;
        width: 60px;
        border-radius: 30px;
        cursor: pointer;
        appearance: none;
        position: relative;
        background: #4b4b4b;
    }
    input::before {
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
    input:checked::before {
        left: 35px;
        background: #fff;
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
        width: 14.3%;
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
        width: 8%;
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
        left: 14.3%;
    }
    #key-5 {
        left: 28.6%;
    }
    #key-6 {
        left: 42.9%;
    }
    #key-8 {
        left: 57.2%;
    }
    #key-10 {
        left: 71.5%;
    }
    #key-12 {
        left: 85.8%;
    }

    /* Positioning black keys */
    #key-2 {
        left: 10%;
    }
    #key-4 {
        left: 25%;
    }
    #key-7 {
        left: 53%;
    }
    #key-9 {
        left: 67.3%;
    }
    #key-11 {
        left: 81.5%;
    }
</style>
