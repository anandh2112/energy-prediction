import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const RenewableEnergy = () => {
  // Wheeled in Solar Phase 1 - Daily Solar Data chart options
  const solarDailyDataOptions = {
    title: {
      text: 'Wheeled in Solar Phase 1 - Daily Solar Data',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      title: {
        text: 'Days of the Month',
      },
    },
    yAxis: {
      title: {
        text: 'Solar Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Daily Solar Energy',
        data: [12, 15, 14, 13, 18, 20, 22, 25, 23, 24],
        color: '#F59E0B', // Solar Yellow
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Inverter Active Power chart options
  const inverterPowerOptions = {
    title: {
      text: 'Inverter Active Power (kW)',
    },
    chart: {
      type: 'area',
    },
    xAxis: {
      categories: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
      title: {
        text: 'Time of Day',
      },
    },
    yAxis: {
      title: {
        text: 'Power (kW)',
      },
    },
    series: [
      {
        name: 'Inverter Power',
        data: [1.2, 1.5, 2.0, 2.4, 2.5, 2.3, 2.1, 1.8],
        color: '#34D399', // Green
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kW</b>',
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

  // Expected vs Actual Solar Generation chart options
  const expectedVsActualOptions = {
    title: {
      text: 'Expected vs Actual Solar Generation (kWh)',
    },
    chart: {
      type: 'column',
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
        text: 'Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Expected Generation',
        data: [20, 22, 25, 24, 23, 26, 27, 28, 25, 24],
        color: '#60A5FA', // Blue
      },
      {
        name: 'Actual Generation',
        data: [18, 20, 22, 23, 21, 25, 26, 24, 23, 22],
        color: '#EF4444', // Red
      },
    ],
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} kWh</b><br/>',
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

  // Rooftop Solar chart options
  const rooftopSolarOptions = {
    title: {
      text: 'Rooftop Solar Energy (kWh)',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      title: {
        text: 'Days of the Month',
      },
    },
    yAxis: {
      title: {
        text: 'Energy (kWh)',
      },
    },
    series: [
      {
        name: 'Rooftop Solar',
        data: [15, 17, 19, 22, 25, 27, 28, 30, 29, 26],
        color: '#F97316', // Orange
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Phase Wise Generation chart options
  const phaseWiseGenerationOptions = {
    title: {
      text: 'Phase Wise Generation (kWh)',
    },
    chart: {
      type: 'bar',
    },
    xAxis: {
      categories: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'],
      title: {
        text: 'Phases',
      },
    },
    yAxis: {
      title: {
        text: 'Generation (kWh)',
      },
    },
    series: [
      {
        name: 'Generation',
        data: [300, 500, 450, 600],
        color: '#22D3EE', // Cyan
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kWh</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Expected vs Actual Generation for different phases
  const expectedVsActualPhaseWiseOptions = {
    title: {
      text: 'Expected vs Actual Generation (kWh) - Phases',
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'],
      title: {
        text: 'Phases',
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
        name: 'Expected Generation',
        data: [400, 600, 550, 650],
        color: '#60A5FA', // Blue
      },
      {
        name: 'Actual Generation',
        data: [300, 500, 450, 600],
        color: '#EF4444', // Red
      },
    ],
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} kWh</b><br/>',
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

  // Active Power chart options
  const activePowerOptions = {
    title: {
      text: 'Active Power (kW)',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
      title: {
        text: 'Time of Day',
      },
    },
    yAxis: {
      title: {
        text: 'Power (kW)',
      },
    },
    series: [
      {
        name: 'Active Power',
        data: [2.1, 2.3, 2.5, 2.7, 2.9, 3.0, 2.8, 2.6],
        color: '#4F46E5', // Indigo
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} kW</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  // Wind Speed chart options
  const windSpeedOptions = {
    title: {
      text: 'Wind Speed (m/s)',
    },
    chart: {
      type: 'line',
    },
    xAxis: {
      categories: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
      title: {
        text: 'Time of Day',
      },
    },
    yAxis: {
      title: {
        text: 'Wind Speed (m/s)',
      },
    },
    series: [
      {
        name: 'Wind Speed',
        data: [3.2, 4.1, 5.5, 6.2, 5.8, 6.0, 5.5, 4.9],
        color: '#D97706', // Amber
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} m/s</b>',
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  return (
    <div style={{ padding: '20px' }}>
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800">Renewable Energy Overview</h1>
            <p className="text-gray-600 mt-2">Monitor various aspects of renewable energy data</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            <div style={{ flex: '1 1 30%', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
              <h4>Active Power Summary</h4>
              <p>Total Active Power: <strong>10 kW</strong></p>
            </div>
            <div style={{ flex: '1 1 30%', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
              <h4>Wind Speed Summary</h4>
              <p>Average Wind Speed: <strong>4.5 m/s</strong></p>
            </div>
            <div style={{ flex: '1 1 30%', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
              <h4>Energy Generation Summary</h4>
              <p>Total Solar Generation: <strong>300 kWh</strong></p>
            </div>
          </div>
          </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={solarDailyDataOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={inverterPowerOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={expectedVsActualOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={rooftopSolarOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={phaseWiseGenerationOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={expectedVsActualPhaseWiseOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={activePowerOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <HighchartsReact highcharts={Highcharts} options={windSpeedOptions} />
      </div>
      </div>
  );
};

export default RenewableEnergy;
