import ApplianceCard from "../components/ApplianceCard";
import SearchBox from "../components/SearchBox";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAppliances } from "../utils/api";
import AddNewAppliance from "../components/AddNewAppliance";

function Appliance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [appliances, setAppliances] = useState<Array<{ id: string; name: string; productImage: { data: string; contentType: string } }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        setLoading(true);
        const data = await getAppliances(searchQuery);
        setAppliances(data.appliance);
        setError(null);
      } catch (err) {
        setError("Failed to load appliances");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();
  }, [searchQuery]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 ml-56 overflow-auto">
        <div className="p-6">
          <div className="max-w-64">
            <SearchBox onSearch={setSearchQuery} />
          </div>
          <p className="my-8 text-3xl font-semibold">your appliances</p>
          {appliances.length === 0 ? (
            <AddNewAppliance />
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {appliances.map((appliance, index) => (
                <ApplianceCard
                  key={`${appliance.id}-${index}`}
                  id={appliance.id}
                  applianceName={appliance.name}
                  applianceImg={`data:${appliance.productImage.contentType};base64,${appliance.productImage.data}`}
                  companyName=""
                />
              ))}            
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Appliance;