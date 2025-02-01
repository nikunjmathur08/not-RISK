import ApplianceCard from "../components/ApplianceCard";
import SearchBox from "../components/SearchBox";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getAppliances } from "../utils/api";

function Appliance() {
  const [appliances, setAppliances] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appliances.map((appliance) => (
              <ApplianceCard
                key={appliance.id}
                id={appliance.id}
                applianceName={appliance.name}
                applianceImg="/temp/Refrigerator.jpg"
                companyName=""
              />
            ))}
            <ApplianceCard id="7" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="8" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="9" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="10" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="11" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="12" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="13" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="14" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="15" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="16" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="17" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Appliance;