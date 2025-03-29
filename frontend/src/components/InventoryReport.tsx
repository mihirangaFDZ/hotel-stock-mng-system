import React from 'react';
import { Download } from 'lucide-react'; // Import the Download icon

interface InventoryItem {
    _id: string;
    itemName: string;
    category: string;
    quantity: number;
    unitType: string;
    location: string;
    expiryDate?: string;
    updatedAt?: string;
}

interface InventoryReportProps {
    inventory: InventoryItem[];
}

const InventoryReport: React.FC<InventoryReportProps> = ({ inventory }) => {
    const generateReport = () => {
        // Create a new window for the report preview
        const reportWindow = window.open('', '_blank', 'width=800,height=600');

        if (!reportWindow) {
            alert('Please allow popups to preview the report.');
            return;
        }

        // Prepare the HTML content for the report
        const reportContent = `
            <html>
                <head>
                    <title>Inventory Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        .report-details {
                            margin-bottom: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                            font-weight: bold;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        .actions {
                            text-align: center;
                            margin-top: 20px;
                        }
                        button {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            borderRadius: 5px;
                            cursor: pointer;
                            margin: 0 10px;
                        }
                        button:hover {
                            background-color: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <h1>Inventory Management Report</h1>
                    <div class="report-details">
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                        <p>Total Items: ${inventory.length}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Location</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventory.map(item => `
                                <tr>
                                    <td>${item.itemName}</td>
                                    <td>${item.category}</td>
                                    <td>${item.quantity} ${item.unitType}</td>
                                    <td>${item.location}</td>
                                    <td>${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="actions">
                        <button onclick="window.print()">Download as PDF</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                </body>
            </html>
        `;

        // Write the content to the new window
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
    };

    return (
        <button
            onClick={generateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
            <Download className="h-4 w-4 mr-2" />
            <span>Export report</span>
        </button>
    );
};

export default InventoryReport;