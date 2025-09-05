import React from "react";
import mware_g from "../sections/pictures/mware4.png";
import mware_l1 from "../sections/pictures/mware5.png";
import mware_l2 from "../sections/pictures/mware6.png";
import mware_l3 from "../sections/pictures/mware7.png";
import mware_l4 from "../sections/pictures/mware8.png";
import mware_t from "../sections/pictures/mware9.png";
import scale from "../sections/pictures/Daylight_scale.png";


const DaylightFloorPlanAnalysis = () => {
  const floorPlans = [
    { title: "GROUND LEVEL", image: mware_g },
    { title: "LEVEL 1", image: mware_l1 },
    { title: "LEVEL 2", image: mware_l2 },
    { title: "LEVEL 3", image: mware_l3 },
    { title: "LEVEL 4", image: mware_l4 },
    { title: "TERRACE", image: mware_t },
  ];

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Daylight Factor Floor Plan Analysis</h1>
        <h2 className="text-lg font-medium mt-2">PLOT C-49</h2>
      </div>

      {/* Floor Plan Images in a Row */}
      <div className="flex justify-between mb-6 flex-wrap">
        {floorPlans.map((plan) => (
          <div key={plan.title} className="flex flex-col items-center w-1/6 p-2">
            <img src={plan.image} alt={plan.title} className="w-full h-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2 whitespace-nowrap">{plan.title}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center width-[100%]">
        <img src={scale} alt="scale" className="md:w-[40%] xl:w-[37%]"/>
      </div>
    </div>
  );
};

export default DaylightFloorPlanAnalysis;