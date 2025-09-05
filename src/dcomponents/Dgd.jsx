import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dg from "../sections/pictures/Diesel tank.png";
import { DateContext } from "../contexts/DateContext";
import moment from "moment-timezone";

const Dgd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startDateTime, endDateTime } = useContext(DateContext);

  const [energyProduced, setEnergyProduced] = useState(null);
  const [consumptionData, setConsumptionData] = useState([]);
  const [vlnValue, setVlnValue] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [runtime, setRuntime] = useState(null);
  const [status, setStatus] = useState("Off");
  const [currentValue, setCurrentValue] = useState(null);
  const [alertsData, setAlertsData] = useState([]);

  const backendDGNo = id === "1" ? 13 : id === "2" ? 14 : null;

  useEffect(() => {
    const fetchDGData = async () => {
      try {
        const response = await fetch(
          `https://mw.elementsenergies.com/api/dgd?startDateTime=${startDateTime}&endDateTime=${endDateTime}&DGNo=${backendDGNo}`
        );
        const data = await response.json();

        if (data?.dgd?.energyProduced !== undefined) {
          setEnergyProduced(data.dgd.energyProduced);
        } else {
          setEnergyProduced(0);
        }

        const meterInfo = data.dgdcv?.[backendDGNo];
        if (meterInfo) {
          setVlnValue(meterInfo.avg_vln_value); 
          setCurrentValue(meterInfo.avg_current_value);
          setTimestamp(meterInfo.timestamp);
        } else {
          setVlnValue(null);
          setTimestamp(null);
        }

        if (meterInfo?.timestamp) {
          const now = moment.tz("Asia/Kolkata");
          const last = moment.tz(meterInfo.timestamp, "Asia/Kolkata");
          const diffSeconds = now.diff(last, "seconds");
        
          setStatus(diffSeconds <= 180 ? "Running" : "Off"); 
        } else {
          setStatus("Off");
        }
        

        if (data?.dgdrt?.[backendDGNo]) {
          setRuntime(data.dgdrt[backendDGNo].runningTimeMinutes);
        } else {
          setRuntime(null);
        }

        const hourlyData = data?.hrly_kwh_diff?.[backendDGNo];
        if (hourlyData) {
          const formatted = Object.entries(hourlyData).map(([ts, kWh]) => ({
            y: kWh,
            originalTimestamp: ts,
          }));
          setConsumptionData(formatted);
        } else {
          setConsumptionData([]);
        }
      } catch (error) {
        console.error("Failed to fetch DG data:", error);
        setEnergyProduced(0);
        setConsumptionData([]);
      }
    };

    const fetchAlertsData = async () => {
      try {
        const response = await fetch(
          `https://mw.elementsenergies.com/api/apd?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
        );
        const data = await response.json();

        if (data?.dgActivations) {
          // Filter alerts for the current DG only
          const filteredAlerts = data.dgActivations.filter(
            (alert) => alert.meter === backendDGNo
          );
          setAlertsData(filteredAlerts);
        } else {
          setAlertsData([]);
        }
      } catch (error) {
        console.error("Failed to fetch alerts data:", error);
        setAlertsData([]);
      }
    };

    if (backendDGNo) {
      fetchDGData();
      fetchAlertsData();
    }
  }, [id, startDateTime, endDateTime, backendDGNo]);

  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: "400px",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: consumptionData.map((d) =>
        moment(d.originalTimestamp, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
      ),
      title: {
        text: "Time",
      },
      labels: {
        style: { fontSize: "10px" },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: "Energy Generated (kWh)",
      },
      gridLineWidth: 0,
    },
    series: [
      {
        name: "Energy Generated",
        data: consumptionData,
      },
    ],
    tooltip: {
      formatter: function () {
        return `
          <b>Timestamp:</b> ${this.point.originalTimestamp}<br/>
          <b>Energy Generated:</b> ${this.point.y} kWh
        `;
      },
      backgroundColor: "#fff",
      borderColor: "#ccc",
      style: { color: "#000" },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white mt-5 rounded-lg shadow-md mx-4">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold border transition ${
              id === "1"
                ? "bg-blue-600 text-white border-green-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            onClick={() => navigate("/monitor/generator/1")}
          >
            DG 1
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border transition ${
              id === "2"
                ? "bg-blue-600 text-white border-green-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            onClick={() => navigate("/monitor/generator/2")}
          >
            DG 2
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 p-6 lg:border-r lg:border-gray-300">
            <div className="relative group w-fit mx-auto mb-4">
              <img
                className="w-50 h-40 object-contain rounded-lg"
                src={dg}
                alt="DG"
              />
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 bg-opacity-90 text-white text-sm py-2 px-4 rounded-lg shadow-lg z-10 pointer-events-none whitespace-nowrap">
                Section Not Available
              </p>
            </div>

            <div className="text-lg text-gray-700 space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    status === "Running" ? "text-green-600" : "text-red-600"
                  }
                >
                  {status}
                </span>
              </p>
              <p>
                <strong>Energy Generation:</strong>{" "}
                {energyProduced !== null ? `${energyProduced} kWh` : "N/A"}
              </p>
              <p>
                <strong>Voltage:</strong>{" "}
                {vlnValue !== null ? `${vlnValue} V` : "N/A"}
              </p>
              <p>
                <strong>Current:</strong>{" "}
                {currentValue !== null ? `${currentValue} A` : "N/A"}
              </p>
              <p>
                <strong>Total Runtime:</strong>{" "}
                {runtime !== null ? `${runtime} minutes` : "N/A"}
              </p>
              <p>
                <strong>Last Updated:</strong> {timestamp || "N/A"}
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-center pb-4 pt-5 mb-4">
              Energy Generation
            </h2>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              className="flex justify-center"
            />
          </div>
        </div>
      </div>

      {/* Alerts History Card */}
      <div className="p-6 bg-white rounded-lg shadow-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">DG {id} Alerts History</h2>
        
        {alertsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border border-gray-300 px-4 py-2 ">Timestamp</th>
                  <th className="border border-gray-300 px-4 py-2 ">Status</th>
                  <th className="border border-gray-300 px-4 py-2 ">kWh Reading</th>
                  <th className="border border-gray-300 px-4 py-2 ">Details</th>
                </tr>
              </thead>
              <tbody>
                {alertsData.map((alert, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {moment(alert.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          alert.status === "DG started"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {alert.kWh} kWh
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {alert.status === "DG stopped" && alert.startTime ? (
                        <div className="text-sm text-gray-600">
                          <div>Started: {moment(alert.startTime).format('DD/MM/YYYY HH:mm:ss')}</div>
                          <div>Start kWh: {alert.startKWh} kWh</div>
                          <div>Units Generated: {(alert.kWh - alert.startKWh).toFixed(1)} kWh</div>
                          <div>Duration: {moment(alert.timestamp).diff(moment(alert.startTime), 'minutes')} min</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">No alerts found</div>
            <div className="text-sm">No DG activation/deactivation events in the selected time range</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dgd;