import { useNavigate } from "react-router-dom";

function AddNewAppliance() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <p className="text-gray-500 text-lg mb-4">No appliances found</p>
      <button
        onClick={() => navigate('/add-product')}
        className="bg-violet-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-violet-800"
      >
        Add Your First Appliance
      </button>
    </div>
  )
}

export default AddNewAppliance;