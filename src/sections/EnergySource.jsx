import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import 'tailwindcss/tailwind.css';

const EnergySources = () => {
  // Data for energy consumption (in kWh)
  const energyData = {
    "Grid": 300,    // kWh
    "Diesel": 150,  // kWh
  };

  const chartOptions = {
    chart: {
      type: 'bar', // Horizontal bar chart
      height: '400px', // Height of the chart
    },
    title: {
      text: null,
      style: { fontSize: "18px", color: "#333" },
    },
    xAxis: {
      categories: Object.keys(energyData),
      title: {
        text: null,
        style: { fontSize: "14px", color: "#666" },
      },
      gridLineWidth: 0, // Disables grid lines on the x-axis
    },
    yAxis: {
      min: 0,
      title: {
        text: 'kWh',
        style: { fontSize: "14px", color: "#666" },
      },
      labels: {
        style: {
          fontSize: "12px", // Font size for the numbers on y-axis
        },
      },
      gridLineWidth: 0, // Disables grid lines on the y-axis
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "black",
          },
        },
      },
    },
    series: [
      {
        name: "Energy Consumption",
        data: [
          {
            y: energyData["Grid"],
            color: "rgba(54, 162, 235, 0.7)",  // Blue with opacity
          },
          {
            y: energyData["Diesel"],
            color: "rgba(153, 102, 255, 0.7)",  // Purple with opacity
          },
        ],
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: " kWh",
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="w-full flex flex-col p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center pb-6">
        <h2 className="text-xl font-semibold">Energy Sources</h2>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default EnergySources;