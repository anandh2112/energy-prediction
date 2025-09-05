import React, { useContext, useEffect, useState } from "react";
import { DateContext } from "../contexts/DateContext";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";

const meterToZoneMap = {
  1: { name: "PLATING", category: "C-49" },
  2: { name: "DC+CB+CNC", category: "C-50" },
  3: { name: "SCOTCH BUFFING", category: "C-50" },
  4: { name: "BUFFING", category: "C-49" },
  5: { name: "SPRAY+EPL-I", category: "C-50" },
  6: { name: "SPRAY+ EPL-II", category: "C-49" },
  7: { name: "RUMBLE", category: "C-50" },
  8: { name: "AIR COMPRESSOR", category: "C-49" },
  9: { name: "TERRACE", category: "C-49" },
  10: { name: "TOOL ROOM", category: "C-50" },
  11: { name: "ADMIN BLOCK", category: "C-50" },
  12: { name: "TRANSFORMER" },
};

const MonDailReading = () => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchShiftData = async () => {
      if (!startDateTime || !endDateTime) return;

      const start = moment(startDateTime).startOf("day");
      const end = moment(endDateTime).endOf("day");
      const tempData = [];

      for (let m = moment(start); m.isSameOrBefore(end); m.add(1, "days")) {
        const shift1Start = m.clone().hour(8).minute(0);
        const shift1End = m.clone().hour(20).minute(0);
        const shift2Start = m.clone().hour(20).minute(0);
        const shift2End = m.clone().add(1, "days").hour(8).minute(0);

        const [s1, s2] = await Promise.all([
          axios.get("http://localhost:3001/api/meterreading", {
            params: {
              startDateTime: shift1Start.toISOString(),
              endDateTime: shift1End.toISOString(),
            },
          }),
          axios.get("http://localhost:3001/api/meterreading", {
            params: {
              startDateTime: shift2Start.toISOString(),
              endDateTime: shift2End.toISOString(),
            },
          }),
        ]);

        tempData.push({
          date: m.format("YYYY-MM-DD"),
          shift1: s1.data.data,
          shift2: s2.data.data,
        });
      }

      setData(tempData);
    };

    fetchShiftData();
  }, [startDateTime, endDateTime]);

  const downloadExcel = () => {
    const rows = [["Date", "Zone", "Shift", "Start Timestamp", "End Timestamp", "Start kVAh", "End kVAh", "Start kWh", "End kWh"]];

    data.forEach((entry) => {
      ["shift1", "shift2"].forEach((shiftKey, shiftIndex) => {
        const shiftLabel = shiftIndex === 0 ? "Shift 1 (8AM–8PM)" : "Shift 2 (8PM–8AM)";
        entry[shiftKey].forEach((zoneData) => {
          const zoneName = meterToZoneMap[zoneData.zone]?.name || "Unknown";
          const category = meterToZoneMap[zoneData.zone]?.category;
          const fullZone = category ? `${zoneName} (${category})` : zoneName;

          rows.push([
            entry.date,
            fullZone,
            shiftLabel,
            zoneData.min?.timestamp || "N/A",
            zoneData.max?.timestamp || "N/A",
            zoneData.min?.kVAh ?? "N/A",
            zoneData.max?.kVAh ?? "N/A",
            zoneData.min?.kWh ?? "N/A",
            zoneData.max?.kWh ?? "N/A",
          ]);
        });
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly_Daily_Readings");

    const fileName = `MonthlyDailyReadings_${moment(startDateTime).format("YYYYMMDD")}_to_${moment(endDateTime).format("YYYYMMDD")}.xlsx`;
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Daily Reading (Shift-wise)</h2>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>

      {data.map((entry, idx) => (
        <div key={idx} className="mb-8 border border-gray-300 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{entry.date}</h3>

          {["shift1", "shift2"].map((shiftKey, shiftIndex) => (
            <div key={shiftKey}>
              <h4 className="text-md font-medium text-gray-700 mb-1">
                {shiftIndex === 0 ? "Shift 1 (8AM–8PM)" : "Shift 2 (8PM–8AM)"}
              </h4>
              <table className="min-w-full border-collapse border border-gray-300 text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-center w-[180px]">Zone</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">Start Timestamp</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">End Timestamp</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">Start kVAh</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">End kVAh</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">Start kWh</th>
                    <th className="border border-gray-300 px-2 py-2 text-center">End kWh</th>
                  </tr>
                </thead>
                <tbody>
                  {entry[shiftKey].map((zoneData, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="font-medium">{meterToZoneMap[zoneData.zone]?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{meterToZoneMap[zoneData.zone]?.category}</div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.min?.timestamp || "N/A"}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.max?.timestamp || "N/A"}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.min?.kVAh ?? "N/A"}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.max?.kVAh ?? "N/A"}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.min?.kWh ?? "N/A"}</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">{zoneData.max?.kWh ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MonDailReading;
