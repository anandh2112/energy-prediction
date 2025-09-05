import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faChartLine, faThumbsUp, faCogs, faRecycle } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign, faBolt, faLeaf, faSmile } from '@fortawesome/free-solid-svg-icons';

import './Optimize.css'; // Import custom CSS for styles and animations

const OptimizeOverview = () => {
  // Sample data for energy optimization metrics
  const optimizationData = [
    { name: 'Week 1', usage: 400, savings: 50 },
    { name: 'Week 2', usage: 350, savings: 80 },
    { name: 'Week 3', usage: 300, savings: 120 },
    { name: 'Week 4', usage: 250, savings: 150 },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen overflow-hidden relative">

      {/* Background Animation Effect */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="w-full h-full bg-gray-200 opacity-50"></div>
      </div>

      {/* Optimization Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="optimization-card animate-fade-in bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faLightbulb} className="text-3xl text-yellow-600" />
            <h2 className="text-xl font-semibold ml-2">Energy Savings</h2>
          </div>
          <p className="text-lg font-bold">Total Savings: 450 kWh</p>
          <p className="text-sm text-gray-600">By implementing energy-saving measures</p>
        </div>

        <div className="optimization-card animate-fade-in bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-green-600" />
            <h2 className="text-xl font-semibold ml-2">Usage Trends</h2>
          </div>
          <p className="text-lg font-bold">Current Usage: 2500 kWh</p>
          <p className="text-sm text-gray-600">Compared to last month</p>
        </div>

        <div className="optimization-card animate-fade-in bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faThumbsUp} className="text-3xl text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">Positive Impact</h2>
          </div>
          <p className="text-lg">1,500 kg CO<sub>2</sub> Saved</p>
          <p className="text-sm text-gray-600">Equivalent to planting 75 trees</p>
        </div>

        <div className="optimization-card animate-fade-in bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faCogs} className="text-3xl text-orange-600" />
            <h2 className="text-xl font-semibold ml-2">System Efficiency</h2>
          </div>
          <p className="text-lg font-bold">Efficiency Rate: 85%</p>
          <p className="text-sm text-gray-600">Compared to industry standards</p>
        </div>

        <div className="optimization-card animate-fade-in bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faRecycle} className="text-3xl text-purple-600" />
            <h2 className="text-xl font-semibold ml-2">Renewable Usage</h2>
          </div>
          <p className="text-lg">Renewable Energy: 70%</p>
          <p className="text-sm text-gray-600">From solar and wind sources</p>
        </div>

        <div className="optimization-card animate-fade-in bg-white shadow-lg p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-green-600" />
            <h2 className="text-xl font-semibold ml-2">Recommendations</h2>
          </div>
          <p className="text-lg">1. Upgrade to LED Lighting</p>
          <p className="text-lg">2. Optimize HVAC Schedule</p>
          <p className="text-lg">3. Install Smart Meters</p>
        </div>
      </div>

      {/* Energy Optimization Chart */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Energy Usage & Savings Over Time</h2>
        <BarChart width={800} height={300} data={optimizationData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Bar dataKey="usage" fill="#8884d8" name="Usage (kWh)" />
          <Bar dataKey="savings" fill="#82ca9d" name="Savings (kWh)" />
        </BarChart>
      </div>

      <div className="big-card bg-white rounded-lg p-6 mb-8">
  <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">Future Optimization Strategies</h2>
  
  <p className="text-lg mb-4 text-center">
    Implementing the following strategies can lead to further optimization in energy usage:
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="strategy-card bg-blue-100 p-4 rounded-lg">
      <h3 className="font-semibold text-blue-800">Integrating AI</h3>
      <p>Utilize AI for predictive energy management to optimize usage based on real-time data.</p>
    </div>
    <div className="strategy-card bg-green-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-green-800">Battery Storage</h3>
      <p>Implement battery storage solutions to shave off peak loads and save on costs.</p>
    </div>
    <div className="strategy-card bg-yellow-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-yellow-800">Demand Response Programs</h3>
      <p>Engage in demand response programs to optimize energy use during peak times.</p>
    </div>
    <div className="strategy-card bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-orange-800">Energy-efficient Appliances</h3>
      <p>Invest in energy-efficient appliances to lower consumption and costs.</p>
    </div>
  </div>

  <div className="mt-10 bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Visualize Your Savings!</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="saving-card bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <div className="icon-container bg-green-200 p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faDollarSign} className="text-4xl text-green-600" />
            </div>
            <p className="text-xl font-semibold text-green-700 mb-2">Energy Cost Reduction</p>
            <p className="text-2xl font-bold text-green-800">30%</p>
            <div className="w-full h-3 bg-green-100 rounded-full mt-3">
              <div className="h-full bg-green-500 rounded-full animate-progress" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div className="saving-card bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <div className="icon-container bg-blue-200 p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faBolt} className="text-4xl text-blue-600" />
            </div>
            <p className="text-xl font-semibold text-blue-700 mb-2">System Reliability</p>
            <p className="text-2xl font-bold text-blue-800">Enhanced</p>
            <div className="w-full h-3 bg-blue-100 rounded-full mt-3">
              <div className="h-full bg-blue-500 rounded-full animate-progress" style={{ width: '80%' }}></div>
            </div>
          </div>

          <div className="saving-card bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <div className="icon-container bg-yellow-200 p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faLeaf} className="text-4xl text-yellow-600" />
            </div>
            <p className="text-xl font-semibold text-yellow-700 mb-2">Carbon Footprint Reduction</p>
            <p className="text-2xl font-bold text-yellow-800">40%</p>
            <div className="w-full h-3 bg-yellow-100 rounded-full mt-3">
              <div className="h-full bg-yellow-500 rounded-full animate-progress" style={{ width: '40%' }}></div>
            </div>
          </div>

          <div className="saving-card bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <div className="icon-container bg-orange-200 p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faSmile} className="text-4xl text-orange-600" />
            </div>
            <p className="text-xl font-semibold text-orange-700 mb-2">User Engagement</p>
            <p className="text-2xl font-bold text-orange-800">Improved</p>
            <div className="w-full h-3 bg-orange-100 rounded-full mt-3">
              <div className="h-full bg-orange-500 rounded-full animate-progress" style={{ width: '70%' }}></div>
            </div>
          </div>

        </div>
  </div>
</div>

    </div>
  );
};

export default OptimizeOverview;
