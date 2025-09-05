import SolarAnalysisCard from '../dcomponents/SolarAnalysisCard';
import DaylightFloorPlanAnalysis from '../dcomponents/DayLightFloor';
import LuxAnalysis from '../dcomponents/LuxAnalysis';
import DaylightFloorPlanAnalysisC50 from "../dcomponents/DayLightFloor_C50";
import DaylightFactorAnalysis from "../pcomponents/DayLightFactorAnalysis";
import Spa from "../pcomponents/Spa";
import ModelC from '../pcomponents/ModelC';

const Profile = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-5">
        <ModelC />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DaylightFactorAnalysis />
        <Spa />
      </div>
      <LuxAnalysis />
      <DaylightFloorPlanAnalysis />
      <DaylightFloorPlanAnalysisC50 />
      <SolarAnalysisCard />
    </div>
  );
};

export default Profile;
