import React, { useEffect, useState, useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import moment from "moment-timezone";
import { DateContext } from "../contexts/DateContext";
import * as XLSX from 'xlsx'; 

const PeakDemand = () => {
  const { startDateTime, endDateTime } = useContext(DateContext); 
  const [peakDemandData, setPeakDemandData] = useState([]);
  const [warning, setWarning] = useState('');

  const fetchPeakDemandData = async (startDateTime, endDateTime) => {
    try {
      const response = await axios.get("http://localhost:3001/api/opeakdemand", {
        params: {
          startDateTime,
          endDateTime,
        },
      });
      setPeakDemandData(response.data.peakDemandData);
    } catch (error) {
      console.error("Error fetching peak demand data:", error);
    }
  };

  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = moment(startDateTime);
      const end = moment(endDateTime);
      const durationHours = end.diff(start, 'hours');
  
      if (durationHours > 25) {
        setWarning("Only a maximum of 96 data points can be displayed.");
        setPeakDemandData([]); 
        return;
      }
      setWarning('');
      fetchPeakDemandData(startDateTime, endDateTime);
    }

},[startDateTime, endDateTime]);

  const downloadExcel = () => {
    if (!peakDemandData || peakDemandData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headerRow = [`Start: ${startDateTime}`, `End: ${endDateTime}`, ""]; 

    const columnHeaders = ["Date", "Time", "Peak Demand (kVA)"];

    const formattedData = peakDemandData.map((item) => [
      moment(item.minute).format("YYYY-MM-DD"), 
      moment(item.minute).format("HH:mm"), 
      parseFloat(item.total_kVA), 
    ]);

    const dataForExcel = [headerRow, columnHeaders, ...formattedData];

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Peak Demand Data");

    XLSX.writeFile(workbook, `Peak_Demand_${startDateTime}_to_${endDateTime}.xlsx`);
  };

  const options = {
    chart: {
      type: "line",
      backgroundColor: "white",
    },
    title: {
      text: null,
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: peakDemandData.map((data) => moment(data.minute).format("HH:mm")),
      title: {
        text: "Hour",
        style: {
          fontWeight: "bold",
        },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 800,
      title: {
        text: "Peak Demand (kVA)",
        style: {
          fontWeight: "bold",
        },
      },
      gridLineWidth: 0,
      plotLines: [
        {
          value: 745,
          color: "red",
          dashStyle: "Dash",
          width: 2,
          label: {
            text: "Upper Ceiling (745 kVA)",
            align: "right",
            x: -30,
            style: {
              color: "red",
              fontWeight: "bold",
            },
          },
        },
        {
          value: 596,
          color: "red",
          dashStyle: "Dash",
          width: 2,
          label: {
            text: "Lower Ceiling (596 kVA)",
            align: "right",
            x: -10,
            style: {
              color: "red",
              fontWeight: "bold",
            },
          },
        },
      ],
    },
    tooltip: {
      shared: true,
      backgroundColor: "white",
      style: {
        color: "#000",
      },
      borderRadius: 10,
      formatter: function () {
        const point = this.points[0];
        const time = point.point.time.split(" ")[1];
        return `<b>Time:</b> ${time}<br/><b>Value:</b> ${point.y} kVA`;
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Apparent Power",
        data: peakDemandData.map((data) => ({
          y: parseFloat(data.total_kVA),
          time: data.minute,
        })),
        color: "#1f77b4",
      },
    ],
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full h-full">
      <div className="flex justify-between items-center pb-6">
        <h2 className="text-xl font-semibold">Grid Peak Demand</h2>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Excel
        </button>
      </div>
      {warning ? (
      <div className="flex items-center justify-center h-64">
        <div className="text-yellow-600 bg-yellow-100 px-6 py-4 rounded-md border border-yellow-300 text-center text-base font-medium">
          {warning}
        </div>
      </div>
    ) : (
      <div className="w-full h-[400px] -translate-x-4">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )}
  </div>
  );
};

export default PeakDemand;