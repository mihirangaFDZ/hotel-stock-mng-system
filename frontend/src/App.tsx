import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import InventoryDash from './pages/inventory/inventory-dash.tsx';
import AddItem from './pages/inventory/add-item.tsx';
import AllProducts from './pages/inventory/all-products.tsx';
import ShoppingList from './pages/smart-shopping-list/shopping-list.tsx';
import PurchaseSpending from './pages/smart-shopping-list/purchase-spending.tsx';
import Reports from './pages/smart-shopping-list/purchase-budget-reports.tsx';
import UpdateItem from './pages/inventory/update-inventory-item.tsx';
import { ToastContainer } from 'react-toastify';
import Breadcrumb from './components/Breadcrumb.tsx';
import LowStockItems from './pages/inventory/LowStockItems.tsx';
import Categories from './pages/inventory/Categories.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar /> 
        <ToastContainer position="top-right" autoClose={3000} />
        <Breadcrumb />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/inventory-dash' element={<InventoryDash />} />
            <Route path='/add-item' element={<AddItem />} />
            <Route path='/all-products' element={<AllProducts />} />
            <Route path='/shopping-list' element={<ShoppingList />} />
            <Route path='/purchase-spending' element={<PurchaseSpending />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/update-item/:id' element={<UpdateItem/>} />
            <Route path='/low-stock' element={<LowStockItems />} />
            <Route path='/categories' element={<Categories />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;