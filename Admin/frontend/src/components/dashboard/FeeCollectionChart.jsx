import { useEffect, useRef } from "react";
import * as Chart from "chart.js";

export default function FeeCollectionChart({ feesCollection, darkMode }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!feesCollection) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const monthNames = Object.keys(feesCollection);
    const data = Object.values(feesCollection);

    const backgroundColor = darkMode
      ? "rgba(59, 130, 246, 0.2)"
      : "rgba(247, 194, 54, 0.2)";

    const borderColor = darkMode ? "#3b82f6" : "#f7c236";

    const pointBackgroundColor = darkMode ? "#3b82f6" : "#f7c236";

    const textColor = darkMode ? "#f9fafb" : "#333";
    const gridColor = darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    Chart.Chart.register(...Chart.registerables);
    chartInstanceRef.current = new Chart.Chart(ctx, {
      type: "line",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Fee Collection",
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: pointBackgroundColor,
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: borderColor,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `₱${v.toLocaleString()}`,
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, [feesCollection, darkMode]);

  return (
    <div className={`chart-full ${darkMode ? "dark" : ""}`}>
      <div className="card-header">
        <h3 className={`card-title ${darkMode ? "dark" : ""}`}>
          Fees Collection
        </h3>
        <button className="card-menu">⋯</button>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
