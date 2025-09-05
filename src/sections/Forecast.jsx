import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "tailwindcss/tailwind.css";

// Utility: format date from ISO string to 'YYYY-MM-DD'
const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toISOString().slice(0, 10);
};

// Utility: format datetime string (from API) into hour:00 format
const extractHour = (datetime) => {
  const d = new Date(datetime.replace(" ", "T")); // "2025-08-26 17:00:00"
  return d.getHours().toString().padStart(2, "0") + ":00";
};

// Format datetime as YYYY-MM-DD+HH:mm
const formatDateTimeParam = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}+${hh}:${mi}`;
};

const Forecast = () => {
  const today = formatDate(new Date());
  const minDate = "2025-08-28"; // Minimum selectable date

  const [predictionData, setPredictionData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [accuracy, setAccuracy] = useState(null);

  // Fetch both predicted and actual data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // --- Prediction Data ---
        let predictionJson = [];
        if (selectedDate === today) {
          // Current date: fetch latest prediction
          const predictionRes = await fetch(
            "http://localhost:3001/api/prediction-data"
          );
          predictionJson = await predictionRes.json();
        } else {
          // Past date: fetch from prediction-history
          const historyRes = await fetch(
            `http://localhost:3001/api/prediction-history?date=${selectedDate}`
          );
          predictionJson = await historyRes.json();
        }

        const transformedPrediction = Array.isArray(predictionJson)
          ? predictionJson.map((row) => ({
              date: row.date,
              hour:
                typeof row.hour === "number"
                  ? row.hour.toString().padStart(2, "0") + ":00"
                  : String(row.hour).length === 5
                  ? row.hour
                  : String(row.hour).slice(0, 5),
              predicted_kvah:
                row.predicted_kvah !== undefined ? row.predicted_kvah : row.kvah,
            }))
          : [];
        setPredictionData(transformedPrediction);

        // --- Actual Data ---
        const chosenDate = new Date(selectedDate);
        const startOfDay = new Date(chosenDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(chosenDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setHours(0, 0, 0, 0);

        const startParam = formatDateTimeParam(startOfDay);
        const endParam = formatDateTimeParam(endOfDay);

        const actualUrl = `https://mw.elementsenergies.com/api/hkVAhconsumption?startDateTime=${startParam}&endDateTime=${endParam}`;
        const actualRes = await fetch(actualUrl);
        const actualJson = await actualRes.json();

        const consumptionData = actualJson.consumptionData || {};
        const transformedActual = Object.entries(consumptionData).map(
          ([datetime, value]) => ({
            date: datetime.split(" ")[0],
            hour: extractHour(datetime),
            actual_kvah: parseFloat(value),
          })
        );

        setActualData(transformedActual);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPredictionData([]);
        setActualData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, today]);

  // Get categories (hours)
  const categories = predictionData.map((row) => row.hour);

  // Predicted data series
  const predictedSeries = predictionData.map((row) => ({
    y: row.predicted_kvah,
  }));

  // Actual data series (align with prediction categories)
  const actualSeries = categories.map((hour) => {
    const match = actualData.find((a) => a.hour === hour);
    return match ? match.actual_kvah : null;
  });

  // --- Calculate Accuracy ---
  useEffect(() => {
    if (predictionData.length > 0 && actualData.length > 0) {
      let totalAccuracy = 0;
      let count = 0;
      categories.forEach((hour, idx) => {
        const predicted = predictionData[idx]?.predicted_kvah;
        const actual = actualSeries[idx];
        if (predicted && actual) {
          const errorPct = Math.abs((actual - predicted) / predicted) * 100;
          const acc = Math.max(0, 100 - errorPct); // avoid negative
          totalAccuracy += acc;
          count++;
        }
      });
      setAccuracy(count > 0 ? (totalAccuracy / count).toFixed(2) : null);
    } else {
      setAccuracy(null);
    }
  }, [predictionData, actualData]);

  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      width: null,
      height: 400,
    },
    title: { text: null },
    xAxis: {
      categories: categories,
      labels: {
        formatter: function () {
          return this.value;
        },
      },
    },
    yAxis: {
      min: 0,
      title: { text: "kVAh" },
      gridLineWidth: 0,
    },
    plotOptions: {
      column: {
        borderWidth: 2,
        borderDashStyle: "dot",
      },
    },
    series: [
      {
        name: "Predicted kVAh",
        data: predictedSeries,
        color: "rgba(255, 152, 0, 0.6)", // Orange
        borderColor: "rgba(255, 152, 0, 1)",
      },
      {
        name: "Actual kVAh",
        data: actualSeries,
        color: "rgba(33, 150, 243, 0.6)", // Blue
        borderColor: "rgba(33, 150, 243, 1)",
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: " kVAh",
      style: { zIndex: 1 },
    },
    legend: { enabled: true },
    credits: { enabled: false },
    exporting: { enabled: false },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            xAxis: { labels: { rotation: -45 } },
          },
        },
      ],
    },
  };

  return (
    <div className="w-full h-full max-w-full p-6 bg-#F3F4F6 shadow-lg rounded-lg">
      <div className="w-full max-w-full overflow-x-hidden flex flex-col p-6 bg-white shadow-lg rounded-lg">
        {/* Title Row with Date Picker + Accuracy Badge */}
        <div className="flex justify-between items-center pb-6">
          <h2 className="text-xl font-semibold">
            Forecasted vs Actual Hourly Energy Consumption
          </h2>
          <div className="flex items-center gap-3">
            {/* Accuracy Badge */}
            {!loading && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  accuracy >= 90
                    ? "bg-green-100 text-green-700"
                    : accuracy >= 70
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {accuracy !== null ? `Accuracy: ${accuracy}%` : "N/A"}
              </span>
            )}
            {/* Date Picker */}
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDate}
              min={minDate}
              max={today}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <span className="text-gray-500 text-lg font-medium">
                Loading...
              </span>
            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              containerProps={{ style: { width: "100%", height: "400px" } }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;