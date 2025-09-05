import React from 'react';
import UPSBatteryHourlyChart from '../components/UPSBatteryHourlyChart';
import DailyEnergyCycleChart from '../components/DailyEnergyCycleChart';
import VoltageCurrentChart from '../components/VoltageCurrentChart';
import LTOBatteryHourlyChart from '../components/LTOBattery';
import LTODailyEnergyCycleChart from '../components/LTOEnergyCycle';
import LTOVoltageCurrentChart from '../components/LTOVoltage';
import IOEEnergyCycleChart from '../components/IOEenergycycle';
import IOEVoltageCurrentChart from '../components/IOEVoltageCurrent';
import IOEBatteryHourlyChart from '../components/IOEBattery';

const BatteriesMonitor = () => {
  return (
    <div className="bg-gray-100 dark:bg-secondary-dark-bg p-6 rounded-lg shadow-lg flex flex-col space-y-12"> {/* Added space-y-12 for gaps */}
      {/* UPS Battery Section */}
      <div className="text-center mb-6"> {/* Centered heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">UPS Battery (48 kWh)</h1>
      </div>

      {/* UPS Battery Hourly Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">UPS Battery Hourly</h2>
        <UPSBatteryHourlyChart />
      </div>

      {/* Daily Energy Cycle vs SoC Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Daily Energy Cycle v/s SoC</h2>
        <DailyEnergyCycleChart />
      </div>

      {/* Voltage vs Current Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Voltage v/s Current</h2>
        <VoltageCurrentChart />
      </div>

      {/* LTO Battery Section */}
      <div className="text-center mb-6"> {/* Centered heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">LTO Battery (660 kWh)</h1>
      </div>

      {/* LTO Battery Hourly Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">LTO Battery Hourly</h2>
        <LTOBatteryHourlyChart />
      </div>

      {/* LTO Daily Energy Cycle vs SoC Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Daily Energy Cycle v/s SoC</h2>
        <LTODailyEnergyCycleChart />
      </div>

      {/* LTO Voltage vs Current Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Voltage v/s Current</h2>
        <LTOVoltageCurrentChart />
      </div>

      {/* IOE Battery Section */}
      <div className="text-center mb-6"> {/* Centered heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">IOE Battery (840 kWh)</h1>
      </div>

      {/* IOE Battery Hourly Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">IOE Battery Hourly</h2>
        <IOEBatteryHourlyChart />
      </div>

      {/* IOE Daily Energy Cycle vs SoC Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Daily Energy Cycle v/s SoC</h2>
        <IOEEnergyCycleChart />
      </div>

      {/* IOE Voltage vs Current Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Voltage v/s Current</h2>
        <IOEVoltageCurrentChart />
      </div>
    </div>
  );
};

export default BatteriesMonitor;
