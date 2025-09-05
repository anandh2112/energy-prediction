import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FacilityUsaget = () => {
  const [activeZone, setActiveZone] = useState(0);

  const zones = ["ZONE 1", "ZONE 2", "ZONE 3", "ZONE 4", "ZONE 5", "ZONE 6", "ZONE 7"];

  const handleZoneClick = (index) => {
    setActiveZone(index);
  };

  const data = {
    labels: ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"],
    datasets: [
      {
        label: zones[activeZone],
        data: [10, 30, 50, 40, 60, 80],
        backgroundColor: "#007BFF", // Bar color
        borderColor: "#0056b3",     // Border color
        borderWidth: 1,
        hoverBackgroundColor: "#0056b3", // Hover effect
        hoverBorderColor: "#003f7d",    // Hover border color
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
            color: '#333',
          }
        }
      },
      y: {
        ticks: {
          beginAtZero: true,
          font: {
            size: 12,
            weight: 'bold',
            color: '#333',
          },
        },
        grid: { drawBorder: false },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            color: '#333',
          }
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        width: "100%", // Take full width of the parent container
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Zones List */}
      <div style={{ display: "flex", marginBottom: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {zones.map((zone, index) => (
          <div
            key={index}
            onClick={() => handleZoneClick(index)}
            style={{
              margin: "8px",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeZone === index ? "#d1f0ff" : "#fff",
              border: activeZone === index ? "1px solid #007BFF" : "1px solid #ddd",
              textAlign: "center",
              fontWeight: activeZone === index ? "bold" : "normal",
              boxShadow: activeZone === index ? "0 0 8px rgba(0, 123, 255, 0.5)" : "none",
            }}
          >
            {zone}
          </div>
        ))}
      </div>

      {/* Chart Title */}
      <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>Facility Usage</h2>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: "300px", marginTop: "16px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FacilityUsaget;
