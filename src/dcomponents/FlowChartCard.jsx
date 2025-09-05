import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const FlowChartCard = () => {
  // Generate data for 24 hours with a flow around 3.1 m³/hr
  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const flowData = [
    3.0, 3.2, 3.1, 3.3, 3.0, 3.4, 3.2, 3.3, 3.1, 3.0, 3.2, 3.1,
    3.4, 3.5, 3.2, 3.3, 3.0, 3.1, 3.4, 3.2, 3.0, 3.1, 3.3, 3.0,
  ];

  const options = {
    chart: {
      type: "areaspline", // Smooth curve type
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
      enabled: false, // Turn off the legend
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
        text: "Flow (m³/hr)",
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
      borderColor: "#10B981", // Tailwind green-500
      style: {
        color: "#fff",
      },
      valueSuffix: " m³/hr",
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.3, // Slight transparency for the filled area
        lineWidth: 2, // Line thickness
        color: "#10B981", // Tailwind green-500
      },
    },
    series: [
      {
        name: "Flow (m³/hr)",
        data: flowData,
        color: "#10B981", // Tailwind green-500 color
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
        <h3 className="text-lg font-semibold text-black">Flow</h3>
      </div>

      {/* Chart */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FlowChartCard;
