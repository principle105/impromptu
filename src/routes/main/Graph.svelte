<script>
    import { onMount, onDestroy } from "svelte";
    import { Chart, registerables } from "chart.js";
    import { frequencyData } from "./store.js";

    Chart.register(...registerables);

    let chart;

    const unsubscribe = frequencyData.subscribe((newData) => {
        if (chart) {
            chart.data.labels = newData.map((_, index) => index + 1);
            chart.data.datasets[0].data = newData;
            chart.update();
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

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

<canvas id="myChart" width="400" height="400"></canvas>
