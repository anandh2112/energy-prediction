import React from 'react'

const Edmc2 = () => {
  return (
    <div className="flex flex-1 bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-1 justify-between items-center">
        
        {/* Normal Power Load */}
        <div className="flex flex-col items-center w-1/3">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Power Load: <span className="text-blue-600">Normal</span>
          </h3>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">8,594 kWh</p>
          <p className="text-sm text-gray-600">₹52,427</p>
        </div>

        {/* Peak Power Load */}
        <div className="flex flex-col items-center w-1/3 border-l border-gray-200 pl-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Power Load: <span className="text-red-600">Peak</span>
          </h3>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">2,843 kWh</p>
          <p className="text-sm text-gray-600">₹26,117</p>
        </div>

        {/* Off-Peak Power Load */}
        <div className="flex flex-col items-center w-1/3 border-l border-gray-200 pl-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Power Load: <span className="text-orange-600">Off-Peak</span>
          </h3>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">5,301 kWh</p>
          <p className="text-sm text-gray-600">₹24,252</p>
        </div>

      </div>
    </div>
  )
}

export default Edmc2;
