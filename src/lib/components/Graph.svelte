<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    import { NOTE_FREQUENCY_MAP } from "$lib/constants";
    import type { Note } from "$lib/notes";

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
                        tension: 0.3,
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

    const updateChart = (notes: Note[]) => {
        if (!chart) return;

        const frequencies: number[] = [];

        for (let i = 0; i < notes.length; i++) {
            let frq = 0;

            if (notes[i].note !== "") {
                frq = NOTE_FREQUENCY_MAP[notes[i].name()];
            }

            frequencies.push(frq);
        }

        chart.data.labels = frequencies.map((_, index) => index + 1);
        chart.data.datasets[0].data = frequencies;

        chart.update();
    };

    $: updateChart(notes);
</script>

<canvas bind:this={chartElement} width="400" height="325"></canvas>

<style>
    canvas {
        filter: invert(1) brightness(2);
    }
</style>
