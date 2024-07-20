<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    Chart.register(...registerables);

    let chart;
    export let playbackArr = [];

    onMount(() => {
        const ctx = document.getElementById("myChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: playbackArr.map((_, index) => index + 1),
                datasets: [
                    {
                        label: "Note Frequency (Hertz)",
                        data: playbackArr.map((item) => item.length),
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

    export function updateChart(newData) {
        if (chart) {
            chart.data.labels = newData.map((_, index) => index + 1);
            chart.data.datasets[0].data = newData;
            chart.update();
        }
    }
</script>

<canvas id="myChart" width="400" height="400"></canvas>
