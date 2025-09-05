import React from 'react';

const ThermalControl = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Thermal Control</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Instantaneous Control Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Instantaneous Control</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="status" className="block font-medium">Status</label>
                            <select id="status" className="mt-1 block w-full p-2 border border-gray-300 rounded">
                                <option value="">Select Status</option>
                                <option value="charge">Charge</option>
                                <option value="discharge">Discharge</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="function" className="block font-medium">Function</label>
                            <select id="function" className="mt-1 block w-full p-2 border border-gray-300 rounded">
                                <option value="">Select Function</option>
                                <option value="on">On</option>
                                <option value="off">Off</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="pin" className="block font-medium">PIN</label>
                            <input
                                type="password"
                                id="pin"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter PIN"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition">
                            Submit
                        </button>
                    </form>

                    {/* Mini Cards */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded shadow-md">
                            <h3 className="font-semibold">Current Flow</h3>
                            <p>3.5 m³/h</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded shadow-md">
                            <h3 className="font-semibold">Pump Status</h3>
                            <p>Active</p>
                        </div>
                    </div>
                </div>

                {/* Overview Card */}
<div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">Overview</h2>
    <div className="mb-4">
        <span className="font-medium">Status: </span>
        <span>IDLE</span>
    </div>
    <div className="mb-4">
        <span className="font-medium">Stored Water Temperature (°C): </span>
        <span>8.38</span>
    </div>
    <div className="mb-4">
        <span className="font-medium">Inlet Temperature (°C): </span>
        <span>16.62</span>
    </div>
    <div className="mb-4">
        <span className="font-medium">Outlet Temperature (°C): </span>
        <span>17.41</span>
    </div>
    <div className="mb-4">
        <span className="font-medium">Line Pressure (Bar): </span>
        <span>6.6</span>
    </div>
    <div className="mb-4">
        <span className="font-medium">Flow Rate (m³/h): </span>
        <span>To Building: 0, To TS: 0.179</span>
    </div>

    <div className="mb-4">
        <span className="font-medium">Component Status:</span>
    </div>

    {/* Status Visualization with SVG Icons */}
    <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
            {/* Actuator Icon */}
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 100-14 7 7 0 000 14zm-1-7h2v4h-2v-4zm0-6h2v2h-2V4z" />
            </svg>
            <span>Actuator</span>
        </div>
        <div className="flex items-center">
            {/* ADP Valve Icon */}
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 100-14 7 7 0 000 14zm-1-7h2v4h-2v-4zm0-6h2v2h-2V4z" />
            </svg>
            <span>ADP Valve</span>
        </div>
        <div className="flex items-center">
            {/* BDP Valve Icon */}
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 100-14 7 7 0 000 14zm-1-7h2v4h-2v-4zm0-6h2v2h-2V4z" />
            </svg>
            <span>BDP Valve</span>
        </div>
        <div className="flex items-center">
            {/* H Valve Icon */}
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 100-14 7 7 0 000 14zm-1-7h2v4h-2v-4zm0-6h2v2h-2V4z" />
            </svg>
            <span>H Valve</span>
        </div>
    </div>

    {/* Mini Cards */}
    <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded shadow-md">
            <h3 className="font-semibold">Water Level</h3>
            <p>Full</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow-md">
            <h3 className="font-semibold">System Health</h3>
            <p>Normal</p>
        </div>
    </div>
</div>

            </div>
        </div>
    );
};

export default ThermalControl;
