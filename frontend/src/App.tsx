
import './App.css'
import Sidebar from './components/Sidebar'
import AddProduct from './pages/AddProduct'
import AddReceipt from './pages/AddReceipt'
import Appliance from './pages/Appliance'
import ApplianceDetails from './pages/ApplianceDetails'
import HomePage from './pages/HomePage'

function App() {

  return (
    <>
      {/* <Sidebar /> */}
      {/* <HomePage /> */}
      {/* <Appliance /> */}
      {/* <ApplianceDetails applianceName='Haier Refrigerator' purchaseDate='November 2024'/> */}
      {/* <AddProduct /> */}
      <AddReceipt title="Haier Refrigerator"/>
    </>
  )
}

export default App
