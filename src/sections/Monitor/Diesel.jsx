import diesel from "../../sections/pictures/diesel.png";

export default function Diesel() {
  return (
    <div className="bg-gray-100 p-5">
      
      <div className="grid grid-cols-2 gap-6">
        {[{ id: 1, status: false }, { id: 2, status: true }].map((gen) => (
          <div key={gen.id} className="bg-white shadow-md rounded-lg p-6 flex w-full flex-col">
            {/* Title - On top */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700">DG {gen.id}</h3>
              <div className="flex items-center">
                <span className={`text-lg font-semibold ${gen.status ? "text-green-500" : "text-red-500"}`}>
                  {gen.status ? "On" : "Off"}
                </span>
                <div className={`w-4 h-4 ml-3 rounded-full ${gen.status ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
            </div>

            {/* Bottom - Image and Description */}
            <div className="flex-grow flex flex-col items-center justify-end">
              {/* Image */}
              <div className="w-full flex justify-center mb-4">
                <img src={diesel} alt={`DG ${gen.id}`} className="w-full h-auto object-contain rounded-md" />
              </div>

              {/* Generator Information */}
              <div className="w-full grid grid-cols-3 gap-4">
                <div>
                  <p className="text-lg font-semibold">24.5 Hrs</p>
                  <p className="text-sm text-gray-500">Lifetime Runhour</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">35 Litres</p>
                  <p className="text-sm text-gray-500">Estimated Runhour</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Last Fuel Filled</p>
                  <p className="text-sm text-gray-500">(Filled on 25th Oct, 2024)</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
