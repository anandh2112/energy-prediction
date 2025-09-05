import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DateContext } from '../contexts/DateContext';

const getCurrentRate = (hours) => {
  if (hours >= 5 && hours < 10) return { period: "Off-Peak Tariff (05:00 - 10:00)", rate: "₹6.035 per kVAh" };
  if (hours >= 10 && hours < 19) return { period: "Normal Tariff (10:00 - 19:00)", rate: "₹7.10 per kVAh" };
  if ((hours >= 19 && hours <= 23) || (hours >= 0 && hours < 3)) return { period: "Peak Tariff (19:00 - 03:00)", rate: "₹8.165 per kVAh" };
  return { period: "Normal Tariff (03:00 - 05:00)", rate: "₹7.10 per kVAh" };
};

const Edmc = () => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const { period, rate } = getCurrentRate(new Date().getHours());
  const [data, setData] = useState({
    consumptionkVAh: 0,
    consumptionkWh: 0,
    peakDemand: 0,
    totalCost: 0,
    carbonFootprint: {
      emissions: 0,
      distance: 0
    }
  });  
  const [error, setError] = useState(null);
  

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/minicardpt1', {
        params: { startDateTime, endDateTime }
      });

      const {
        consumptionkVAh,
        consumptionkWh,
        peakDemand,
      } = res.data;

      setData({        
        consumptionkVAh,
        consumptionkWh,
        peakDemand,
      });

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    }
  };

  fetchData();
}, [startDateTime, endDateTime]);


  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-full">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Facility Information</h4>
        <p className="text-md font-bold text-gray-900">Metalware Corporation</p>
        <p className="text-md text-gray-900">
          BUA: <span className="font-bold">50,000 sq.ft.</span>
        </p>
        <p className="text-md text-gray-900">
          Location: <span className="font-bold">Noida, India</span>
        </p>
      </div>
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Consumption</h4>
          <p className="text-md font-bold text-gray-900">
            {`${data.consumptionkVAh} kVAh / ${data.consumptionkWh} kWh`}
          </p>
        <h4 className="text-md text-gray-900">Peak Demand</h4>
        <p className="text-md font-bold text-gray-900">{data.peakDemand} kVA</p>
      </div>
  
      <div className="flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-gray-300 sm:pr-4 h-full space-y-1">
        <h4 className="text-md text-gray-900">Cost of Electricity</h4>
            <p className="text-md font-bold text-gray-900">₹ 0</p>
            <p className="text-md text-gray-900">{period}</p>
            <p className="text-md font-bold text-gray-900">{rate}</p>
      </div>
  
      <div className="flex flex-col items-center text-center h-full space-y-1">
        <h4 className="text-md text-gray-900">Carbon Footprint</h4>
        <p className="text-md font-bold text-gray-900">
          {data.carbonFootprint ? `${data.carbonFootprint.emissions} kg CO₂` : "Loading..."}
        </p>
        <p className="text-md text-gray-900">
          Equivalent to driving 
        </p>
        <p className="font-bold">
            {data.carbonFootprint?.distance} km
          </p>
      </div>
    </div>
  </div>
  
  );
};

export default Edmc;