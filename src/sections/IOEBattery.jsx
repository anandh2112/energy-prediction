import { useState } from "react";

const IOEBatteryControl = () => {
  const [charge, setCharge] = useState(75);
  const [voltage, setVoltage] = useState(380);
  const [current, setCurrent] = useState(25);
  const [status, setStatus] = useState("Charging");
  const [batteryTemp, setBatteryTemp] = useState(35);
  const [heatingStatus, setHeatingStatus] = useState(false);
  const [energyUsed, setEnergyUsed] = useState(120);
  const [operatingTime, setOperatingTime] = useState(24);
  const [totalCycles, setTotalCycles] = useState(15);
  const [lastMaintenance, setLastMaintenance] = useState("2023-09-01");

  const logs = [
    { id: 1, timestamp: "12/10/2024 14:45", event: "Discharge", current: 15, voltage: 365, status: "Complete" },
    // Add more logs here
  ];

  const toggleHeating = () => setHeatingStatus(!heatingStatus);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">IOE Battery Control</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Overview Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="mb-4">
            <span className="font-medium">SoC (%): </span>
            <span>{charge}%</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Current Status: </span>
            <span>{status}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Current (A): </span>
            <span>{current}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Voltage (V): </span>
            <span>{voltage}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Main Contactor Status: </span>
            <span>OFF</span>
          </div>
          <div>
            <span className="font-medium">Precharge Contactor Status: </span>
            <span>ON</span>
          </div>
        </div>

        {/* Instantaneous Control Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instantaneous Control</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="status" className="block font-medium">Status</label>
              <select
                id="status"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Charging">Charging</option>
                <option value="Idle">Idle</option>
                <option value="Discharge">Discharge</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="function" className="block font-medium">Function</label>
              <select
                id="function"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="Normal">Normal</option>
                <option value="Test">Test</option>
                <option value="Shutdown">Shutdown</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">PIN for Control:</label>
              <input
                type="password"
                className="border rounded-md p-2 w-full"
                placeholder="Enter PIN"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Scheduled Control Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Scheduled Control</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Charge Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Charge</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="charge-time" className="block font-medium">Charge Time (hh:mm)</label>
                <input
                  type="time"
                  id="charge-time"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="charge-duration" className="block font-medium">Duration (hrs)</label>
                <input
                  type="number"
                  id="charge-duration"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter duration"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="charge-status" className="block font-medium">Charge Status</label>
                <select
                  id="charge-status"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition"
              >
                Schedule Charge
              </button>
            </form>
          </div>

          {/* Discharge Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Discharge</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="discharge-time" className="block font-medium">Discharge Time (hh:mm)</label>
                <input
                  type="time"
                  id="discharge-time"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="discharge-duration" className="block font-medium">Duration (hrs)</label>
                <input
                  type="number"
                  id="discharge-duration"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter duration"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="discharge-status" className="block font-medium">Discharge Status</label>
                <select
                  id="discharge-status"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
              >
                Schedule Discharge
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOEBatteryControl;
