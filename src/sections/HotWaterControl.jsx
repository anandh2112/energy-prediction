import React, { useState } from 'react';

const HotWaterControl = () => {
    const [formData, setFormData] = useState({
        status: '',
        function: '',
        pin: '',
        chargeTime: '',
        chargeDuration: '',
        chargeStatus: '',
        dischargeTime: '',
        dischargeDuration: '',
        dischargeStatus: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Hot Water Control</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Overview Card */}
                <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-white">
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <div className="mb-4">
                        <span className="font-medium">SoC (%): </span>
                        <span>75%</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-medium">Current Status: </span>
                        <span>ACTIVE</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-medium">Current (A): </span>
                        <span>45</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-medium">Voltage (V): </span>
                        <span>460</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-medium">Main Contactor Status: </span>
                        <span>ON</span>
                    </div>
                    <div>
                        <span className="font-medium">Precharge Contactor Status: </span>
                        <span>ON</span>
                    </div>
                </div>

                {/* Instantaneous Control Card */}
                <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-white">
                    <h2 className="text-xl font-semibold mb-4">Instantaneous Control</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="status" className="block font-medium">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="function" className="block font-medium">Function</label>
                            <select
                                id="function"
                                name="function"
                                value={formData.function}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Function</option>
                                <option value="normal">Normal</option>
                                <option value="test">Test</option>
                                <option value="shutdown">Shutdown</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">PIN for Control:</label>
                            <input
                                type="password"
                                name="pin"
                                value={formData.pin}
                                onChange={handleChange}
                                className="border rounded-md p-2 w-full"
                                placeholder="Enter PIN"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition">
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
                    <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-white">
                        <h3 className="text-lg font-semibold mb-4">Charge</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="charge-time" className="block font-medium">Charge Time (hh:mm)</label>
                                <input
                                    type="time"
                                    id="charge-time"
                                    name="chargeTime"
                                    value={formData.chargeTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="charge-duration" className="block font-medium">Duration (hrs)</label>
                                <input
                                    type="number"
                                    id="charge-duration"
                                    name="chargeDuration"
                                    value={formData.chargeDuration}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    placeholder="Enter duration"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="charge-status" className="block font-medium">Charge Status</label>
                                <select
                                    id="charge-status"
                                    name="chargeStatus"
                                    value={formData.chargeStatus}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Charge Status</option>
                                    <option value="enabled">Enabled</option>
                                    <option value="disabled">Disabled</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition">
                                Schedule Charge
                            </button>
                        </form>
                    </div>

                    {/* Discharge Card */}
                    <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-white">
                        <h3 className="text-lg font-semibold mb-4">Discharge</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="discharge-time" className="block font-medium">Discharge Time (hh:mm)</label>
                                <input
                                    type="time"
                                    id="discharge-time"
                                    name="dischargeTime"
                                    value={formData.dischargeTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="discharge-duration" className="block font-medium">Duration (hrs)</label>
                                <input
                                    type="number"
                                    id="discharge-duration"
                                    name="dischargeDuration"
                                    value={formData.dischargeDuration}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                    placeholder="Enter duration"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="discharge-status" className="block font-medium">Discharge Status</label>
                                <select
                                    id="discharge-status"
                                    name="dischargeStatus"
                                    value={formData.dischargeStatus}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Discharge Status</option>
                                    <option value="enabled">Enabled</option>
                                    <option value="disabled">Disabled</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition">
                                Schedule Discharge
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotWaterControl;
