
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddProduct from './pages/AddProduct'
import AddReceipt from './pages/AddReceipt'
import Appliance from './pages/Appliance'
import ApplianceDetails from './pages/ApplianceDetails'
import HomePage from './pages/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Error from './pages/Error'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home' element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path='/appliances' element={<PrivateRoute><Appliance /></PrivateRoute>} />
        <Route path='/appliances/:id' element={<PrivateRoute><ApplianceDetails /></PrivateRoute>} />
        <Route path='/error' element={<Error />} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='/add-product' element={<PrivateRoute><AddProduct /></PrivateRoute>} />
        <Route path='/add-receipt' element={<PrivateRoute><AddReceipt /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
