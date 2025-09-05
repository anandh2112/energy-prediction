import React, { useContext,useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dg from "../sections/pictures/DieselUpd.png";
import { DateContext } from '../contexts/DateContext';
import moment from 'moment-timezone';

const DieselGeneration = () => {
  const navigate = useNavigate();
  const {startDateTime,endDateTime} = useContext(DateContext); 
  const [dgData, setDgData] = useState(null);
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kolkata"));

  const getStatus = (backendTimestamp) => {
    if (!backendTimestamp) {
      return 'N/A';
    }

    const parsedBackendTime = moment.tz(backendTimestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");

    const diffSeconds = Math.abs(currentTime.diff(parsedBackendTime, 'seconds'));

    if (diffSeconds <= 3) {
      return 'Running';
    } else {
      return 'Off';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Running' ? 'text-green-600' : 'text-red-600';
  };


  useEffect(() => {
    const fetchDgDetails = async () => {
      if (!startDateTime || !endDateTime) {
        return;
      }

      try {
        const response = await fetch(`https://mw.elementsenergies.com/api/dgdc?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setDgData(data);
      } catch (err) {
        console.error("Failed to fetch DG details:", err);
      } finally {
      }
    };
    fetchDgDetails();
  }, [startDateTime, endDateTime]);

  const dg1 = dgData && dgData[13] ? dgData[13] : { total_kW: null, timestamp: null };
  const dg2 = dgData && dgData[14] ? dgData[14] : { total_kW: null, timestamp: null };

  return (
    <div className="relative bg-white dark:bg-secondary-dark-bg rounded-xl shadow-md p-8">
      <h2 className="text-lg font-bold pb-6">Diesel Generators</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
          <img className="w-50 h-40 object-contain rounded-lg mb-4" src={dg} alt="DG1" />
          <h2 className="font-bold text-2xl text-gray-800 mb-2">DG1</h2>
          <div className="text-gray-700 text-sm space-y-2">
            <p><strong>Status:</strong>  <span className={getStatusColor(getStatus(dg1.timestamp))}>
                {getStatus(dg1.timestamp)}
              </span></p>
            <p>
            <strong>Power Output:</strong> {dg1.total_kW != null ? `${dg1.total_kW} kW` : 'N/A'}

            </p>
            <p>
              <strong>Last Updated:</strong> {dg1.timestamp ? moment.tz(dg1.timestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss") : 'N/A'}
            </p>                  
          </div>
          <button 
            onClick={() => navigate('/monitor/generator/1')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            View Details
          </button>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
          <img className="w-50 h-40 object-contain rounded-lg mb-4" src={dg} alt="DG2" />
          <h2 className="font-bold text-2xl text-gray-800 mb-2">DG2</h2>
          <div className="text-gray-700 text-sm space-y-2">
            <p><strong>Status:</strong> <span className={getStatusColor(getStatus(dg2.timestamp))}>
                {getStatus(dg2.timestamp)}
              </span></p>
            <p>
            <strong>Power Output:</strong> {dg2.total_kW != null ? `${dg2.total_kW} kW` : 'N/A'}
            </p>
            <p>
              <strong>Last Updated:</strong> {dg1.timestamp ? moment.tz(dg2.timestamp, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss") : 'N/A'}
            </p>           
          </div>
          <button 
            onClick={() => navigate('/monitor/generator/2')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DieselGeneration;