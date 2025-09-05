import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DateContext } from '../contexts/DateContext';
import * as XLSX from 'xlsx';

const PeakDemandView = () => {
  const [peakDemandData, setPeakDemandData] = useState([]);
  const { startDateTime, endDateTime } = useContext(DateContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const response = await axios.get('https://mw.elementsenergies.com/api/apd', {
          params: { startDateTime, endDateTime },
        });

        const peakAlerts = response.data.peakDemandAboveThreshold.map((item) => ({
          type: 'Peak Demand',
          date: item.minute.split(' ')[0],
          time: item.minute.split(' ')[1].substring(0, 5),
          limit: '596 kVA',
          value: `${item.total_kVA} kVA`,
          minute: item.minute,
        }));

        const dgAlerts = [];
        response.data.dgActivations.forEach(event => {
          const { status, timestamp, meter, kWh, startKWh } = event;
          const dgNumber = meter === 13 ? 1 : 2;
          const baseData = {
            type: 'Diesel Generator',
            date: timestamp.split(' ')[0],
            time: timestamp.split(' ')[1].substring(0, 5),
            limit: 'N/A',
          };

          if (status === "DG started") {
            dgAlerts.push({
              ...baseData,
              value: `${kWh.toFixed(2)} kWh`,
              alert: `DG${dgNumber} Started`
            });
          }

          if (status === "DG stopped" && startKWh !== undefined) {
            const unitsRun = (kWh - startKWh).toFixed(2);
            dgAlerts.push({
              ...baseData,
              value: `${kWh.toFixed(2)} kWh (Units: ${unitsRun})`,
              alert: `DG${dgNumber} Ended`
            });
          }
        });

        const combinedData = [...peakAlerts, ...dgAlerts]
        .sort((a, b) => {
          const aKey = `${a.date} ${a.time}`;
          const bKey = `${b.date} ${b.time}`;
          return aKey.localeCompare(bKey); 
        })
        .map((item, index) => ({
          ...item,
          serial: index + 1
        }));
      
        setPeakDemandData(combinedData);
      } catch (err) {
        throw err;
      }
    };

    if (startDateTime && endDateTime) {
      fetchAlertData();
      setCurrentPage(1);
    }
  }, [startDateTime, endDateTime]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.split(' ')[1].substring(0, 5);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
  };

  const handleDownloadExcel = () => {
    if (!peakDemandData || peakDemandData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headerRow = [`Start: ${startDateTime}`, `End: ${endDateTime}`, "", "", ""];
    const columnHeaders = ["S.No.", "Date", "Time", "Alert", "Limit", "Value"];

    const dataRows = peakDemandData.map((item) => [
      item.serial,
      item.minute ? formatDisplayDate(item.minute.split(' ')[0]) : formatDisplayDate(item.date),
      item.minute ? formatTime(item.minute) : item.time,
      item.alert || item.type,
      item.limit,
      item.value,
    ]);

    const dataForExcel = [headerRow, columnHeaders, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerts');
    XLSX.writeFile(workbook, 'Alerts.xlsx');
  };

  const totalPages = Math.ceil(peakDemandData.length / itemsPerPage);
  const currentItems = peakDemandData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Alert Logs</h1>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Download Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">S.No.</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Alert</th>
                <th className="py-2 px-4 text-left">Limit</th>
                <th className="py-2 px-4 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.serial} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{item.serial}</td>
                  <td className="py-2 px-4">
                    {item.minute
                      ? formatDisplayDate(item.minute.split(' ')[0])
                      : formatDisplayDate(item.date)}
                  </td>
                  <td className="py-2 px-4">{item.minute ? formatTime(item.minute) : item.time}</td>
                  <td className="py-2 px-4">{item.alert || item.type}</td>
                  <td className="py-2 px-4">{item.limit}</td>
                  <td className="py-2 px-4">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeakDemandView;