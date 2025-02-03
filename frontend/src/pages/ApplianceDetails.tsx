import { useNavigate, useParams } from "react-router-dom";
import Receipt from "../components/Receipt";
import { useEffect, useState } from "react";
import { getApplianceDetails, deleteAppliance } from "../utils/api";

type ApplianceProps = {
  _id: string;
  name: string;
  purchaseDate: string;
  modelNumber: string;
  productImage: {
    data: string;
    contentType: string;
  };
  receipts: Array<{
    _id: string;
    name: string;
  }>;
};

function ApplianceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appliance, setAppliance] = useState<ApplianceProps | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliance = async () => {
      try {
        setLoading(true);
        const data = await getApplianceDetails(id!);
        setAppliance(data.appliance);
        setError(null);
      } catch (err) {
        setError("Failed to load appliance details");
        navigate("/error", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppliance();
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !appliance) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error || "Appliance not found"}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteAppliance(appliance._id);
      navigate("/appliances", { replace: true });
    } catch (err) {
      setError("Failed to delete appliance");
    }
  };

  const { name: applianceName, purchaseDate, modelNumber, productImage: image, receipts } = appliance;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-6 my-8">
      <div className="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="pr-2"
        >
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-semibold text-xl">appliance details</p>
      </div>
      <div className="grid grid-cols-2">
        <img src={`data:${image.contentType};base64,${image.data}`} className="h-96 w-96 mx-44 my-20 object-cover" alt={applianceName}></img>
        <div>
          <p className="text-5xl mt-36 font-semibold">{applianceName}</p>
          <div className="flex mt-8 my-2 text-xl">
            <p className="text-gray-700 mr-1">purchase date -</p>
            <p>{formatDate(purchaseDate)}</p>
          </div>
          <div className="flex mb-8 mt-2 text-xl">
            <p className="text-gray-700 mr-1">model number -</p>
            <p>{modelNumber}</p>
          </div>
          <p className="text-xl mb-2">your receipts</p>
          {receipts.map((receipt, index) => (
            <Receipt
              key={index}
              name={receipt.name}
              receiptId={receipt._id}
              applianceId={appliance._id}
            />
          ))}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => navigate("/add-receipt", {
                state: { productId: appliance._id, productName: applianceName }
              })}
              className="bg-neutral-950 px-4 py-4 text-xl rounded-lg text-white"
            >
              add more receipts
            </button>
            <button
              onClick={handleDelete}
              className="bg-neutral-950 px-4 py-4 text-xl rounded-lg text-white"
            >
              delete product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplianceDetails;
