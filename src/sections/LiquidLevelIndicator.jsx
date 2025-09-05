import React from 'react';

const LiquidLevelIndicator = ({ level }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold">Liquid Level</h3>
      <p className="text-xl font-bold">{level}%</p>
    </div>
  );
};

export default LiquidLevelIndicator;
