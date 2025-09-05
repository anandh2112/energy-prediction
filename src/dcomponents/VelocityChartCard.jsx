import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const VelocityChartCard = () => {
  // Generate data for 24 hours with fluctuating velocity between 0.2 m/s and 1.5 m/s
  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const velocityData = [
    0.5, 0.8, 1.0, 1.2, 1.1, 0.9, 0.7, 0.6, 0.8, 1.3, 1.4, 1.0,
    0.6, 0.7, 1.2, 1.1, 0.9, 0.8, 1.0, 1.1, 1.4, 1.5, 0.7, 0.5,
  ];

  const options = {
    chart: {
      type: "line", // Line chart type
      backgroundColor: null, // Remove gray background
      height: 350,
    },
    title: {
      text: null, // No title text
    },
    credits: {
      enabled: false, // Remove the credits (logo)
    },
    legend: {
      enabled: false, // Remove the legend
    },
    xAxis: {
      categories: labels,
      title: {
        text: "Hour",
        style: {
          color: "#6B7280", // Tailwind gray-500
        },
      },
      labels: {
        style: {
          color: "#6B7280", // Tailwind gray-500
        },
      },
      gridLineWidth: 0, // Remove grid lines
    },
    yAxis: {
      title: {
        text: "Velocity (m/s)",
        style: {
          color: "#6B7280", // Tailwind gray-500
        },
      },
      min: 0, // Ensure the Y-axis starts from 0
      gridLineWidth: 0, // Remove grid lines
      labels: {
        style: {
          color: "#6B7280", // Tailwind gray-500
        },
      },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#1F2937", // Tailwind gray-900
      borderColor: "#00B5D8", // Teal color
      style: {
        color: "#fff",
      },
      valueSuffix: " m/s",
    },
    plotOptions: {
      line: {
        lineWidth: 2, // Line thickness
        color: "#00B5D8", // Teal color
      },
    },
    series: [
      {
        name: "Velocity (m/s)",
        data: velocityData,
        color: "red", // Teal color
        marker: {
          enabled: false, // Hide markers on data points for a cleaner look
        },
      },
    ],
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Velocity</h3>
      </div>

      {/* Chart */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default VelocityChartCard;
