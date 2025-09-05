import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const BuildingOverview = () => {
  // Data for Grid Consumption chart
  const gridConsumptionOptions = {
    title: {
      text: 'Grid Consumption (kWh)',
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Grid Consumption',
        data: [500, 450, 600, 550, 700, 680, 750, 800, 850, 780],
        color: '#4B5563', // Dark gray
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Data for Wheeled-in Energy chart
  const wheeledInEnergyOptions = {
    title: {
      text: 'Wheeled-in Energy (kWh)',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Wheeled-in Energy',
        data: [350, 320, 410, 360, 420, 430, 460, 500, 540, 520],
        color: '#10B981', // Green
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Data for Grid Energy Maximum (kWh) chart
  const gridEnergyMaxOptions = {
    title: {
      text: 'Grid Energy Maximum (kWh)',
    },
    chart: {
      type: 'area',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Grid Energy Maximum',
        data: [600, 580, 640, 610, 700, 720, 780, 800, 850, 820],
        color: '#1D4ED8', // Blue
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5,
      },
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Data for Maximum Demand (kVA) chart
  const maxDemandOptions = {
    title: {
      text: 'Maximum Demand (kVA)',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Demand (kVA)',
      },
    },
    series: [
      {
        name: 'Maximum Demand',
        data: [250, 230, 260, 280, 290, 310, 320, 340, 360, 380],
        color: '#F59E0B', // Orange
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kVA</b>',
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Data for Daily Demand (kVA) chart
  const dailyDemandOptions = {
    title: {
      text: 'Daily Demand (kVA)',
    },
    chart: {
      type: 'spline',
    },
    xAxis: {
      categories: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      title: {
        text: 'Days of the Month',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Demand (kVA)',
      },
    },
    series: [
      {
        name: 'Daily Demand',
        data: [210, 200, 240, 230, 250, 220, 260, 270, 290, 300],
        color: '#EF4444', // Red
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kVA</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Data for Peak Shaving Using IOE and LTO chart
  const peakShavingOptions = {
    title: {
      text: 'Peak Shaving Using IOE and LTO',
    },
    chart: {
      type: 'areaspline',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Energy Saved (kWh)',
      },
    },
    series: [
      {
        name: 'IOE Peak Shaving',
        data: [150, 130, 170, 160, 180, 200, 220, 210, 230, 240],
        color: '#34D399', // Green
      },
      {
        name: 'LTO Peak Shaving',
        data: [140, 120, 160, 150, 170, 190, 210, 200, 220, 230],
        color: '#60A5FA', // Blue
      },
    ],
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} kWh</b><br/>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Building Energy Overview</h1>
        <p className="text-gray-600 mt-2">Monitor various aspects of building energy</p>
      </div>

      {/* Consumption Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Grid Consumption Overview</h2>
          <p className="text-gray-600 mt-4">
            <strong>Current Month Consumption:</strong> 780 kWh<br />
            <strong>Previous Month Consumption:</strong> 850 kWh<br />
            <strong>Total Consumption (Year):</strong> 6,850 kWh
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Wheeled-in Energy Overview</h2>
          <p className="text-gray-600 mt-4">
            <strong>Current Month Wheeled-in Energy:</strong> 520 kWh<br />
            <strong>Previous Month Wheeled-in Energy:</strong> 540 kWh<br />
            <strong>Total Wheeled-in Energy (Year):</strong> 4,360 kWh
          </p>
        </div>
      </div>

      {/* Grid Consumption Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <HighchartsReact highcharts={Highcharts} options={gridConsumptionOptions} />
      </div>

      {/* Wheeled-in Energy Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <HighchartsReact highcharts={Highcharts} options={wheeledInEnergyOptions} />
      </div>

      {/* Grid Energy Maximum Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <HighchartsReact highcharts={Highcharts} options={gridEnergyMaxOptions} />
      </div>

      {/* Maximum Demand Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <HighchartsReact highcharts={Highcharts} options={maxDemandOptions} />
      </div>

      {/* Daily Demand Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <HighchartsReact highcharts={Highcharts} options={dailyDemandOptions} />
      </div>

      {/* Peak Shaving Using IOE and LTO Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <HighchartsReact highcharts={Highcharts} options={peakShavingOptions} />
      </div>
    </div>
  );
};

export default BuildingOverview;
