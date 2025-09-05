import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from 'axios';
import * as XLSX from 'xlsx'; 


const MonthlyConsumption = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyConsumption, setMonthlyConsumption] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = new Date().toISOString().replace('T', ' ').substr(0, 19);

      try {
        const response = await axios.get('https://mw.elementsenergies.com/api/mbconsumption', {
          params: {
            year: year,
            currentTime: currentTime,
          },
        });

        const roundedData = response.data.monthlyConsumption.map(value => parseFloat(value).toFixed(1)).map(value => parseFloat(value));
        setMonthlyConsumption(roundedData);
      } catch (error) {
        console.error('Error fetching monthly consumption:', error);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const downloadExcel = () => {
    if (!monthlyConsumption || monthlyConsumption.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headerRow = [`Year: ${year}`, "", "", "", ""];
    const columnHeaders = ["Month", "Consumption (kWh)"];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = monthlyConsumption.map((value, index) => [months[index], value]);

    const dataForExcel = [headerRow, columnHeaders, ...formattedData];

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Consumption");

    XLSX.writeFile(workbook, `Monthly_Consumption_${year}.xlsx`);
  };


  const chartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: null
      },
      gridLineWidth: 0,  
      lineWidth: 0,  
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Energy (kWh)'
      },
      gridLineWidth: 0,  
      lineWidth: 0,  
    },
    series: [
      {
        name: 'Consumption',
        data: monthlyConsumption,
        color: '#34D399'
      }
    ],
    tooltip: {
      pointFormat: '{point.y} kWh',
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: true
      }
    },
    exporting: {
      enabled: false
    }
  };

  return (
    <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Grid Consumption (kWh)</h2>
  
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <label htmlFor="year-picker" className="mr-2 text-sm font-medium">Year:</label>
          <input 
            id="year-picker" 
            type="number" 
            value={year} 
            onChange={handleYearChange} 
            min="2000" 
            max={new Date().getFullYear()} 
            className="border rounded p-1 text-sm w-20"
          />
        </div>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>
    </div>
  
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  </div>
  );
};

export default MonthlyConsumption;