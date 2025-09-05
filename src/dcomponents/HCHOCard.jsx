import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const HCHOCard = () => {
  const data = {
    datasets: [
      {
        label: "HCHO Levels",
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i + 11.20,
          y: (Math.random() * 6).toFixed(2), // Random y values
        })),
        backgroundColor: "#1E88E5",
        borderColor: "#90CAF9",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.y} mg/m³`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          callback: (value) => `${value.toFixed(2)} am`,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "HCHO Levels (mg/m³)",
        },
        min: -1,
        max: 6,
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">HCHO Average</h3>
        <button className="text-blue-500 text-sm">View report</button>
      </div>

      {/* Data Section */}
      <div className="flex items-baseline mb-6">
        <p className="text-3xl font-bold">2.64</p>
        <p className="text-red-500 text-sm ml-2">↓ 2.6%</p>
        <span className="ml-auto text-gray-500 text-sm">Floor 1</span>
      </div>

      {/* Scatter Chart */}
      <Scatter data={data} options={options} />

      {/* Footer Section */}
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        <p>Hourly</p>
      </div>
    </div>
  );
};

export default HCHOCard;
