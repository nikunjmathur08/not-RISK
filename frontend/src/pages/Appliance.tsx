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
          <p className="mt-4 text-xl font-bold">your appliances</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
            <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Appliance;