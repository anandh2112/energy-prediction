import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChargingStation } from '@fortawesome/free-solid-svg-icons';

const EVChargingOverview = () => {
  // Sample data for EV chargers
  const evChargersData = [
    {
      location: 'Block A',
      energyConsumed: 500, // in kWh
      sessions: 15,
    },
    {
      location: 'Block B',
      energyConsumed: 700,
      sessions: 20,
    },
    {
      location: 'Block C',
      energyConsumed: 300,
      sessions: 10,
    },
    {
      location: 'Block D',
      energyConsumed: 400,
      sessions: 12,
    },
  ];

  // Sample data for monthly EV charging sessions
  const chargingSessionsData = [
    { month: 'Jan', sessions: 30 },
    { month: 'Feb', sessions: 40 },
    { month: 'Mar', sessions: 50 },
    { month: 'Apr', sessions: 60 },
    { month: 'May', sessions: 70 },
    { month: 'Jun', sessions: 80 },
  ];

  // Pie chart data for energy consumption distribution
  const pieChartData = evChargersData.map((charger) => ({
    name: charger.location,
    value: charger.energyConsumed,
  }));

  const COLORS = ['#FFDD57', '#0088FE', '#00C49F', '#FF7300'];

  // Calculating total values
  const totalEnergyConsumed = evChargersData.reduce((acc, charger) => acc + charger.energyConsumed, 0);
  const totalSessions = evChargersData.reduce((acc, charger) => acc + charger.sessions, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">EV Charging Overview</h1>

      {/* EV Chargers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {evChargersData.map((charger, index) => (
          <div key={index} className="ev-charger-card animate-fade-in bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <FontAwesomeIcon icon={faChargingStation} className="text-5xl text-blue-600 mb-2" />
            <h2 className="text-xl font-semibold">{charger.location}</h2>
            <p className="text-lg font-bold">{charger.energyConsumed} kWh</p>
            <p className="text-sm text-gray-600">Sessions: {charger.sessions}</p>
          </div>
        ))}
      </div>

      {/* Row for Charging Sessions and Consumption Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Monthly EV Charging Sessions Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly EV Charging Sessions</h2>
          <BarChart width={600} height={300} data={chargingSessionsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Bar dataKey="sessions" fill="#0088FE" />
          </BarChart>
        </div>

        {/* Energy Consumption Distribution Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Consumption Distribution</h2>
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
            <p className="font-semibold">Total Energy Consumed: {totalEnergyConsumed} kWh</p>
            <p className="font-semibold">Total Sessions: {totalSessions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EVChargingOverview;
