import { useNavigate, useParams } from "react-router-dom";
import Receipt from "../components/Receipt";
import { useEffect, useState } from "react";

type ApplianceProps = {
  id: string;
  applianceName: string;
  purchaseDate: string;
  modelNumber: string;
  image: string;
};

const appliances: ApplianceProps[] = [
  {
    id: "1",
    applianceName: "Haier Refrigerator",
    purchaseDate: "2023-01-15",
    modelNumber: "UP14CY",
    image: "/temp/Refrigerator.jpg",
  },
  {
    id: "2",
    applianceName: "MacBook Air",
    purchaseDate: "2021-05-18",
    modelNumber: "A2018",
    image: "/temp/Mac.jpg",
  },
];

function ApplianceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appliance, setAppliance] = useState<ApplianceProps | null>(null);

  useEffect(() => {
    const foundAppliance = appliances.find((item) => item.id === id);
    if (!foundAppliance) {
      navigate("/error", {replace: true});
    } else {
      setAppliance(foundAppliance);
    }
  }, [id, navigate]);

  if (!appliance) {
    return null;
  }

  const { applianceName, purchaseDate, modelNumber, image } = appliance;

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
        <img src={image} className="h-96 w-96 mx-44 my-20 object-cover" alt={applianceName}></img>
        <div>
          <p className="text-5xl mt-36 font-semibold">{applianceName}</p>
          <div className="flex mt-8 my-2 text-xl">
            <p className="text-gray-700 mr-1">purchase date -</p>
            <p>{purchaseDate}</p>
          </div>
          <div className="flex mb-8 mt-2 text-xl">
            <p className="text-gray-700 mr-1">model number -</p>
            <p>{modelNumber}</p>
          </div>
          <p className="text-xl mb-2">your receipts</p>
          <Receipt name="original" />
          <Receipt name="insurance" />
          <Receipt name="service" />
          <div className="flex space-x-4 mt-8">
            <button className="bg-neutral-950 px-4 py-4 text-xl rounded-lg text-white">add more receipts</button>
            <button className="bg-neutral-950 px-4 py-4 text-xl rounded-lg text-white">delete product</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplianceDetails;
