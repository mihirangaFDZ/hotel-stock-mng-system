import React from 'react'; // Import React for building the component
import { stockData, StockItem } from '../data/dummyData'; // Import stock data and StockItem type from dummy data file

// StockTable component: A simple, static table to display stock levels
const StockTable: React.FC = () => {
  // JSX: Returns the UI for the stock table
  return (
    // Container div with inline styling for spacing
    <div style={{ margin: '20px' }}> {/* Adds 20px margin around the table for better spacing */}
      <h2>Stock Levels</h2> {/* Heading to indicate the purpose of the table */}
      {/* Table element with inline styles for full width and collapsed borders */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}> {/* Ensures the table takes full width and borders merge */}
        {/* Table header section */}
        <thead>
          {/* Single row for column headers */}
          <tr>
            {/* Column headers with consistent styling */}
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item</th> {/* Header for item name column; border and padding for clarity */}
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th> {/* Header for quantity column */}
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Threshold</th> {/* Header for threshold column */}
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Supplier</th> {/* Header for supplier column */}
          </tr>
        </thead>
        {/* Table body section where data rows are rendered */}
        <tbody>
          {/* Map over stockData to create a row for each stock item */}
          {stockData.map((item: StockItem) => ( // Iterates through stockData array; each item is typed as StockItem
            // Table row with conditional background color
            <tr
              key={item.id} // Unique key prop required by React for list rendering; uses item ID
              style={{ background: item.quantity < item.threshold ? '#ffcccc' : '#fff' }} // Conditional styling: Light red if quantity < threshold, white otherwise
            >
              {/* Table cells for each column */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.item}</td> {/* Displays the item name */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td> {/* Displays the current quantity */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.threshold}</td> {/* Displays the minimum threshold */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.supplier}</td> {/* Displays the supplier name */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable; // Export the component for use in other parts of the app