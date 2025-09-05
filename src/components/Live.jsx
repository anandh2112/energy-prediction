import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Live() {
  const [meters, setMeters] = useState({});
  const topic = 'energy_meter/test';

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const response = await fetch('https://your-api-endpoint.com/initial-data'); // Replace with your backend endpoint
      const initialData = await response.json();
      console.log('Fetched initial data:', initialData);

      setMeters(
        initialData.reduce((acc, data) => {
          acc[data.energy_meter_id] = {
            parameters: data.parameters,
            history: data.history || [],
          };
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();

    const mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker!');
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Successfully subscribed to topic "${topic}"`);
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received data:', data);

        setMeters((prevMeters) => ({
          ...prevMeters,
          [data.energy_meter_id]: {
            ...(prevMeters[data.energy_meter_id] || {}),
            parameters: data.parameters,
            history: [
              ...(prevMeters[data.energy_meter_id]?.history || []),
              { ...data.parameters, timestamp: new Date().toLocaleTimeString() },
            ].slice(-10), // Keep only the last 10 data points
          },
        }));
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    mqttClient.on('error', (err) => {
      console.log('MQTT connection error:', err);
    });

    mqttClient.on('close', () => {
      console.log('MQTT connection closed');
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  // Render the meter cards dynamically
  const renderMeterCards = () => {
    const meterCards = [];
    for (let i = 2; i <= 6; i++) {
      const meterData = meters[i];
      const history = meterData?.history || [];

      // Filter out 'Unknown' entries
      const filteredHistory = history.map((entry) =>
        Object.fromEntries(Object.entries(entry).filter(([key]) => !key.includes('Unknown')))
      );

      meterCards.push(
        <div
          key={i}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 space-y-4"
        >
          {/* Meter Details */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700">Energy Meter {i}</h3>
            {meterData?.parameters ? (
              <div className="text-sm text-gray-600">
                {Object.entries(meterData.parameters)
                  .filter(([key]) => !key.includes('Unknown'))
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>

          {/* Energy Trends Chart */}
          {history.length > 0 && (
            <div className="bg-gray-50 rounded-lg shadow-inner p-4">
              <h4 className="text-md font-semibold text-gray-600 mb-4">Energy Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredHistory}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="timestamp" tick={false} /> {/* X-Axis labels hidden */}
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      return (
                        <div className="bg-white p-2 shadow-md rounded">
                          {payload
                            .filter((entry) => entry.dataKey !== 'timestamp') // Exclude timestamp
                            .map((entry, index) => (
                              <p key={index} className="text-sm text-gray-700">
                                <strong>{entry.name}:</strong> {entry.value}
                              </p>
                            ))}
                        </div>
                      );
                    }}
                  />
                  {Object.keys(filteredHistory[0] || {})
                    .filter((key) => key !== 'timestamp')
                    .map((key) => (
                      <Bar key={key} dataKey={key} fill="#82ca9d" />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }
    return meterCards;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Energy Meter Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderMeterCards()}
      </div>
    </div>
  );
}

export default Live;
