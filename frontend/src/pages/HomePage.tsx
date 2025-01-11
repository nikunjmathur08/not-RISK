import ApplianceCard from "../components/ApplianceCard";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <div className="mx-4">
        <Navbar />
        <p className="pl-3 text-xl font-medium">your appliances</p>
        <div className="mt-10 ml-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
        </div>
        <div className="flex justify-center mt-8 mb-10">
          <button className="bg-violet-700 text-white py-2 px-6 rounded-lg shadow-lg">
            load more...
          </button>
        </div>
      </div>
      <div className="bg-blue-900 pt-16 text-center">
        <button className="bg-slate-50 rounded-lg py-4 px-6 mb-4 inline-block">add appliance</button>
        <div className="flex justify-center space-x-8 text-white font-light mb-4">
          <p>home</p>
          <p>about</p>
          <p>services</p>
          <p>FAQs</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
