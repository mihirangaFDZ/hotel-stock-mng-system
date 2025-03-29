import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import InventoryDash from './pages/inventory/inventory-dash.tsx';
import AddItem from './pages/inventory/add-item.tsx';
import AllProducts from './pages/inventory/all-products.tsx';
import ShoppingList from './pages/smart-shopping-list/shopping-list.tsx';
import PurchaseSpending from './pages/smart-shopping-list/purchase-spending.tsx';
import Reports from './pages/smart-shopping-list/purchase-budget-reports.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/inventory-dash' element={<InventoryDash/>}/>
            <Route path='/add-item' element={<AddItem/>}/>
            <Route path='/all-products' element={<AllProducts/>}/>
            <Route path='/shopping-list' element={<ShoppingList/>}/>
            <Route path='/purchase-spending' element={<PurchaseSpending/>}/>
            <Route path='/reports' element={<Reports/>}/>


          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;