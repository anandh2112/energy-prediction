import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import default styling

const RadialProgressBar = () => {
  const progressData = [
    { label: "Client", value: 88.7, color: "#4B92D4" },
    { label: "Chiller", value: 0.0, color: "#A4B0BB" },
    { label: "Common Area", value: 0.3, color: "#6B9A3F" },
    { label: "Others", value: 10.9, color: "#F4A300" },
  ];

  return (
    <div className="flex justify-center space-x-4">
      {progressData.map((data, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm w-32"
        >
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {data.label}
          </h4>
          <div className="w-24 h-24">
            <CircularProgressbar
              value={data.value}
              text={`${data.value}%`}
              styles={{
                path: { stroke: data.color, strokeWidth: 8 },
                text: { fill: data.color, fontSize: "16px", fontWeight: "bold" },
                trail: { stroke: "#e6e6e6", strokeWidth: 8 },
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {data.value}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default RadialProgressBar;
