<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Chart, registerables } from "chart.js";

    import type { Note } from "./createPossibleNotes.js";

    Chart.register(...registerables);

    export let notes: Note[] = [];

    let chart: Chart | null;

    interface noteFrequency {
        [key: string]: number;
    }

    const noteFrequencyCatalog: noteFrequency = {
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

    function notesToFrequencies(notes: Note[]): number[] {
        const frqs: number[] = [];

        for (let i = 0; i < notes.length; i++) {
            let frq = 0;
            if (notes[i].note !== "") {
                frq = noteFrequencyCatalog[notes[i].name()];
            }

            frqs.push(frq);
        }

        return frqs;
    }

    let frequencies: number[] = [];

    $: frequencies = notesToFrequencies(notes);

    $: if (frequencies.length) {
        if (chart) {
            chart.data.labels = frequencies.map((_, index) => index + 1);
            chart.data.datasets[0].data = frequencies;
            chart.update();
        }
    }

    onMount(() => {
        const ctx = document.getElementById("myChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Note Frequency (Hertz)",
                        data: [],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    });
</script>

<canvas id="myChart" width="400" height="325"></canvas>
