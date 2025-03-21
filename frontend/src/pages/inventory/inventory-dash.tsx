import "./../../css/inventory.css"

import {
  Plus,
  DollarSign,
  ShoppingCart,
  XCircle,
  Tag
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

const InventoryDash = () => {



  const navigate = useNavigate();


  return (

    <div className="container mx-auto px-4 py-6 fade-in">

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
        <button
          onClick={() => navigate('/add-item')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Item</span>
        </button>
      </div>
      <div className="container mx-auto px-4 py-6 fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full" >
            {/* Card 1 */}
            <a href="/all-products">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">All Products</h2>
                <p className="text-gray-600">Details about stock 2.</p>
              </div>
            </a>

            {/* Card 2 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <DollarSign className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-semibold">Total Store Value</h2>
                <p className="text-gray-600">Details about stock 2.</p>
              </div>
            </a>

            {/* Card 3 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <XCircle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-semibold">Out of stock</h2>
                <p className="text-gray-600">Details about stock 3.</p>
              </div>
            </a>


            {/* Card 4 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <Tag className="h-8 w-8 text-yellow-600" />
                <h2 className="text-xl font-semibold">All Categories</h2>
                <p className="text-gray-600">Details about stock 4.</p>
              </div>
            </a>
          </div>
        </div>
      </div>





    </div>
  );
};

export default InventoryDash;