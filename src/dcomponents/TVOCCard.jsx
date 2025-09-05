import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TVOCCard = () => {
  const data = {
    labels: [
      "11:20am",
      "11:25am",
      "11:30am",
      "11:35am",
      "11:40am",
      "11:45am",
      "11:50am",
      "11:55am",
    ],
    datasets: [
      {
        label: "TVOC Levels",
        data: [0.5, 4, 3, 2, 3.5, 2.8, 4.2, 5],
        borderColor: "#4CAF50",
        backgroundColor: "#A5D6A7",
        fill: false,
        pointBackgroundColor: "#4CAF50",
        pointHoverRadius: 6,
        tension: 0.3,
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
          label: (context) => `${context.raw} Hg`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "TVOC Levels (Hg)",
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
        <h3 className="text-lg font-bold">TVOC Average</h3>
        <button className="text-blue-500 text-sm">View report</button>
      </div>

      {/* Data Section */}
      <div className="flex items-baseline mb-6">
        <p className="text-3xl font-bold">2.64</p>
        <p className="text-red-500 text-sm ml-2">↓ 2.6%</p>
        <span className="ml-auto text-gray-500 text-sm">Floor 1</span>
      </div>

      {/* Line Chart */}
      <Line data={data} options={options} />

      {/* Footer Section */}
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        <p>Hourly</p>
      </div>
    </div>
  );
};

export default TVOCCard;
