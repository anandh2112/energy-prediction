import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Top Clients Data
const topClientsData = [
  {
    name: "Client 1",
    energy: 4585,
    trends: [4300, 4400, 4500, 4585, 4630, 4700, 4750, 4800, 4850, 4900, 4950, 5000],
  },
  {
    name: "Client 2",
    energy: 3122,
    trends: [3000, 3050, 3100, 3122, 3200, 3250, 3300, 3350, 3400, 3450, 3500, 3550],
  },
  {
    name: "Client 3",
    energy: 930,
    trends: [900, 920, 925, 930, 940, 950, 960, 970, 980, 990, 1000, 1020],
  },
  {
    name: "Client 4",
    energy: 666,
    trends: [650, 660, 665, 666, 670, 675, 680, 685, 690, 695, 700, 710],
  },
  {
    name: "Client 5", // New Client
    energy: 1890,
    trends: [1800, 1850, 1880, 1890, 1920, 1950, 1980, 2000, 2050, 2100, 2150, 2200], // New Client Trend Data
  },
];

const ClientSection = () => {
  return (
    <div className="client-section bg-gray-100 min-h-screen p-8">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Top Clients</h1>
      </div>

      <div className="space-y-8">
        {topClientsData.map((client, index) => (
          <div key={client.name} className="bg-white shadow-lg rounded-lg p-6">
            {/* Client Info Section */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{client.name}</h2>
            <p className="text-sm text-gray-600 mb-4">Energy Consumption: {client.energy} kWh</p>

            {/* Trend Line Chart for each client */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={client.trends.map((_, idx) => ({
                  month: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                  ][idx],
                  energy: client.trends[idx],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke={["#3F51B5", "#4CAF50", "#FFC107", "#FF5722", "#00BCD4"][index]} // Line colors
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSection;
