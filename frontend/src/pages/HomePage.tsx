import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApplianceCard from "../components/ApplianceCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface DecodedToken {
  email?: string;
  name?: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.name) {
          const firstName = decoded.name.split(" ")[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleClick = () => {
    navigate("/appliances");
  }

  return (
    <div>
      <div className="mx-4">
        <Navbar name={userName}/>
        <p className="pl-4 text-xl font-bold">your appliances</p>
        <div className="mt-10 ml-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          <ApplianceCard id="1" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="2" companyName="Apple" applianceName="MacBook Air" applianceImg="/temp/Mac.jpg" />
          <ApplianceCard id="3" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="4" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="5" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="6" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="7" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
          <ApplianceCard id="8" companyName="Haier" applianceName="Haier Refrigerator" applianceImg="/temp/Refrigerator.jpg" />
        </div>
        <div className="flex justify-center mt-8 mb-10">
          <button onClick={handleClick} className="bg-violet-700 text-white py-2 px-6 rounded-lg shadow-lg">
            load more...
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
