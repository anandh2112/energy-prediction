import { FaThermometerHalf, FaTachometerAlt, FaBatteryFull, FaCogs } from 'react-icons/fa';
import chillerImage from "../pages/chiller.png"; // Replace with the actual chiller image

const ChillerDetails = () => {
  // Dummy chiller data
  const chiller = {
    name: 'Chiller',
    efficiency: '90%',
    capacity: '1000 kW',
    lastMaintenance: '2024-11-01',
    evapInletTemp: '5°C',
    evapOutletTemp: '10°C',
    condInletTemp: '35°C',
    condOutletTemp: '40°C',
    operatingHours: '3200 hrs',
    energyConsumed: '150,000 kWh',
    cycles: '1500',
    powerConsumption: '120 kW',
  };

  return (
    <div className="p-8 mt-4">
      {/* Centered Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Chiller</h1>
       {/* Performance Metrics - Mini Cards at the Top */}
       <div className="grid grid-cols-3 gap-6 my-10">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-800">Energy Consumed</h4>
          <p className="font-semibold text-gray-800">{chiller.energyConsumed}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-800">Cycles</h4>
          <p className="font-semibold text-gray-800">{chiller.cycles}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-800">Power Consumption</h4>
          <p className="font-semibold text-gray-800">{chiller.powerConsumption}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Chiller Image */}
        <div className="w-full md:w-1/2 pr-8 mb-6 md:mb-0">
          <img src={chillerImage} alt="Chiller Image" className="w-full h-auto rounded-lg shadow-lg" />
        </div>

        {/* Right Side - Chiller Details Card */}
        <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 space-y-6">
          {/* Chiller Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <p className="font-medium text-gray-700">Efficiency:</p>
              <p className="font-semibold text-gray-800 pl-1">{chiller.efficiency}</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-700">Capacity:</p>
              <p className="font-semibold text-gray-800 pl-1">{chiller.capacity}</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-700">Last Maintenance:</p>
              <p className="font-semibold text-gray-800 pl-1">{chiller.lastMaintenance}</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-gray-700">Operating Hours:</p>
              <p className="font-semibold text-gray-800 pl-1">{chiller.operatingHours}</p>
            </div>
          </div>

          {/* Temperature Parameters */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-semibold text-gray-700">Temperature Parameters</h3>
            <div className="flex justify-between">
              <p className="font-medium text-gray-700">Evaporator Inlet Temp:</p>
              <p className="font-semibold text-gray-800">{chiller.evapInletTemp}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-700">Evaporator Outlet Temp:</p>
              <p className="font-semibold text-gray-800">{chiller.evapOutletTemp}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-700">Condenser Inlet Temp:</p>
              <p className="font-semibold text-gray-800">{chiller.condInletTemp}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-700">Condenser Outlet Temp:</p>
              <p className="font-semibold text-gray-800">{chiller.condOutletTemp}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChillerDetails;
