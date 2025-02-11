import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ApplianceCard from "../components/ApplianceCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getAppliances } from "../utils/api";
import AddNewAppliance from "../components/AddNewAppliance";

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [appliances, setAppliances] = useState<Array<{ id: string; name: string; companyName: string | null; productImage: { data: string; contentType: string } }>>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (!data || !data.user || !data.user.firstName) {
          throw new Error('Invalid user data received');
        }

        setUserName(data.user.firstName);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('Guest');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        setLoading(true);
        const data = await getAppliances("");
        setAppliances(data.appliance);
        setError(null);
      } catch (err) {
        setError("Failed to load appliances");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  }

  const handleClick = () => {
    navigate("/appliances");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow mx-4">
        <Navbar name={userName}/>
        <p className="text-2xl font-semibold my-8">your appliances</p>
        {appliances.length === 0 ? (
          <AddNewAppliance />
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {appliances.map((appliance) => (
                <ApplianceCard
                  key={appliance.id}
                  id={appliance.id}
                  applianceName={appliance.name}
                  applianceImg={`data:${appliance.productImage.contentType};base64,${appliance.productImage.data}`}
                  companyName={appliance.companyName || ""}
                />
              ))}        
            </div>
            <div className="flex justify-center mt-8 mb-10">
              <button onClick={handleClick} className="bg-violet-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-violet-800">
                load more...
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
