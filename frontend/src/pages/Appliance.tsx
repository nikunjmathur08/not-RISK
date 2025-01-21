import ApplianceCard from "../components/ApplianceCard";
import SearchBox from "../components/SearchBox";
import Sidebar from "../components/Sidebar";

function Appliance() {
  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 ml-56 overflow-auto">
        <div className="p-6">
          <div className="max-w-64">
            <SearchBox />
          </div>
          <p className="my-8 text-3xl font-semibold">your appliances</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ApplianceCard id="1" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="2" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="3" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="4" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="5" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard id="6" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
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