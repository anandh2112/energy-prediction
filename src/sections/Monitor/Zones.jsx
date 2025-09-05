import React, { useState, useEffect, useContext } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { DateContext } from '../../contexts/DateContext';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from "moment-timezone";

if (Exporting && typeof Exporting === 'function') Exporting(Highcharts);
if (ExportData && typeof ExportData === 'function') ExportData(Highcharts);

const zoneMetadata = [
  { id: 1, name: "PLATING", category: "C-49" },
  { id: 2, name: "DIE CASTING + CHINA BUFFING + CNC", category: "C-50" },
  { id: 3, name: "SCOTCH BUFFING", category: "C-50" },
  { id: 4, name: "BUFFING", category: "C-49" },
  { id: 5, name: "SPRAY+EPL-I", category: "C-50" },
  { id: 6, name: "SPRAY+EPL-II", category: "C-49" },
  { id: 7, name: "RUMBLE", category: "C-50" },
  { id: 8, name: "AIR COMPRESSOR", category: "C-49" },
  { id: 9, name: "TERRACE", category: "C-49" },
  { id: 10, name: "TOOL ROOM", category: "C-50" },
  { id: 11, name: "ADMIN BLOCK", category: "C-50" },
  { id: 12, name: "TRANSFORMER" }
];

const Zones = () => {
  const { startDateTime, endDateTime } = useContext(DateContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [warning, setWarning] = useState('');
  const [zoneData, setZoneData] = useState([]);
  const [selectedView, setSelectedView] = useState(
    new URLSearchParams(location.search).has('zone') ? 'single' : 'all'
  );
  const [selectedZone, setSelectedZone] = useState(
    parseInt(new URLSearchParams(location.search).get('zone')) || 1
  );
  const [consumptionType, setConsumptionType] = useState('kVAh');

  useEffect(() => {
    const start = moment(startDateTime);
    const end = moment(endDateTime);
    const durationHours = end.diff(start, 'hours');

    if (durationHours > 24) {
      setWarning('Only a maximum of 24 hourly values can be displayed.');
      setZoneData([]);
      return;
    } else {
      setWarning('');
    }
    const fetchZoneData = async () => {
      try {
        const isAllZones = selectedView === 'all';
    
        let endpoint = isAllZones 
          ? (consumptionType === 'kWh' ? 'zkWhAZconsumption' : 'zkVAhAZconsumption')
          : (consumptionType === 'kWh' ? 'zconsumption' : 'zkVAhconsumption');
    
        let response;
        if (isAllZones) {
          response = await axios.get(`https://mw.elementsenergies.com/api/${endpoint}`, {
            params: { startDateTime, endDateTime },
          });
        } else {
          response = await axios.get(`https://mw.elementsenergies.com/api/${endpoint}`, {
            params: { startDateTime, endDateTime, zone: selectedZone },
          });
        }
    
        const data = response.data?.consumptionData || [];
    
        const groupedData = data.reduce((acc, item) => {
          const zoneId = item.energy_meter_id;
          if (!acc[zoneId]) {
            acc[zoneId] = [];
          }
          acc[zoneId].push(item);
          return acc;
        }, {});
    
        const formattedData = zoneMetadata
          .filter(zone => Object.keys(groupedData).includes(zone.id.toString()))
          .map(zone => {
            const zoneData = groupedData[zone.id] || [];
            const parsedData = zoneData.map(item => ({
              hour: item.hour,
              value: parseFloat(
                consumptionType === 'kWh' ? item.kWh_difference || 0 : item.kVAh_difference || 0 ) }));
    
            return {
              zoneId: zone.id,
              zoneName: zone.name,
              category: zone.category || '',
              data: parsedData,
            };
          });
    
        setZoneData(formattedData);
      } catch (error) {
        console.error('Error fetching zone data:', error);
      }
    };
  
    fetchZoneData();
  }, [startDateTime, endDateTime, consumptionType, selectedView, selectedZone]);
  

  const downloadExcel = () => {
    if (!zoneData?.length) return;
    const headerRow = [`Start: ${startDateTime}`, `End: ${endDateTime}`, "", "", ""]; 
    const columnHeaders = ["Date", "Time", ...zoneData.map((zone) => `${zone.zoneName}${zone.category ? ` (${zone.category})` : ''} - ${consumptionType}`)];
    const uniqueTimes = [
      ...new Set(
        zoneData.flatMap((zone) =>
          zone.data.map((item) => moment(item.hour).format("YYYY-MM-DD HH:mm"))
        )
      ),
    ].sort(); 
    const formattedData = uniqueTimes.map((time) => {
      const [date, hour] = time.split(" ");
      const row = [date, hour];
  
      zoneData.forEach((zone) => {
        const zoneDataForTime = zone.data.find(
          (item) => moment(item.hour).format("YYYY-MM-DD HH:mm") === time
        );
        row.push(zoneDataForTime ? zoneDataForTime.value : 0);
      });
  
      return row;
    });
  
    const dataForExcel = [headerRow, columnHeaders, ...formattedData];
  
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zones Consumption");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `Zones_Consumption_${startDateTime}_to_${endDateTime}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  const chartOptionsAllZones = {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      spacingTop: 20,
      height: 500
    },
    title: {
      text: 'Hourly Consumption',
      useHTML: true,
    },
    xAxis: {
      categories: [
        ...new Set(zoneData.flatMap((zone) => zone.data.map((item) => item.hour))),
      ].map((hour) => hour.substring(11, 16)),
      title: { text: 'Time' },
      gridLineWidth: 0, 
    },
    yAxis: {
      min: 0,
      title: { text: `Energy Consumption (${consumptionType})` },
      gridLineWidth: 0, 
    },
    tooltip: {
      pointFormat:
        '{series.name}: {point.y} ' +
        consumptionType +
        '<br/>Total: {point.stackTotal} ' +
        consumptionType,
    },
    plotOptions: {
      column: {
        stacking: 'normal', 
        dataLabels: {
          enabled: false, 
        },
      },
    },
    series: zoneData.map((zone) => ({
      name: `${zone.zoneName} (${zone.category})`, 
      data: [
        ...new Set(zoneData.flatMap((zone) => zone.data.map((item) => item.hour))),
      ].map((hour) => zone.data.find((item) => item.hour === hour)?.value || 0),
    })),
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
     
    },
    
  };

  const chartOptionsSingleZone = (zone) => ({
    chart: { type: 'column', backgroundColor: 'white', height: 500 },
    title: {
      text: `${zone.zoneName} ${zone.category ? `<span style="font-size: 12px; font-weight: normal; color: gray;">(${zone.category})</span>` : ''} - Hourly Consumption`,
      useHTML: true,
    },   
    xAxis: {
      categories: zone.data.map((item) => item.hour.substring(11, 16)),
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: { text: `Energy Consumption (${consumptionType})` },
      gridLineWidth: 0,
    },
    series: [
      {
        name: zone.zoneName,
        data: zone.data.map((item) => item.value),
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    credits: { enabled: false },
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      valueSuffix: ` ${consumptionType}`,
      style: { zIndex: 1 },
    },
  });

  const handleViewChange = (view) => {
    setSelectedView(view);
    const params = new URLSearchParams();
    if (view === 'single') params.set('zone', selectedZone);
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div className='flex gap-2'>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => handleViewChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              selectedView === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => handleViewChange('single')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              selectedView === 'single' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Select Zone
          </button>
        </div>
        {
        selectedView === 'single' && (
         <select
         value={selectedZone}
         onChange={(e) => {
           const zoneId = parseInt(e.target.value);
           setSelectedZone(zoneId);
           navigate(`?zone=${zoneId}`, { replace: true });
         }}
         className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
       >
         {zoneMetadata.map((zone) => (
           <option key={zone.id} value={zone.id}>
             {zone.name} {zone.category ? `(${zone.category})` : ''}
           </option>
         ))}
       </select>
        )}
        </div>
        <div className='flex flex-end space-x-3'>
          <div className="flex bg-white rounded-full p-1 space-x-1">
            <button
              onClick={() => setConsumptionType('kVAh')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                consumptionType === 'kVAh' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-blue-50'
              }`}
            >
              kVAh
            </button>
            <button
              onClick={() => setConsumptionType('kWh')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                consumptionType === 'kWh' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-blue-50'
              }`}
            >
              kWh
            </button>
          </div>
          <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Download Excel
            </button>
          </div>
      </div>

     { warning ? (
          <div className="flex items-center justify-center h-64">
          <div className="text-yellow-600 bg-yellow-100 px-6 py-4 rounded-md border border-yellow-300 text-center text-base font-medium">
            {warning}
          </div>
        </div>
     ) : selectedView === 'all' ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptionsAllZones} />
      ) : (
        zoneData
          .filter((zone) => zone.zoneId === selectedZone)
          .map((zone) => (
            <div key={zone.zoneId} className="bg-white p-5 rounded-md shadow-sm">
              <HighchartsReact highcharts={Highcharts} options={chartOptionsSingleZone(zone)} />
            </div>
          ))
      )}
    </div>
  );
};

export default Zones;