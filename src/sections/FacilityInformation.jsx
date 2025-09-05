import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const topZonesData = [
  {
    name: "Zone 1",
    energy: 585,
    trends: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410],
  },
  {
    name: "Zone 2",
    energy: 312,
    trends: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260],
  },
  {
    name: "Zone 3",
    energy: 930,
    trends: [500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
  },
  {
    name: "Zone 4",
    energy: 666,
    trends: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410],
  },
  {
    name: "Zone 5", 
    energy: 890,
    trends: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310], 
  },
];

// Sort the zones in descending order of energy consumption
const sortedZonesData = topZonesData.sort((a, b) => b.energy - a.energy);

const TopZones = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Outer Common Card for Top Clients */}
      <h4 className="text-lg font-bold text-gray-700 mb-6">Top Zones</h4>

      {/* Grid Layout for Client Partitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {sortedZonesData.map((zone, index) => (
          <div
            key={zone.name}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-300"
          >
            <h5 className="text-xl font-semibold text-gray-800 mb-2">{zone.name}</h5>
            <p className="text-sm text-gray-600">Energy Consumption: {zone.energy} kWh</p>
          </div>
        ))}
      </div>

      <div
        className="w-full -translate-x-4"
        style={{
          maxWidth: "100%",
          height: "400px", 
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedZonesData[0].trends.map((_, index) => ({
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
            ...sortedZonesData.reduce((acc, zone, idx) => {
              acc[`zone${idx + 1}`] = zone.trends[index];
              return acc;
            }, {})
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {sortedZonesData.map((zone, index) => (
              <Line
                key={zone.name}
                type="monotone"
                dataKey={`zone${index + 1}`}
                stroke={["#3F51B5", "#4CAF50", "#FFC107", "#FF5722", "#00BCD4"][index]} 
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopZones;
