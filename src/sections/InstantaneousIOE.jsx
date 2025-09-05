import React from 'react';

const InstantaneousControl = ({ charge, setCharge, current, setCurrent, voltage, setVoltage, heatingStatus, toggleHeating }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4 text-center">Instantaneous Control</h2>
    <div className="mb-4">
      <label className="block mb-1 font-medium">Charge Control:</label>
      <input
        type="range"
        min="0"
        max="100"
        value={charge}
        onChange={(e) => setCharge(e.target.value)}
        className="w-full"
      />
      <div className="mt-2 text-lg font-bold">{charge}%</div>
    </div>
    <div className="mb-4">
      <label className="block mb-1 font-medium">Current (A):</label>
      <input
        type="number"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="border rounded-md p-2 w-full"
      />
      <div className="mt-2 text-lg font-bold">{current} A</div>
    </div>
    <div className="mb-4">
      <label className="block mb-1 font-medium">Voltage (V):</label>
      <input
        type="number"
        value={voltage}
        onChange={(e) => setVoltage(e.target.value)}
        className="border rounded-md p-2 w-full"
      />
      <div className="mt-2 text-lg font-bold">{voltage} V</div>
    </div>
    <div className="mb-4">
      <label className="block mb-1 font-medium">Heating Status:</label>
      <button
        onClick={toggleHeating}
        className={`w-full p-2 rounded-md text-white ${heatingStatus ? "bg-green-500" : "bg-red-500"}`}
      >
        {heatingStatus ? "Heating ON" : "Heating OFF"}
      </button>
    </div>
    <div className="mb-4">
      <label className="block mb-1 font-medium">PIN for Control:</label>
      <input
        type="password"
        className="border rounded-md p-2 w-full"
        placeholder="Enter PIN"
      />
    </div>
    <button className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600 transition duration-200">
      Submit
    </button>
  </div>
);

export default InstantaneousControl;
