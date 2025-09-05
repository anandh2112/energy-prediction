import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaArrowRight } from "react-icons/fa";

const EnergyHeatmap = () => {
  const [startDate, setStartDate] = useState(() =>
    moment.tz("Asia/Kolkata").subtract(30, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(() =>
    moment.tz("Asia/Kolkata").format("YYYY-MM-DD")
  );

  const [viewStartDate, setViewStartDate] = useState(startDate);
  const [viewEndDate, setViewEndDate] = useState(endDate);

  const [consumptionData, setConsumptionData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });
  const [warning, setWarning] = useState("");

  

  const svgRef = useRef();

  useEffect(() => {
    setViewStartDate(startDate);
    setViewEndDate(endDate);
    fetchConsumptionData(startDate, endDate);
  }, []);
  

  const fetchConsumptionData = async (start, end) => {
    try {
      const res = await axios.get("http://localhost:3001/api/ehconsumption", {
        params: { startDate: start, endDate: end },
      });
      setConsumptionData(res.data.consumptionData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSubmit = () => {
    const diff = moment(endDate).diff(moment(startDate), "days");
    if (diff > 31) {
      setWarning("Maximum range allowed is 31 days. Please adjust the dates.");
      setConsumptionData([]);
    } else {
      setWarning("");
      setViewStartDate(startDate);
      setViewEndDate(endDate);
      fetchConsumptionData(startDate, endDate);
    }
  };

  const handleDownloadExcel = () => {
    if (!consumptionData?.length) return;

    const headerRow = [
      `Start: ${moment(viewStartDate).format("YYYY-MM-DD HH:mm:ss")}`,
      `End: ${moment(viewEndDate).format("YYYY-MM-DD HH:mm:ss")}`,
      "",
    ];

    const columnHeaders = ["Date", "Hour", "Energy Consumed (kVAh)"];
    const formattedData = consumptionData.map((item) => [
      item.day,
      `${item.hour}:00`,
      parseFloat(item.total_consumption),
    ]);

    const dataForExcel = [headerRow, columnHeaders, ...formattedData];

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EnergyConsumption");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      data,
      `Heat_Map_${moment(viewStartDate).format("YYYY_MM_DD")}_to_${moment(viewEndDate).format(
        "YYYY_MM_DD"
      )}.xlsx`
    );
  };

  const daysDiff =
    Math.ceil((new Date(viewEndDate) - new Date(viewStartDate)) / 86400000) + 1;
  const dateArray = Array.from({ length: daysDiff }, (_, i) => {
    const d = new Date(viewStartDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const heatmapData = Array(24)
    .fill()
    .map(() => Array(daysDiff).fill(null));

  consumptionData?.forEach(({ day, hour, total_consumption }) => {
    const dayIndex = dateArray.indexOf(day);
    if (dayIndex !== -1 && hour >= 0 && hour < 24) {
      heatmapData[hour][dayIndex] = parseFloat(total_consumption);
    }
  });

  const maxValue = Math.max(...heatmapData.flat().filter((v) => v !== null)) || 1;

  const getColor = (value) => {
    if (value === null || maxValue === 0) return "white";
  
    const intensity = Math.min(value / maxValue, 1);
  
    const gradientStops = [
      { stop: 0.0, color: "#006400" }, 
      { stop: 0.25, color: "#90EE90" }, 
      { stop: 0.5, color: "#FFFF00" }, 
      { stop: 0.75, color: "#FFA500" }, 
      { stop: 1.0, color: "#FF0000" }, 
    ];
    
  
    const interpolateColor = (color1, color2, factor) => {
      const c1 = parseInt(color1.slice(1), 16);
      const c2 = parseInt(color2.slice(1), 16);
  
      const r1 = (c1 >> 16) & 0xff;
      const g1 = (c1 >> 8) & 0xff;
      const b1 = c1 & 0xff;
  
      const r2 = (c2 >> 16) & 0xff;
      const g2 = (c2 >> 8) & 0xff;
      const b2 = c2 & 0xff;
  
      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));
  
      return `rgb(${r}, ${g}, ${b})`;
    };
  
    for (let i = 0; i < gradientStops.length - 1; i++) {
      const curr = gradientStops[i];
      const next = gradientStops[i + 1];
      if (intensity >= curr.stop && intensity <= next.stop) {
        const localFactor = (intensity - curr.stop) / (next.stop - curr.stop);
        return interpolateColor(curr.color, next.color, localFactor);
      }
    }
  
    return gradientStops[gradientStops.length - 1].color;
  };
  

  const cellSize = 24;
  const margin = { top: 40, right: 20, bottom: 60, left: 50 };
  const width = dateArray.length * cellSize + margin.left + margin.right;
  const height = 24 * cellSize + margin.top + margin.bottom;

  const monthSeparators = [];
  let currentMonth = new Date(viewStartDate).getMonth();
  dateArray.forEach((date, i) => {
    const month = new Date(date).getMonth();
    if (month !== currentMonth && i > 0) {
      monthSeparators.push({
        position: i,
        name: new Date(date).toLocaleDateString("en-US", { month: "long" }),
      });
      currentMonth = month;
    }
  });

  return (
    <div className="bg-white shadow rounded-lg p-7 relative w-full h-[700px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">Energy Heat Map</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-2 pr-2 py-1 border border-gray-300 rounded-md text-sm w-36"
            />
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-2 pr-2 py-1 border border-gray-300 rounded-md text-sm w-36"
            />

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
            >
              <FaArrowRight />
            </button>

            <button
              onClick={handleDownloadExcel}
              className="px-4 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download Excel
            </button>
          </div>
        </div>
      </div>

      {warning ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-yellow-600 bg-yellow-100 px-6 py-3 rounded-md border border-yellow-300 text-center text-base font-medium">
            {warning}
          </div>
        </div>
      ) : (
        <>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full pr-16 custom-dsm:pr-20"
            style={{ height: "100%" }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <text
                key={`hour-${i}`}
                x={margin.left - 5}
                y={margin.top + i * cellSize + cellSize / 1.5}
                textAnchor="end"
                fontSize="10"
                fill="#444"
              >
                {`${i}:00`}
              </text>
            ))}

            {dateArray.map((date, i) => (
              <text
                key={`date-${i}`}
                x={margin.left + i * cellSize + cellSize / 2}
                y={margin.top - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#444"
              >
                {new Date(date).getDate()}
              </text>
            ))}

            {heatmapData.map((row, hourIndex) =>
              row.map((value, dayIndex) => (
                <rect
                  key={`cell-${hourIndex}-${dayIndex}`}
                  x={margin.left + dayIndex * cellSize}
                  y={margin.top + hourIndex * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={getColor(value)}
                  onMouseEnter={(e) => {
                    const rect = svgRef.current.getBoundingClientRect();
                    setTooltip({
                      visible: true,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      content: `Date: ${dateArray[dayIndex]}\nHour: ${hourIndex}:00\nConsumption: ${
                        value !== null ? value.toFixed(2) + " kVAh" : "N/A"
                      }`,
                    });
                  }}
                  onMouseMove={(e) => {
                    const rect = svgRef.current.getBoundingClientRect();
                    setTooltip((prev) => ({
                      ...prev,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    }));
                  }}
                  onMouseLeave={() =>
                    setTooltip({ visible: false, x: 0, y: 0, content: "" })
                  }
                />
              ))
            )}

            {monthSeparators.map(({ position, name }, i) => (
              <g key={`separator-${i}`}>
                <line
                  x1={margin.left + position * cellSize}
                  y1={margin.top}
                  x2={margin.left + position * cellSize}
                  y2={height - margin.bottom}
                  stroke="black"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <text
                  x={margin.left + position * cellSize + 5}
                  y={margin.top - 20}
                  fontSize="12"
                  fill="black"
                >
                  {name}
                </text>
              </g>
            ))}


          </svg>
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2">
  <div className="text-xs text-gray-600 font-medium">Energy (kVAh)</div>
  <div className="flex flex-row items-center gap-2">
    <div
      style={{
        width: "20px",
        height: "300px",
        background: "linear-gradient(to bottom, red, orange, yellow, lightgreen, darkgreen)",
        border: "1px solid #333",
      }}
    />
    <div className="flex flex-col justify-between h-[300px] text-xs text-gray-800 font-medium">
      <div>{Math.round(maxValue / 100) * 100}</div>
      <div>0</div>
    </div>
  </div>
</div>




          {tooltip.visible && (
            <div
              className="absolute z-50 p-2 text-xs bg-black text-white rounded shadow"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y + 10,
                whiteSpace: "pre-line",
                pointerEvents: "none",
              }}
            >
              {tooltip.content}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnergyHeatmap;
