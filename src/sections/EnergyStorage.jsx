import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryHalf } from '@fortawesome/free-solid-svg-icons';

const EnergyStorageOverview = () => {
  // Sample data for energy storage units
  const storageUnitsData = [
    {
      name: 'Unit A',
      energyStored: 1200, // in kWh
      efficiency: '95%',
    },
    {
      name: 'Unit B',
      energyStored: 800,
      efficiency: '90%',
    },
    {
      name: 'Unit C',
      energyStored: 1500,
      efficiency: '97%',
    },
    {
      name: 'Unit D',
      energyStored: 600,
      efficiency: '85%',
    },
  ];

  // Sample data for monthly energy storage
  const storageData = [
    { month: 'Jan', stored: 1500 },
    { month: 'Feb', stored: 1200 },
    { month: 'Mar', stored: 1800 },
    { month: 'Apr', stored: 1600 },
    { month: 'May', stored: 2000 },
    { month: 'Jun', stored: 2200 },
  ];

  // Pie chart data for energy storage distribution
  const pieChartData = storageUnitsData.map((unit) => ({
    name: unit.name,
    value: unit.energyStored,
  }));

  const COLORS = ['#FFDD57', '#0088FE', '#00C49F', '#FF7300'];

  // Calculating total values
  const totalEnergyStored = storageUnitsData.reduce((acc, unit) => acc + unit.energyStored, 0);
  const totalUnits = storageUnitsData.length;

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Energy Storage Overview</h1>

      {/* Energy Storage Units Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {storageUnitsData.map((unit, index) => (
          <div key={index} className="storage-unit-card animate-fade-in bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <FontAwesomeIcon icon={faBatteryHalf} className="text-5xl text-yellow-600 mb-2" />
            <h2 className="text-xl font-semibold">{unit.name}</h2>
            <p className="text-lg font-bold">{unit.energyStored} kWh</p>
            <p className="text-sm text-gray-600">Efficiency: {unit.efficiency}</p>
          </div>
        ))}
      </div>

      {/* Row for Storage Data and Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Monthly Energy Storage Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Energy Storage</h2>
          <BarChart width={600} height={300} data={storageData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Bar dataKey="stored" fill="#FFDD57" />
          </BarChart>
        </div>

        {/* Energy Storage Distribution Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Storage Distribution</h2>
          <PieChart width={600} height={300}>
            <Pie
              data={pieChartData}
              cx={300}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div className="mt-4">
            <p className="font-semibold">Total Energy Stored: {totalEnergyStored} kWh</p>
            <p className="font-semibold">Total Units: {totalUnits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyStorageOverview;
