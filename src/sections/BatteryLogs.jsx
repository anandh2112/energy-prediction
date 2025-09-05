import React, { useState } from 'react';

const BatteryLogs = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Battery Logs</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">TimeStamp</th>
            <th className="px-4 py-2">Event</th>
            <th className="px-4 py-2">Current (A)</th>
            <th className="px-4 py-2">Voltage (V)</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{log.id}</td>
              <td className="border px-4 py-2">{log.timestamp}</td>
              <td className="border px-4 py-2">{log.event}</td>
              <td className="border px-4 py-2">{log.current}</td>
              <td className="border px-4 py-2">{log.voltage}</td>
              <td className="border px-4 py-2">{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(logs.length / logsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BatteryLogs;
