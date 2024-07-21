<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    import { NOTE_FREQUENCY_MAP } from "$lib/utils/constants";
    import type { Note } from "$lib/utils/notes";

    Chart.register(...registerables);

    export let notes: Note[] = [];

    let chart: Chart | null;
    let chartElement: HTMLCanvasElement | null;

    onMount(() => {
        if (chartElement === null) return;

        const ctx = chartElement.getContext("2d");

        if (ctx === null) return;

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

    const notesToFrequencies = (notes: Note[]): number[] => {
        const frqs: number[] = [];

        for (let i = 0; i < notes.length; i++) {
            let frq = 0;

            if (notes[i].note !== "") {
                frq = NOTE_FREQUENCY_MAP[notes[i].name()];
            }

            frqs.push(frq);
        }

        return frqs;
    };

    $: frequencies = notesToFrequencies(notes);

    $: if (frequencies.length && chart) {
        chart.data.labels = frequencies.map((_, index) => index + 1);
        chart.data.datasets[0].data = frequencies;
        chart.update();
    }
</script>

<canvas bind:this={chartElement} width="400" height="325"></canvas>
