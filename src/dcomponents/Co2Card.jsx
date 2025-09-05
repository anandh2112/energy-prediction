import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to calculate bar color based on CO2 level
const getBarColor = (ppm) => {
  if (ppm < 350) return "#ffeb3b"; // Yellow for safe levels
  if (ppm < 400) return "#ffc107"; // Light orange for moderate levels
  if (ppm < 450) return "#ff9800"; // Orange for higher levels
  if (ppm < 500) return "#ff5722"; // Red-orange for unsafe levels
  return "#f44336"; // Red for very high levels
};

const CO2Card = () => {
  const dataValues = [
    425, 400, 375, 450, 425, 400, 410, 390, 380, 395,
    420, 440, 460, 470, 430, 400, 390, 380, 370, 360,
    350, 340, 330, 320,
  ];

  const data = {
    labels: [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
      "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ],
    datasets: [
      {
        label: "CO2 Levels",
        data: dataValues,
        backgroundColor: dataValues.map(getBarColor), // Assign color based on ppm
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} ppm`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Removes x-axis grid lines
        },
        title: {
          display: true,
          text: "Time (24 Hours)",
        },
      },
      y: {
        grid: {
          display: false, // Removes y-axis grid lines
        },
        title: {
          display: true,
          text: "CO2 Levels (ppm)",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">CO2 Level</h3>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
};

export default CO2Card;
