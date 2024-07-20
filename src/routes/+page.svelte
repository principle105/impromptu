<script lang="ts">
    import Piano from "./Piano.svelte";
    import PianoRoll from "./PianoRoll.svelte";
    import { selectedNote } from "./stores.js";
    import {showKeys} from "./stores.js"

    $: console.log($selectedNote);
</script>

<div class="page">
    <div class="showKeys">
        <span>Show Keys</span>
        <input type="checkbox" bind:checked={$showKeys} />
    </div>
    <PianoRoll></PianoRoll>
    <Piano></Piano>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        height: 100vh;
        background-color: #1e1e1e;
        padding: 20px;
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
</style>
