import React from "react";
import { Link } from "react-router-dom";
import ioe from "../sections/IOE2.png";
import lithium from "../sections/Li.png";
import ups from "../sections/UPS3.png";

const Batteries = () => {
  return (
    <div className="relative bg-white dark:bg-secondary-dark-bg rounded-xl shadow-md p-8 group opacity-50">
      {/* Hover Tooltip for Entire Section */}
      <div className="absolute inset-0 flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity z-10">
        <p className="text-sm bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg">
          Section Not Available
        </p>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center pb-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Battery Storage
        </h3>
      </div>

      {/* Battery Row */}
      <div className="flex flex-wrap justify-between gap-6">
        {/* Battery Card */}
        {[
          {
            name: "IOE Battery",
            image: ioe,
            charge: "0 kWh",
            discharge: "0 kWh",
            temperature: "33°C",
            voltage: "695",
            status: "Idle",
            statusColor: "bg-yellow-400",
            cycleWarning: "N/A",
            cycleWarningColor: "text-gray-400",
          },
          {
            name: "LTO Battery",
            image: lithium,
            charge: "0 kWh",
            discharge: "0 kWh",
            temperature: "31.5°C",
            voltage: "400",
            status: "Operational",
            statusColor: "bg-green-400",
            cycleWarning: "N/A",
            cycleWarningColor: "text-gray-400",
          },
          {
            name: "UPS Battery",
            image: ups,
            charge: "0 kWh",
            discharge: "0 kWh",
            temperature: "28°C",
            voltage: "382",
            status: "Not Operational",
            statusColor: "bg-gray-400",
            cycleWarning: "N/A",
            cycleWarningColor: "text-gray-400",
          },
        ].map((battery) => (
          <div
            key={battery.name}
            className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 flex-grow"
          >
            {/* Top Section */}
            <div className="flex items-start">
              {/* Battery Image and Status */}
              <div className="flex-none text-center pr-6">
                <img
                  src={battery.image}
                  alt={battery.name}
                  className="w-28 h-32 object-contain mb-3"
                />
                {/* Status below the image */}
                <span className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  <span
                    className={`${battery.statusColor} w-3 h-3 rounded-full mr-2`}
                  ></span>
                  {battery.status}
                </span>
              </div>

              {/* Battery Details and Control Button */}
              <div className="flex flex-col flex-grow pl-6 space-y-3">
                <h5 className="text-center font-bold text-lg text-gray-800 dark:text-gray-200">
                  {battery.name}
                </h5>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    <span className="font-semibold">Charge:</span> {battery.charge}
                  </p>
                  <p>
                    <span className="font-semibold">Discharge:</span> {battery.discharge}
                  </p>
                  <p>
                    <span className="font-semibold">Temperature:</span> {battery.temperature}
                  </p>
                  <p>
                    <span className="font-semibold">Voltage:</span> {battery.voltage}
                  </p>
                </div>
                {/* Control Button aligned to the right */}
                <div className="pt-3 flex justify-end">
                  <Link
                    to={`/control/${battery.name.toLowerCase().replace(" ", "")}`}
                  >
                    <button className="py-2 px-4 bg-teal-600 text-white rounded-lg text-xs">
                      Control
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Previous Cycle */}
            <div className="text-sm bg-gray-100 dark:bg-gray-700 px-4 py-4 rounded-md space-y-1">
              <p className="text-center font-medium text-gray-800 dark:text-gray-200 mb-2">
                Previous Cycle
              </p>
              <p>Charge Time: 2025-03-19, 11:43-11:08</p>
              <p>Discharge Time: 2025-03-19, 16:26-16:31</p>
              {/* <p className={battery.cycleWarningColor}>{battery.cycleWarning}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batteries;