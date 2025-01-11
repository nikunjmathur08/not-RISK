import ApplianceCard from "../components/ApplianceCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <div className="mx-4">
        <Navbar />
        <p className="pl-3 text-xl font-bold">your appliances</p>
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
      <Footer />
    </div>
  );
}

export default HomePage;
