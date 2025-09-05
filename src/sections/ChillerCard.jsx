import React, { useState } from "react";
import Plot from 'react-plotly.js'; // Using Plotly for the chart
import { useNavigate } from "react-router-dom";
import DateSelector from "../components/DateSelector";
import chillerImage from "../pages/chiller2.png";

const Chiller = ({ title, cop, description, chartData }) => {
  const navigate = useNavigate();

  const onViewDetails = () => {
    navigate(`/chillerdetail`);
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between mb-6 space-y-6 md:space-y-0">
      {/* Left Section: Image and Details */}
      <div className="flex flex-col items-center w-full md:w-1/3 space-y-3">
        <img
          src={chillerImage}
          alt={title}
          className="w-20 h-20 md:w-28 md:h-28 object-contain border border-gray-200 rounded-md"
        />
        <div className="text-sm text-gray-700">
          <span className="font-medium">COP: </span>{cop}
        </div>
        <button
          className="w-32 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 mt-4"
          onClick={onViewDetails}
        >
          View Details
        </button>
        <div className="text-xs text-gray-500 text-center mt-2">
          {description}
        </div>
      </div>

      {/* Right Section: Plotly Chart */}
      <div className="w-full md:w-2/3 flex justify-center items-center p-4">
        <Plot
          data={[
            {
              x: chartData.labels,
              y: chartData.data,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#6b7280', size: 6 },
              line: { color: '#6b7280', width: 2 },
            },
          ]}
          layout={{
            margin: { t: 30, r: 20, b: 40, l: 40 },
            xaxis: {
              title: '',
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              title: '',
              showgrid: true,
              zeroline: false,
            },
            showlegend: false,
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

// Main ChillersCard Component
const ChillersCard = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const chillers = [
    {
      chillerId: 1, // Unique ID
      title: "Chiller 1",
      cop: 3.5,
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        data: [85, 90, 88, 91, 93, 89, 92],
      },
    },
    {
      chillerId: 2, // Unique ID
      title: "Chiller 2",
      cop: 4.0,
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        data: [80, 85, 83, 87, 90, 88, 92],
      },
    },
  ];

  // Handle tooltip (pop-up) for comparison
  const handleCompareClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Chillers</h3>
        <DateSelector />
      </div>

      {/* Compare Button */}
      <button
        className="w-32 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 mb-4"
        onClick={handleCompareClick}
      >
        Compare
      </button>

      {/* Chiller Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chillers.map((chillerData, chillerId) => (
          <Chiller key={chillerId} {...chillerData} />
        ))}
      </div>

      {/* Tooltip for Combined Chart */}
      {isTooltipOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 md:w-2/3 relative">
            <button
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
              onClick={handleCompareClick} 
            >
              X
            </button>
            <h3 className="text-lg font-bold mb-4">Compare All Chillers</h3>
            <div className="w-full h-[400px]"> {/* Fixed height container */}
              <Plot
                data={chillers.map((chiller, index) => ({
                  x: chiller.chartData.labels,
                  y: chiller.chartData.data,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: index === 0 ? '#6b7280' : '#4b5563', size: 6 },
                  line: { color: index === 0 ? '#6b7280' : '#4b5563', width: 2 },
                }))}
                layout={{
                  margin: { t: 30, r: 20, b: 40, l: 40 },
                  xaxis: { title: '', showgrid: false, zeroline: false },
                  yaxis: { title: '', showgrid: true, zeroline: false },
                  showlegend: false,
                  plot_bgcolor: 'white',
                  paper_bgcolor: 'white',
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChillersCard;
