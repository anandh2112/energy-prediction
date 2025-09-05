import img from "./SolarPanel.png";
const TwoPartitionsGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-2xl shadow-lg p-6 w-full h-[400px]">
        <div className="bg-gray-100 p-6 flex flex-col justify-center items-center rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Left Partition</h2>
          <img src={img} className="object-contain"/>
          <p className="text-gray-600 text-center">
            This section can hold content like descriptions, stats, or lists.
          </p>
        </div>
  
        <div className="bg-gray-200 p-6 flex flex-col justify-center items-center rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Right Partition</h2>
          <img src={img}/>
          <p className="text-gray-600 text-center">
            This section can hold images, charts, or extra details.
          </p>
        </div>
      </div>
    );
  };
  
  export default TwoPartitionsGrid;
  