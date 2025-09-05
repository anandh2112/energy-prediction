import React from 'react';
import lux_img_pt2 from "../sections/pictures/mware11.png";

const LuxAnalysisPt2 = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg justify-around gap-[20px] shadow-md">
        <h1 className="text-2xl font-bold text-center">Sectional Analysis</h1>

        <img
          src={lux_img_pt2}
          alt="LUX Analysis"
          className="w-[auto] h-[70%] pt-3"
        />
    </div>
  );
};

export default LuxAnalysisPt2;
