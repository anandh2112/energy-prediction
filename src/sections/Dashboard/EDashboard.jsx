import React, { useEffect, useRef, useState, useContext } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Batteries from '../../dcomponents/Batteries';
import EVChargerOverview from '../evchargers';
import WheeledInSolar from "../../dcomponents/WheeledInSolar";
import * as THREE from "three";
import axios from 'axios';
import { DateContext } from "../../contexts/DateContext";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import dg from "../../sections/pictures/DieselUpd.png";

if (Exporting && typeof Exporting === 'function') {
  Exporting(Highcharts);
}

if (ExportData && typeof ExportData === 'function') {
  ExportData(Highcharts);
}

const getCurrentRate = (hours) => {
  if (hours >= 5 && hours < 10) return { period: "Off-Peak Tariff (05:00 - 10:00)", rate: "₹6.035 per kVAh" };
  if (hours >= 10 && hours < 19) return { period: "Normal Tariff (10:00 - 19:00)", rate: "₹7.10 per kVAh" };
  if ((hours >= 19 && hours <= 23) || (hours >= 0 && hours < 3)) return { period: "Peak Tariff (19:00 - 03:00)", rate: "₹8.165 per kVAh" };
  return { period: "Normal Tariff (03:00 - 05:00)", rate: "₹7.10 per kVAh" };
};

const Edmc = ({data, period, rate}) => {
  const consumptionKWh = data?.consumptionkWh;
  const emissions = consumptionKWh ? (consumptionKWh * 0.82).toFixed(1) : "0";
  const distance = consumptionKWh ? (parseFloat(emissions) * 0.356).toFixed(1) : "0";
  
  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-full">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Facility Information</h4>
        <p className="text-md font-bold text-gray-900">Metalware Corporation</p>
        <p className="text-md text-gray-900">
          BUA: <span className="font-bold">50,000 sq.ft.</span>
        </p>
        <p className="text-md text-gray-900">
          Location: <span className="font-bold">Noida, India</span>
        </p>
      </div>
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Consumption</h4>
          <p className="text-md font-bold text-gray-900">
            {`${data.consumptionkVAh || 0} kVAh / ${data.consumptionkWh || 0} kWh`}
          </p>
        <h4 className="text-md text-gray-900">Peak Demand</h4>
        <p className="text-md font-bold text-gray-900">{data.peakDemand || 0} kVA</p>
      </div>
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Cost of Electricity</h4>
            <p className="text-md font-bold text-gray-900">₹ {data.totalCost || 0}</p>
            <p className="text-md text-gray-900">{period}</p>
            <p className="text-md font-bold text-gray-900">{rate}</p>
      </div>
  
      <div className="flex flex-col items-center text-center h-full space-y-1">
        <h4 className="text-md text-gray-900">Carbon Footprint</h4>
        <p className="text-md font-bold text-gray-900">
          {emissions || 0} kg CO₂
        </p>
        <p className="text-md text-gray-900">
          Equivalent to driving 
        </p>
        <p className="font-bold">
            {distance} km
          </p>
      </div>
  
    </div>
  </div>
  
  );
};

const DieselGeneration = ({ data }) => {
  const navigate = useNavigate();
  const { startDateTime, endDateTime } = useContext(DateContext);
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kolkata"));

  // Use the provided data
  const dgData = data?.dgdcData || [];

  const getStatus = (backendTimestamp) => {
    if (!backendTimestamp) return 'N/A';

    const parsedBackendTime = moment.tz(backendTimestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");
    const diffSeconds = Math.abs(currentTime.diff(parsedBackendTime, 'seconds'));

    return diffSeconds <= 3 ? 'Running' : 'Off';
  };

  const getStatusColor = (status) => (status === 'Running' ? 'text-green-600' : 'text-red-600');

  const dg1 = dgData[13] || { total_kW: null, timestamp: null };
  const dg2 = dgData[14] || { total_kW: null, timestamp: null };

  return (
    <div className="relative bg-white dark:bg-secondary-dark-bg rounded-xl shadow-md p-8">
      <h2 className="text-lg font-bold pb-6">Diesel Generators</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DG1 */}
        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
          <img className="w-50 h-40 object-contain rounded-lg mb-4" src={dg} alt="DG1" />
          <h2 className="font-bold text-2xl text-gray-800 mb-2">DG1</h2>
          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Status:</strong>{" "}
              <span className={getStatusColor(getStatus(dg1.timestamp))}>
                {getStatus(dg1.timestamp)}
              </span>
            </p>
            <p>
              <strong>Power Output:</strong>{" "}
              {dg1.total_kW != null ? `${dg1.total_kW} kW` : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {dg1.timestamp
                ? moment
                    .tz(dg1.timestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
                    .format("YYYY-MM-DD HH:mm:ss")
                : "N/A"}
            </p>
          </div>
          <button
            onClick={() => navigate("/monitor/generator/1")}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            View Details
          </button>
        </div>

        {/* DG2 */}
        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
          <img className="w-50 h-40 object-contain rounded-lg mb-4" src={dg} alt="DG2" />
          <h2 className="font-bold text-2xl text-gray-800 mb-2">DG2</h2>
          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Status:</strong>{" "}
              <span className={getStatusColor(getStatus(dg2.timestamp))}>
                {getStatus(dg2.timestamp)}
              </span>
            </p>
            <p>
              <strong>Power Output:</strong>{" "}
              {dg2.total_kW != null ? `${dg2.total_kW} kW` : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {dg2.timestamp
                ? moment
                    .tz(dg2.timestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
                    .format("YYYY-MM-DD HH:mm:ss")
                : "N/A"}
            </p>
          </div>
          <button
            onClick={() => navigate("/monitor/generator/2")}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};


const EnergyHeatmap = ({ data }) => {
  const [startDate, setStartDate] = useState(() =>
  moment.tz("Asia/Kolkata").subtract(30, "days").format("YYYY-MM-DD")
);
const [endDate, setEndDate] = useState(() =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD")
);
const [viewStartDate, setViewStartDate] = useState(startDate);
const [viewEndDate, setViewEndDate] = useState(endDate);
const [consumptionData, setConsumptionData] = useState(data || []);
const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });
const [warning, setWarning] = useState("");

const svgRef = useRef();

useEffect(() => {
  if (Array.isArray(data) && data.length > 0) {
    setConsumptionData(data);
  }
}, [data]);


  

  const fetchConsumptionData = async (start, end) => {
    try {
      const res = await axios.get("https://mw.elementsenergies.com/api/ehconsumption", {
        params: { startDate: start, endDate: end },
      });
      setConsumptionData(res.data.consumptionData || []);
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


const zoneDetails = {
  1: { name: "PLATING", category: "C-49" },
  2: { name: "DIE CASTING+CB+CNC", category: "C-50" },
  3: { name: "SCOTCH BUFFING", category: "C-50" },
  4: { name: "BUFFING", category: "C-49" },
  5: { name: "SPRAY+EPL-I", category: "C-50" },
  6: { name: "SPRAY+ EPL-II", category: "C-49" },
  7: { name: "RUMBLE", category: "C-50" },
  8: { name: "AIR COMPRESSOR", category: "C-49" },
  9: { name: "TERRACE", category: "C-49" },
  10: { name: "TOOL ROOM", category: "C-50" },
  11: { name: "ADMIN BLOCK", category: "C-50" },
  12: { name: "TRANSFORMER"}
};

const getZoneNameAndCategory = (id) => {
if (id === 0) return { name: "TOTAL CONSUMPTION", category: null };
return zoneDetails[id] || { name: "Unknown Zone", category: "N/A" };
};

const HConsumption = ({data}) => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const options = ['kVAh', 'kWh', '₹'];
  const [warning, setWarning] = useState('');
  const [energyData, setEnergyData] = useState(data?.hourlyConsumption || {});
  const [consumptionType, setConsumptionType] = useState('kVAh');

  useEffect(() => {
    if (consumptionType === 'kVAh' && data?.hourlyConsumption) {
      setEnergyData(data.hourlyConsumption);
    }
  }, [data?.hourlyConsumption, consumptionType]);
  

  useEffect(() => {
    const start = moment(startDateTime);
    const end = moment(endDateTime);
    const durationHours = end.diff(start, 'hours');

    if (durationHours > 24) {
      setWarning('Only a maximum of 24 hourly values can be displayed.');
      setEnergyData({});
      return;
    } else {
      setWarning('');
    }

    const fetchData = async () => {
      try {
        let endpoint;
        if (consumptionType === 'kWh') {
          endpoint = 'hconsumption';
        } else if (consumptionType === '₹') {
          endpoint = 'hcostconsumption';
        }

        if (!endpoint) return;

        const response = await axios.get(`https://mw.elementsenergies.com/api/${endpoint}`, {
          params: {
            startDateTime,
            endDateTime,
          },
        });

        setEnergyData(response.data.consumptionData);
      } catch (error) {
        console.error("Error fetching hourly data:", error);
      }
    };

    if (consumptionType !== 'kVAh') {
      fetchData();
    }
  }, [startDateTime, endDateTime, consumptionType, data]);

  const downloadExcel = () => {
    const headerRow = [`Start: ${startDateTime}`, `End: ${endDateTime}`, ""]; 
  
    const columnHeaders = ["Date", "Time", `Value (${consumptionType})`];
    const formattedData = Object.entries(energyData).map(([timestamp, value]) => [
      moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), 
      moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'), 
      parseFloat(value), 
    ]);
  
    const dataForExcel = [
      headerRow, 
      columnHeaders, 
      ...formattedData, 
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hourly Consumption");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `Hourly_Consumption_${startDateTime}_to_${endDateTime}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };


const chartOptions = {
  chart: {
    type: "column",
    backgroundColor: "transparent",
  },
  title: { text: null },
  xAxis: {
    categories: Object.keys(energyData).map(ts => moment(ts, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')),
    labels: {
      formatter: function () {
        return this.value; 
      }
    }
  },
  yAxis: {
    min: 0,
    title: { text: null },
    gridLineWidth: 0,
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: false,
      },
    },
  },
  series: [
    {
      name: consumptionType === '₹' ? "Cost" : "Energy Consumption",
      data: Object.entries(energyData).map(([timestamp, value]) => {
        const hour = moment(timestamp, 'YYYY-MM-DD HH:mm:ss').hour();
        let color;
      
        if (hour >= 5 && hour < 10) {
          color = "rgba(76, 175, 80, 0.7)";
        } else if ((hour >= 10 && hour < 19) || (hour >= 3 && hour < 5)) {
          color = "rgba(255, 152, 0, 0.7)";
        } else {
          color = "rgba(244, 67, 54, 0.7)";
        }
      
        return {
          y: parseFloat(value),
          color,
        };
      }),
      
    },
  ],
  tooltip: {
    shared: true,
    valueSuffix: ` ${consumptionType}`,
    style: { zIndex: 1 },
  },
  legend: { enabled: false },
  credits: { enabled: false },
  exporting: {
    enabled:false ,
  },
};

  return (
    <div className="w-full flex flex-col p-6 bg-white shadow-lg rounded-lg">
    <div className="flex justify-between items-center pb-6">
      <h2 className="text-xl font-semibold">Hourly Energy Consumption</h2>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center bg-gray-50 rounded-full w-56 h-12 shadow-md border border-gray-200">
          {options.map((option, index) => (
            <React.Fragment key={option}>
              <button
                className={`flex-1 h-full flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300 ${
                  consumptionType === option
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setConsumptionType(option)}
              >
                {option}
              </button>
              {index < options.length - 1 && (
                <div className="w-px h-8 bg-gray-200 mx-1"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>
    </div>

    {warning ? (
      <div className="flex items-center justify-center h-64">
        <div className="text-yellow-600 bg-yellow-100 px-6 py-4 rounded-md border border-yellow-300 text-center text-base font-medium">
          {warning}
        </div>
      </div>
    ) : (
      <>
        <div className="w-full h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[rgba(244,67,54,0.7)] rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Peak</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[rgba(255,152,0,0.7)] rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[rgba(76,175,80,0.7)] rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Off-Peak</span>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
};

const EnergyMeter = ({ name, consumption, id }) => {
  const navigate = useNavigate();
  const zoneInfo = getZoneNameAndCategory(id);

  return (
    <div className="bg-white rounded-lg w-full h-50 flex flex-col justify-between items-center text-center p-4 border border-gray-500">
      <div className={`text-white text-xs font-medium w-40 rounded whitespace-nowrap max-w-[150px] ${
    zoneInfo.category ? 'py-1 bg-green-500' : 'bg-orange-500 py-3'
  }`}>
        <div className="font-bold">{zoneInfo.name}</div>
        {zoneInfo.category && (
    <div className="text-white">Block: {zoneInfo.category}</div>
  )}      </div>

      <div className="pt-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-800 whitespace-nowrap">{consumption} kVAh</div>
        <div className="text-xs text-gray-400">Consumption</div>
      </div>

      <button
    onClick={() =>
      id === 0
        ? navigate(`/monitor/zones`)
        : navigate(`/monitor/zones?zone=${id}`)
    }
    className="mt-2 text-blue-600 font-semibold text-xs hover:text-blue-800"
  >
    View Details
  </button>
    </div>
  );
};

const MeterInfo = ({ data }) => {
  const meters = data?.meterWiseConsumption || [];

  const energyMeters = Array.from({ length: 12 }, (_, i) => {
    const meterId = i + 1;
    const matched = meters.find((m) => m.energy_meter_id === meterId);
    return {
      id: meterId,
      name: `Zone ${meterId}`,
      consumption: matched ? parseFloat(matched.consumption) : 0,
    };
  });

  const totalConsumption = data?.consumptionkVAh || 0;

  const regularMeters = energyMeters.filter((meter) => meter.id !== 12);
  const transformerMeter = energyMeters.find((meter) => meter.id === 12);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col">
      <h2 className="text-xl font-semibold pb-7">Energy Meters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-6 mx-auto">
        {regularMeters.map((meter) => (
          <EnergyMeter
            key={meter.id}
            name={meter.name}
            consumption={meter.consumption}
            id={meter.id}
          />
        ))}

        <EnergyMeter
          key="total"
          name="Total Consumption"
          consumption={totalConsumption}
          id={0}
        />

        {transformerMeter && (
          <EnergyMeter
            key="transformer"
            name="Transformer"
            consumption={transformerMeter.consumption}
            id={12}
          />
        )}
      </div>
    </div>
  );
};


const PeakDemand = ({ data }) => {
  const { startDateTime, endDateTime } = useContext(DateContext); 
  const [warning, setWarning] = useState('');

  const peakDemandData = data?.peakDemandTimeline || [];

  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = moment(startDateTime);
      const end = moment(endDateTime);
      const durationHours = end.diff(start, 'hours');

      if (durationHours > 25) {
        setWarning("Only a maximum of 96 data points can be displayed.");
      } else {
        setWarning('');
      }
    }
  }, [startDateTime, endDateTime]);

  const downloadExcel = () => {
    if (!peakDemandData || peakDemandData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headerRow = [`Start: ${startDateTime}`, `End: ${endDateTime}`, ""];
    const columnHeaders = ["Date", "Time", "Peak Demand (kVA)"];

    const formattedData = peakDemandData.map((item) => [
      moment(item.minute).format("YYYY-MM-DD"),
      moment(item.minute).format("HH:mm"),
      parseFloat(item.total_kVA),
    ]);

    const dataForExcel = [headerRow, columnHeaders, ...formattedData];

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Peak Demand Data");

    XLSX.writeFile(workbook, `Peak_Demand_${startDateTime}_to_${endDateTime}.xlsx`);
  };

  const options = {
    chart: { type: "line", backgroundColor: "white" },
    title: null,
    xAxis: {
      categories: peakDemandData.map((d) => moment(d.minute).format("HH:mm")),
      title: { text: "Hour", style: { fontWeight: "bold" } },
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 800,
      title: { text: "Peak Demand (kVA)", style: { fontWeight: "bold" } },
      gridLineWidth: 0,
      plotLines: [
        {
          value: 745,
          color: "red",
          dashStyle: "Dash",
          width: 2,
          label: {
            text: "Upper Ceiling (745 kVA)",
            align: "right",
            x: -30,
            style: { color: "red", fontWeight: "bold" },
          },
        },
        {
          value: 596,
          color: "red",
          dashStyle: "Dash",
          width: 2,
          label: {
            text: "Lower Ceiling (596 kVA)",
            align: "right",
            x: -10,
            style: { color: "red", fontWeight: "bold" },
          },
        },
      ],
    },
    tooltip: {
      shared: true,
      backgroundColor: "white",
      style: { color: "#000" },
      borderRadius: 10,
      formatter: function () {
        const point = this.points[0];
        const time = moment(point.point.time).format("HH:mm");
        return `<b>Time:</b> ${time}<br/><b>Value:</b> ${point.y} kVA`;
      },
    },
    series: [
      {
        name: "Apparent Power",
        data: peakDemandData.map((d) => ({
          y: parseFloat(d.total_kVA),
          time: d.minute,
        })),
        color: "#1f77b4",
      },
    ],
    legend: { align: "center", verticalAlign: "bottom", layout: "horizontal" },
    credits: { enabled: false },
    exporting: { enabled: false },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full h-full">
      <div className="flex justify-between items-center pb-6">
        <h2 className="text-xl font-semibold">Grid Peak Demand</h2>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>
      {warning ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-yellow-600 bg-yellow-100 px-6 py-4 rounded-md border border-yellow-300 text-center text-base font-medium">
            {warning}
          </div>
        </div>
      ) : (
        <div className="w-full h-[400px] -translate-x-4">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </div>
  );
};


const meterNames = [
  { id: 1, name: "PLATING", category: "C-49" },
  { id: 2, name: "DIE CASTING + CHINA BUFFING + CNC", category: "C-50" },
  { id: 3, name: "SCOTCH BUFFING", category: "C-50" },
  { id: 4, name: "BUFFING", category: "C-49" },
  { id: 5, name: "SPRAY+EPL-I", category: "C-49" },
  { id: 6, name: "SPRAY+ EPL-II", category: "C-50" },
  { id: 7, name: "RUMBLE", category: "C-50" },
  { id: 8, name: "AIR COMPRESSOR", category: "C-49" },
  { id: 9, name: "TERRACE", category: "C-49" },
  { id: 10, name: "TOOL ROOM", category: "C-50" },
  { id: 11, name: "ADMIN BLOCK", category: "C-50" },
];

const getMeterName = (id) => {
  const meter = meterNames.find((meter) => meter.id === id);
  return meter ? meter.name : "N/A";
};

const EnergySources = ({data}) => {
  const [highZone, setHighZone] = useState(0);
  const [lowZone, setLowZone] = useState(0);
  const [otherZones, setOtherZones] = useState(0);

  useEffect(() => {
    if (!data || !data.hlCons || !data.hlCons.data) return;
  
    const { highZone, lowZone, otherZoneConsumption } = data.hlCons.data;
    setHighZone(highZone);
    setLowZone(lowZone);
    setOtherZones(otherZoneConsumption);
  
  }, [data]);

  const totalConsumption = 
  highZone.consumption +
  lowZone.consumption +
  otherZones;  
  
  


 

  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: "300px",
    },
    title: { text: "" },
    xAxis: { categories: ["Total Consumption"] },
    yAxis: { title: { text: "Consumption (kVAh)" } },
    plotOptions: {
      series: {
        stacking: "normal",
        borderWidth: 0,
        dataLabels: { enabled: false },
      },
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.series.name}:</b> ${this.y} kVAh`;
      },
    },
    series: [
      {
        name: `High Zone (${getMeterName(highZone.meter_id)})`,
        data: [highZone.consumption],
        color: "rgb(185, 28, 28)",
      },
      {
        name: "Other Zones",
        data: [otherZones],
        color: "rgba(96, 165, 250, 0.2)",
        showInLegend: true,
      },
      {
        name: `Low Zone (${getMeterName(lowZone.meter_id)})`,
        data: [lowZone.consumption],
        color: "rgb(21, 128, 61)",
      },
    ],
    legend: { enabled: true },
    credits: { enabled: false },
    exporting: {
      enabled: false,
    },
  };
  

  return (
    <div className="bg-white xl:h-[100%] p-7 rounded-lg shadow-md flex flex-col space-y-7">
        <h2 className="text-xl font-semibold">Facility Overview</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="xl:space-y-5 lg:space-y-4 md:space-y-4">
              <div className="border border-red-500 p-3 rounded-lg shadow">
                <h3 className="md:text-sm l:text-md xl:text-md font-semibold text-red-700">High Zone</h3>
                <p className="md:text-xs l:text-xs xl:text-sm text-gray-900 text-sm mt-2">Zone: {getMeterName(highZone.meter_id)}</p>
                <p className="md:text-xs l:text-xs xl:text-sm text-gray-900 text-sm mt-1">{highZone.consumption} kVAh</p>
                <p className="md:text-xs l:text-xs xl:text-sm text-sm text-gray-600 mt-1">{((highZone.consumption / totalConsumption) * 100).toFixed(1)}% of Total Consumption</p>
              </div>
              <div className="border border-green-500 p-3 rounded-lg shadow">
                <h3 className="md:text-sm l:text-md xl:text-md font-semibold text-green-700">Low Zone</h3>
                <p className="md:text-xs l:text-xs xl:text-sm text-gray-900 text-sm mt-2">Zone: {getMeterName(lowZone.meter_id)}</p>
                <p className="md:text-xs l:text-xs xl:text-sm text-gray-900 text-sm mt-1">{lowZone.consumption} kVAh</p>
                <p className="md:text-xs l:text-xs xl:text-sm text-sm text-gray-600 mt-1">{((lowZone.consumption / totalConsumption) * 100).toFixed(1)}% of Total Consumption</p>
              </div>
              <div className="border border-blue-500 p-3 rounded-lg shadow">
                <h3 className="md:text-sm l:text-md xl:text-md font-semibold text-blue-700">Other Zones</h3>
                <p className="md:text-xs l:text-xs xl:text-sm text-gray-900 text-sm mt-1">{otherZones} kVAh</p>
                <p className="md:text-xs l:text-xs xl:text-sm text-sm text-gray-600 mt-1">{((parseFloat(otherZones) / totalConsumption) * 100).toFixed(1)}% of Total Consumption</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-6 pt-8">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </div>
        </div>
    </div>
  );
};

const categoryColors = {
  "C-49": "#008B8B",
  "C-50": "#FFA500",
};

const highlightColors = {
  "C-49": "#99FF99",
  "C-50": "#FFFF99",
};

const ZoneUsage = ({data}) => {
  const meterToZoneMap = {
    1: { name: "PLATING", category: "C-49" },
    2: { name: "DIE CASTING + CHINA BUFFING + CNC", category: "C-50" },
    3: { name: "SCOTCH BUFFING", category: "C-50" },
    4: { name: "BUFFING", category: "C-49" },
    5: { name: "SPRAY+EPL-I", category: "C-50" },
    6: { name: "SPRAY+ EPL-II", category: "C-49" },
    7: { name: "RUMBLE", category: "C-50" },
    8: { name: "AIR COMPRESSOR", category: "C-49" },
    9: { name: "TERRACE", category: "C-49" },
    10: { name: "TOOL ROOM", category: "C-50" },
    11: { name: "ADMIN BLOCK", category: "C-50" },
  };
  const { startDateTime, endDateTime } = useContext(DateContext);
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [zoneData, setZoneData] = useState(()=> Object.entries(meterToZoneMap).map(([id,info]) => ({
    id: Number(id),
    name: info.name,
    category: info.category,
    consumption: 0
  })));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data || !data.meterWiseConsumption) return;
  
    const updatedZones = zoneData.map((zone) => {
      const matchingEntry = data.meterWiseConsumption.find(
        (entry) => entry.energy_meter_id === zone.id
      );
      return {
        ...zone,
        consumption: matchingEntry ? parseFloat(matchingEntry.consumption) : 0,
      };
    });
  
    setZoneData(updatedZones);
  }, [data]);
  

  useEffect(() => {
    if (error || !mountRef.current || zoneData.length === 0) return;
  
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(30, width / height, 2.5, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableZoom = false;
  
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentIntersected = null;
  
    const cubes = [];
  
    const c49Zones = zoneData.filter((z) => z.category === "C-49");
    const c50Zones = zoneData.filter((z) => z.category === "C-50");
  
    let c49Index = 0;
    let c50Index = 0;
  
    zoneData.forEach((zone) => {
      const height = zone.category === "C-50" ? 0.7 : 1;
      const width = 2;
      const depth = 2.4;
  
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshBasicMaterial({
        color: categoryColors[zone.category],
      });
  
      const cube = new THREE.Mesh(geometry, material);
      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: highlightColors[zone.category],
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  
      let xPos, yPos;
      if (zone.category === "C-49") {
        xPos = -3;
        yPos = (c49Index - (c49Zones.length - 1) / 2) * height;
        c49Index++;
      } else {
        xPos = 3;
        yPos = (c50Index - (c50Zones.length - 1) / 2) * height;
        c50Index++;
      }
  
      cube.position.set(xPos, yPos, 0);
      edges.position.copy(cube.position);
      edges.scale.set(1.01, 1.01, 1.01);
  
      cube.userData = { ...zone, originalColor: categoryColors[zone.category] };
  
      scene.add(cube);
      scene.add(edges);
      cubes.push(cube);
    });
  
    camera.position.set(8, 0, 9);
    camera.lookAt(0, 0, 0);
  
    const checkIntersection = (x, y) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);
    
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected !== currentIntersected) {
          if (currentIntersected) {
            currentIntersected.material.color.set(currentIntersected.userData.originalColor);
          }
    
          currentIntersected = intersected;
          intersected.material.color.set(highlightColors[intersected.userData.category]);
          setHoveredZone(intersected.userData);
    
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = `${x + 10}px`;
          tooltipRef.current.style.top = `${y + 10}px`;
          tooltipRef.current.innerHTML = `
          <div><strong>${intersected.userData.name}</strong></div>
          <div>Block: ${intersected.userData.category}</div>
          <div>Consumption: ${intersected.userData.consumption} kVAh</div>
        `;
            
          mount.style.cursor = "pointer";
        }
        return true;
      } else {
        if (currentIntersected) {
          currentIntersected.material.color.set(currentIntersected.userData.originalColor);
          currentIntersected = null;
        }
        setHoveredZone(null);
        tooltipRef.current.style.display = "none";
        mount.style.cursor = "default";
        return false;
      }
    };
  
    const handleMouseMove = (event) => {
      checkIntersection(event.clientX, event.clientY);
    };
  
    const handleMouseOver = (event) => {
      if (!checkIntersection(event.clientX, event.clientY)) {
        tooltipRef.current.style.display = "none";
      }
    };

    const handleScroll = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = "none";
      }
      if (currentIntersected) {
        currentIntersected.material.color.set(currentIntersected.userData.originalColor);
        currentIntersected = null; 
      }
    };
    window.addEventListener("scroll", handleScroll);
    
  
    mount.addEventListener("mousemove", handleMouseMove);
    mount.addEventListener("mouseover", handleMouseOver);
  
    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
  
    window.addEventListener("resize", handleResize);
  
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
  
    animate();
  
    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("mousemove", handleMouseMove);
      mount.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [zoneData, error]);
  

  return (
    <>
      <div className="relative bg-white p-7 rounded-lg shadow-md w-full flex flex-col space-y-8">
        <h2 className="text-xl font-semibold">Energy - Zone wise</h2>

       
<div ref={mountRef} className="w-full min-h-[300px] aspect-[16/9] overflow-hidden relative transform -translate-x-6" />        

        <div className="flex space-x-12 pb-2 justify-center items-start">
          <div className="bg-[#008B8B] text-white px-4 py-3 rounded-lg shadow-lg border-2 border-[#99FF99] text-lg font-bold">
            C-49
          </div>
          <div className="bg-[#FFA500] text-white px-4 py-3 rounded-lg shadow-lg border-2 border-[#FFFF99] text-lg font-bold">
            C-50
          </div>
        </div>
      </div>

      <div
        ref={tooltipRef}
        className="fixed bg-white p-2 border border-black rounded shadow-lg text-sm hidden pointer-events-none z-50"
        style={{ transform: "translate(10px, 10px)" }}
      />
    </>
  );
};

const EDashboard = () => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const { period, rate } = getCurrentRate(new Date().getHours());
  const [dashboardData1, setDashboardData1] = useState(0);
  const [dashboardData2, setDashboardData2] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [ehconsumption, setEhConsumption] = useState([]);
  const [startDate, setStartDate] = useState(() =>
  moment.tz("Asia/Kolkata").subtract(30, "days").format("YYYY-MM-DD")
);
const [endDate, setEndDate] = useState(() =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD")
);

  useEffect(() => {
    const fetchSequentially = async () => {
      try {
        const res1 = await axios.get('https://mw.elementsenergies.com/api/dashboardpt1', {
          params: { startDateTime, endDateTime }
        });
        setDashboardData1(res1.data);
  
        const res2 = await axios.get('https://mw.elementsenergies.com/api/dashboardpt2', {
          params: { startDateTime, endDateTime }
        });
        setDashboardData2(res2.data);

        const res3 = await axios.get('https://mw.elementsenergies.com/api/ehconsumption', {
          params: { startDate, endDate }
        });
        setEhConsumption(res3.data.consumptionData);
  
      } catch (error) {
        console.error("Error in sequential dashboard fetch:", error);
      }
    };
  
    fetchSequentially();
  }, [startDateTime, endDateTime]);
  
  

  
  
  
  return (
    <div className="flex flex-col bg-gray-100 p-3 gap-4">
      <div className="flex flex-col bg-gray-100 gap-4">
        <div className="mt-2">
          <Edmc data={dashboardData1} period={period} rate={rate} />
        </div>
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 relative">
          <ZoneUsage data={dashboardData1} />
          <EnergySources data={dashboardData1} />
        </div>
      </div>
      <HConsumption data={dashboardData1} />
      <MeterInfo data={dashboardData1} />
      <PeakDemand data={dashboardData2} />
      <EnergyHeatmap data={ehconsumption} />
      <DieselGeneration data={dashboardData2} />
      <WheeledInSolar />
      <Batteries />
      <EVChargerOverview />
    </div>
  );
};

export default EDashboard;