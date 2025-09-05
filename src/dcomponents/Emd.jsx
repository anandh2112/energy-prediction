import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import em from "../sections/pictures/em.png"; // Meter Image

const Emd = () => {
  const { id } = useParams(); // Extract ID from the URL
  const navigate = useNavigate();

  // Hardcoded data for meter details
  const meterDetails = {
    zone: `Zone ${id}`,
    consumption: "850.62", // Consumption in kWh
    voltage: "230.5",     // Voltage in Volts
    current: "6.35",      // Current in Amps
    powerFactor: "0.98",  // Power Factor
    lastUpdated: "2025-01-31 15:30", // Last Updated timestamp
    meterStatus: "Active", // Status of the meter
    energySavings: "120 kWh", // Energy savings in kWh
    maintenanceDue: "2025-02-15", // Next maintenance date
  };

  // Hardcoded consumption data for chart (timestamps and consumption values)
  const consumptionData = [
    [1706580000000, 50], // [Timestamp, Consumption]
    [1706583600000, 52],
    [1706587200000, 55],
    [1706590800000, 58],
    [1706594400000, 53],
    [1706598000000, 54],
    [1706601600000, 51],
  ];

  // Highcharts options for Consumption chart
  const chartOptions = {
    chart: {
      type: "line",
      backgroundColor: "transparent", // Removes the background color of the chart
      height: "400px", // Set a fixed height for the chart container
    },
    title: {
      text: null,
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%H:%M", this.value); // Format the timestamp to hours:minutes
        },
      },
      gridLineWidth: 0, // Remove x-axis grid lines
    },
    yAxis: {
      title: {
        text: "Consumption (kWh)",
      },
      gridLineWidth: 0, // Remove y-axis grid lines
    },
    series: [
      {
        name: "Consumption",
        data: consumptionData,
        color: "#FF9800", // Line color
      },
    ],
    credits: {
      enabled: false, // Disable chart credits
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full mt-10">
      {/* Flex container for two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Meter Details */}
        <div className="lg:w-1/3 p-6 border-r border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-4">{meterDetails.zone}</h2>
{/* Center the image horizontally */}
<div className="flex justify-center pb-4">
    <img src={em} className="w-[100px] h-[100px]" alt="Energy Meter" />
  </div>
          <div className="text-lg text-gray-700 space-y-2">
            <p><strong>Consumption:</strong> {meterDetails.consumption} kWh</p>
            <p><strong>Voltage:</strong> {meterDetails.voltage} V</p>
            <p><strong>Current:</strong> {meterDetails.current} A</p>
            <p><strong>Power Factor:</strong> {meterDetails.powerFactor}</p>
            <p><strong>Meter Status:</strong> {meterDetails.meterStatus}</p>      
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-800"
          >
            ← Back to Meters
          </button>
        </div>

        {/* Right Side - Consumption Chart */}
        <div className="lg:w-2/3 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Z-1 Consumption</h2>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Emd;
