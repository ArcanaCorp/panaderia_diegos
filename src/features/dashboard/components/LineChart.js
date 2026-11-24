"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function LineChart({ data = [], height = 300, color = "#958359", currency = "S/", showLegend = false }) {
    const chartData = {
        labels: data.map((item) => item.label),

        datasets: [
            {
                label: "Ventas",
                data: data.map((item) => item.total),

                borderColor: color,
                backgroundColor: "rgba(149, 131, 89, 0.12)",

                borderWidth: 2.5,
                fill: true,
                tension: 0.4,

                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: color,
                pointBorderWidth: 2,

                pointHoverBackgroundColor: color,
                pointHoverBorderColor: "#ffffff",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index",
        },

        plugins: {
            legend: {
                display: showLegend,
            },

            tooltip: {
                backgroundColor: "#29211a",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                padding: 12,
                cornerRadius: 8,

                displayColors: false,

                callbacks: {
                    label: (context) => {
                        return `${currency} ${Number(
                            context.parsed.y
                        ).toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`;
                    },
                },
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },

                border: {
                    display: false,
                },

                ticks: {
                    color: "#767676",
                    font: {
                        family: "inherit",
                        size: 11,
                    },
                },
            },

            y: {
                beginAtZero: true,

                border: {
                    display: false,
                    dash: [4, 4],
                },

                grid: {
                    color: "rgba(149, 131, 89, 0.12)",
                },

                ticks: {
                    color: "#767676",

                    font: {
                        family: "inherit",
                        size: 11,
                    },

                    callback: (value) => {
                        return `${currency} ${Number(
                            value
                        ).toLocaleString("es-PE")}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height }}>
            <Line data={chartData} options={options} />
        </div>
    );
}