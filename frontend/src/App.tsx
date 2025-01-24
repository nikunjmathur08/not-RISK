
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AddProduct from './pages/AddProduct'
import AddReceipt from './pages/AddReceipt'
import Appliance from './pages/Appliance'
import ApplianceDetails from './pages/ApplianceDetails'
import HomePage from './pages/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Error from './pages/Error'
import Profile from './pages/Profile'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/appliances' element={<Appliance />} />
        <Route path='/appliances/:id' element={<ApplianceDetails />} />
        <Route path='/error' element={<Error />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/add-receipt' element={<AddReceipt />} />
      </Routes>
    </Router>
  )

  // return (
  //   <>
  //     {/* <Sidebar /> */}
  //     {/* <HomePage /> */}
  //     {/* <Appliance /> */}
  //     {/* <ApplianceDetails applianceName='Haier Refrigerator' purchaseDate='November 2024' modelNumber='21MAB204T'/> */}
  //     {/* <AddProduct /> */}
  //     {/* <AddReceipt title="Haier Refrigerator"/> */}
  //     {/* <SignInSignUp /> */}

  //   </>
  // )
}

export default App
