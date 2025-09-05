import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const WaterConsumptionCard = () => {
  const options = {
    chart: {
      type: 'areaspline', // Use areaspline for smooth curves
    },
    title: {
      text: null, // Remove chart title
    },
    credits: {
      enabled: false, // Disable Highcharts credits
    },
    legend: {
      enabled: false, // Turn off the legend
    },
    xAxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`), // Generate "00:00" to "23:00"
      title: {
        text: 'Hour',
      },
      gridLineWidth: 0, // Remove grid lines for x-axis
    },
    yAxis: {
      title: {
        text: 'Water Consumption (m³)',
      },
      tickInterval: 1, // Adjust interval to 1 m³ for whole numbers
      allowDecimals: false, // Prevent decimals on the y-axis
      gridLineWidth: 0, // Remove grid lines for y-axis
    },
    tooltip: {
      shared: true,
      valueSuffix: ' m³',
      valueDecimals: 0, // Display whole numbers in the tooltip
    },
    plotOptions: {
      areaspline: {
        stacking: 'normal',
        lineColor: '#2563eb', // Tailwind indigo-600 color
        lineWidth: 2,
        fillOpacity: 0.2, // Add transparency to the filled area
        marker: {
          enabled: false, // Hide individual data point markers
        },
      },
    },
    series: [
      {
        name: 'Water Consumption',
        data: [
          3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 4,
          5, 6, 7, 6, 5, 4, 3, 2, 3, 2, 1, 2,
        ], // Example data in whole cubic meters
        color: '#2563eb', // Tailwind indigo-600
      },
    ],
  };

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black">Water Consumption</h2>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default WaterConsumptionCard;
