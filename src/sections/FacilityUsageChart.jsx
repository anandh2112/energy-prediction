import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const FacilityUsageChart = () => {
  const data = {
    labels: ['Chiller', 'Client', 'Others', 'Common Area'],
    datasets: [
      {
        data: [12916, 12450, 1800, 28],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
        hoverBackgroundColor: ['#66BB6A', '#42A5F5', '#FFB74D', '#BA68C8'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Energy Distribution</h4>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default FacilityUsageChart;
