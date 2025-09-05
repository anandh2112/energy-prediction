import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { DateContext } from "../contexts/DateContext";
import { set } from "date-fns";

const zoneDetails = {
    1: { name: "PLATING", category: "C-49" },
    2: { name: "DIE CASTING+CB+CNC", category: "C-50" },
    3: { name: "SCOTCH BUFFING", category: "C-50" },
    4: { name: "BUFFING", category: "C-49" },
    5: { name: "SPRAY+EPL-I", category: "C-50" },
    6: { name: "SPRAY+ EPL-II", category: "C-49" },
    7: { name: "RUMBLE", category: "C-50" },
    8: { name: "AIR COMPRESSOR", category: "C-49" },
    9: { name: "TERRACE", category: "C-49" },
    10: { name: "TOOL ROOM", category: "C-50" },
    11: { name: "ADMIN BLOCK", category: "C-50" },
    12: { name: "TRANSFORMER"}
};
 
const getZoneNameAndCategory = (id) => {
  if (id === 0) return { name: "TOTAL CONSUMPTION", category: null };
  return zoneDetails[id] || { name: "Unknown Zone", category: "N/A" };
};




const EnergyMeter = ({ name, consumption, id }) => {
  const navigate = useNavigate();
  const zoneInfo = getZoneNameAndCategory(id);

  return (
    <div className="bg-white rounded-lg w-full h-50 flex flex-col justify-between items-center text-center p-4 border border-gray-500">
      <div className={`text-white text-xs font-medium w-40 rounded whitespace-nowrap max-w-[150px] ${
    zoneInfo.category ? 'py-1 bg-green-500' : 'bg-orange-500 py-3'
  }`}>
        <div className="font-bold">{zoneInfo.name}</div>
        {zoneInfo.category && (
    <div className="text-white">Block: {zoneInfo.category}</div>
  )}      </div>

      <div className="pt-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-800 whitespace-nowrap">{consumption} kVAh</div>
        <div className="text-xs text-gray-400">Consumption</div>
      </div>

      <button
    onClick={() =>
      id === 0
        ? navigate(`/monitor/zones`)
        : navigate(`/monitor/zones?zone=${id}`)
    }
    className="mt-2 text-blue-600 font-semibold text-xs hover:text-blue-800"
  >
    View Details
  </button>
    </div>
  );
};

const MeterInfo = () => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const [energyMeters, setEnergyMeters] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Zone ${i + 1}`,
      consumption: 0,
    }))
  );
    const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/econsumption`, {
          params: {
            startDateTime,
            endDateTime
          }
        });
  
        const formattedData = response.data.consumptionData.map((entry) => ({
          id: entry.energy_meter_id,
          name: `Zone ${entry.energy_meter_id}`,
          consumption: parseFloat(entry.consumption)
        }));
  
        setEnergyMeters(formattedData);

        const totalConsRes = await axios.get(`http://localhost:3001/api/mcapcons`, {
          params: { startDateTime, endDateTime }
          
        });
        setTotalConsumption(totalConsRes.data.consumption); 
           } 
        catch (error) {
          throw error;
      }
    };
  
    fetchData();
  }, [startDateTime, endDateTime]);
  
  const regularMeters = energyMeters.filter((meter) => meter.id !== 12);
  const transformerMeter = energyMeters.find((meter) => meter.id === 12);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col">
      <h2 className="text-xl font-semibold pb-7">Energy Meters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-6 mx-auto">
      {regularMeters.map((meter) => (
          <EnergyMeter
            key={meter.id}
            name={meter.name}
            consumption={meter.consumption}
            id={meter.id}
          />
        ))}

        <EnergyMeter
          key="total"
          name="Total Consumption"
          consumption={totalConsumption}
          id={0} 
        />

        {transformerMeter && (
          <EnergyMeter
            key="transformer"
            name="Transformer"
            consumption={transformerMeter.consumption}
            id={12}
          />
        )}
      </div>
    </div>
  );
};

export default MeterInfo;