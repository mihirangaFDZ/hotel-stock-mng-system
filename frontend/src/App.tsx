import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import InventoryDash from './pages/inventory/inventory-dash.tsx';
import AddItem from './pages/inventory/add-item.tsx';
import AllProducts from './pages/inventory/all-products.tsx';
import ShoppingList from './pages/smart-shopping-list/shopping-list.tsx';
import PushaseSpending from './pages/smart-shopping-list/purchase-spending.tsx';
import Reports from './pages/smart-shopping-list/purchase-budget-reports.tsx';
import Login from './pages/user-management/login.tsx';
import Register from './pages/user-management/register.tsx';
import StaffManagement from './pages/user-management/StaffManagement.tsx';
import Wastemanagement from './pages/user-management/waste-management.tsx';





function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/waste-management' element={<Wastemanagement/>}/>
            
            <Route path='/inventory-dash' element={<InventoryDash/>}/>
            <Route path='/add-item' element={<AddItem/>}/>
            <Route path='/all-products' element={<AllProducts/>}/>
            <Route path='/shopping-list' element={<ShoppingList/>}/>
            <Route path='/pushase-spending' element={<PushaseSpending/>}/>
            <Route path='/reports' element={<Reports/>}/>
            <Route path='/waste-management' element={<Wastemanagement/>}/>
            <Route path="/staff-management" element={<ProtectedRoute component={StaffManagement} />} />


          </Routes>
        </div>
      </div>
    </Router>
  );
}

const ProtectedRoute: React.FC<{ component: React.FC }> = ({ component: Component }) => {
  const storedAuth = localStorage.getItem('authState');
  const authState = storedAuth ? JSON.parse(storedAuth) : { isAuthenticated: false, currentUser: null };
  
  if (!authState.isAuthenticated || !['admin', 'manager'].includes(authState.currentUser?.role)) {
    return <Navigate to="/" />;
  }
  
  return <Component />;
};




export default App;