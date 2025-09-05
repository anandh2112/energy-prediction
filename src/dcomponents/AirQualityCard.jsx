import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AirQualityCard = () => {
  const options = {
    chart: {
      type: "line",
      backgroundColor: null, // Removes background color
    },
    title: {
      text: null
    },
    xAxis: {
      categories: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      title: {
        text: "Time (24 hours)",
      },
      lineWidth: 0, // Removes x-axis line
    },
    yAxis: {
      title: {
        text: "Air Quality (ppm)",
      },
      gridLineWidth: 0, // Removes y-axis grid lines
    },
    tooltip: {
      shared: true,
      valueSuffix: " ppm",
    },
    legend: {
      enabled: false, // Disables legend
    },
    credits: {
      enabled: false, // Disables credits
    },
    series: [
      {
        name: "Air Quality",
        data: [50, 45, 40, 35, 60, 80, 120, 140, 130, 110, 90, 80, 60, 40, 35, 30, 50, 70, 90, 120, 100, 80, 60, 40],
        color: "#00aaff",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <h2 className="text-lg text-black font-semibold mb-4">Air Quality</h2>

      {/* Chart */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AirQualityCard;
