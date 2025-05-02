import React, { useState, useEffect, useMemo } from 'react';
import { Download, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PurchaseHistoryAnalysis from '../../components/PurchaseHistoryAnalysis';

interface SpendingData {
  date: string;
  amount: number;
  department: string;
  category: string;
  itemName: string;
  supplier: string;
}

const PurchaseSpendingPage: React.FC = () => {
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [department, setDepartment] = useState('all');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchSpendingData();
  }, [dateRange, department]);

  const fetchSpendingData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(`http://localhost:8070/api/inventory/purchase-spending?range=${dateRange}&department=${department}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setSpendingData(data.length ? data : [
        { date: '2025-04-01', amount: 5000, department: 'Kitchen', category: 'Food', itemName: 'Instant Noodles', supplier: 'Supplier A' },
        { date: '2025-04-05', amount: 3000, department: 'Housekeeping', category: 'Cleaning', itemName: 'Floor Cleaner', supplier: 'Supplier B' },
        { date: '2025-04-10', amount: 4500, department: 'Maintenance', category: 'Tools', itemName: 'Electric Kettle', supplier: 'Supplier C' },
        { date: '2025-04-15', amount: 2000, department: 'Housekeeping', category: 'Household', itemName: 'Toilet Paper Rolls', supplier: 'Supplier D' },
        { date: '2025-04-20', amount: 6000, department: 'Kitchen', category: 'Food', itemName: 'Cooking Oil', supplier: 'Supplier E' },
      ]);
    } catch (error) {
      console.error('Error fetching spending data:', error);
      setSpendingData([
        { date: '2025-04-01', amount: 5000, department: 'Kitchen', category: 'Food', itemName: 'Instant Noodles', supplier: 'Supplier A' },
        { date: '2025-04-05', amount: 3000, department: 'Housekeeping', category: 'Cleaning', itemName: 'Floor Cleaner', supplier: 'Supplier B' },
        { date: '2025-04-10', amount: 4500, department: 'Maintenance', category: 'Tools', itemName: 'Electric Kettle', supplier: 'Supplier C' },
        { date: '2025-04-15', amount: 2000, department: 'Housekeeping', category: 'Household', itemName: 'Toilet Paper Rolls', supplier: 'Supplier D' },
        { date: '2025-04-20', amount: 6000, department: 'Kitchen', category: 'Food', itemName: 'Cooking Oil', supplier: 'Supplier E' },
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  // Memoized calculations for report data
  const reportData = useMemo(() => {
    const validSpendingData = spendingData.filter(item => item.amount > 0);
    const totalSpending = validSpendingData.reduce((sum, item) => sum + item.amount, 0);
    const departmentTotals = validSpendingData.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + item.amount;
      return acc;
    }, {} as { [key: string]: number});

    const monthlyTotals = validSpendingData.reduce((acc, item) => {
      const monthYear = format(new Date(item.date), 'MMMM yyyy');
      acc[monthYear] = (acc[monthYear] || 0) + item.amount;
      return acc;
    }, {} as { [key: string]: number});

    const sortedItems = [...validSpendingData].sort((a, b) => b.amount - a.amount).slice(0, 10);

    return { validSpendingData, totalSpending, departmentTotals, monthlyTotals, sortedItems };
  }, [spendingData]);

  const mockUsageTrends = [
    { department: 'Kitchen', avgUsageIntensity: 0.8 },
    { department: 'Housekeeping', avgUsageIntensity: 0.68 },
    { department: 'Maintenance', avgUsageIntensity: 0.75 },
  ];

  const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="mb-6 border rounded-lg shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 bg-gray-100 text-left text-lg font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
        >
          <span>{title}</span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isOpen && <div className="p-4 bg-white">{children}</div>}
      </div>
    );
  };

  const generateReport = () => {
    setLoadingReport(true);
    setTimeout(() => {
      setShowReport(true);
      setLoadingReport(false);
    }, 500); // Simulate loading delay
  };

  const closeReport = () => {
    setShowReport(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    let yOffset = margin;

    // Title
    doc.setFontSize(20);
    doc.text('Purchase Spending Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 15;

    // Report Metadata
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Period: ${dateRange === 'month' ? 'Last Month' : dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Department: ${department === 'all' ? 'All Departments' : department}`, margin, yOffset);
    yOffset += 20;

    // Executive Summary
    if (reportData.totalSpending > 0) {
      doc.setFontSize(16);
      doc.text('Executive Summary', margin, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      doc.text(`Total Spending: LKR ${reportData.totalSpending.toLocaleString()}`, margin, yOffset);
      yOffset += 10;
      doc.text(`Number of Transactions: ${reportData.validSpendingData.length}`, margin, yOffset);
      yOffset += 10;
      doc.text(`Average Transaction Value: LKR ${(reportData.totalSpending / reportData.validSpendingData.length || 0).toLocaleString()}`, margin, yOffset);
      yOffset += 20;
    }

    // Department-wise Spending Analysis
    if (Object.keys(reportData.departmentTotals).length > 0 && reportData.totalSpending > 0) {
      doc.setFontSize(16);
      doc.text('Department-wise Spending Analysis', margin, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Department', 'Total Spending (LKR)', 'Percentage']],
        body: [
          ...Object.entries(reportData.departmentTotals).map(([dept, amount]) => [
            dept,
            amount.toLocaleString(),
            `${((amount / reportData.totalSpending) * 100).toFixed(2)}%`
          ]),
          ['Total', reportData.totalSpending.toLocaleString(), '100%']
        ],
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [66, 103, 178], textColor: [255, 255, 255] },
      });
      yOffset = doc.autoTable.previous.finalY + 10;
    }

    // Monthly Spending Trends
    if (Object.keys(reportData.monthlyTotals).length > 0) {
      doc.setFontSize(16);
      doc.text('Monthly Spending Trends', margin, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Month', 'Total Spending (LKR)']],
        body: Object.entries(reportData.monthlyTotals).map(([month, amount]) => [month, amount.toLocaleString()]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [66, 103, 178], textColor: [255, 255, 255] },
      });
      yOffset = doc.autoTable.previous.finalY + 10;
    }

    // Top 10 Highest Spending Items
    if (reportData.sortedItems.length > 0) {
      doc.setFontSize(16);
      doc.text('Top 10 Highest Spending Items', margin, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Item', 'Amount (LKR)']],
        body: reportData.sortedItems.map(item => [item.itemName, item.amount.toLocaleString()]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [66, 103, 178], textColor: [255, 255, 255] },
      });
      yOffset = doc.autoTable.previous.finalY + 10;
    }

    // Purchase History Details
    if (reportData.validSpendingData.length > 0) {
      doc.setFontSize(16);
      doc.text('Purchase History Details', margin, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Date', 'Item', 'Amount (LKR)']],
        body: reportData.validSpendingData.map(item => [
          format(new Date(item.date), 'MMM dd, yyyy'),
          item.itemName,
          item.amount.toLocaleString()
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [66, 103, 178], textColor: [255, 255, 255] },
      });
      yOffset = doc.autoTable.previous.finalY + 10;
    }

    // Average Usage Intensity by Department
    if (mockUsageTrends.length > 0) {
      doc.setFontSize(16);
      doc.text('Average Usage Intensity by Department', margin, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Department', 'Average Usage Intensity']],
        body: mockUsageTrends.map(trend => [trend.department, trend.avgUsageIntensity.toFixed(2)]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [66, 103, 178], textColor: [255, 255, 255] },
      });
    }

    // Convert to Blob and trigger download
    try {
      const pdfBlob = doc.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Purchase_Spending_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating or downloading PDF:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          
      
          
          <button
            onClick={generateReport}
            className="inline-flex px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loadingData || loadingReport}
          >
            {loadingReport ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {loadingData && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}

      {!loadingData && <PurchaseHistoryAnalysis />}

      {showReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-indigo-600">Purchase Spending Report</h2>
              <div>
                <button
                  onClick={downloadPDF}
                  className="mr-4 text-indigo-600 hover:text-indigo-800 focus:outline-none font-semibold"
                >
                  Download PDF
                </button>
                <button
                  onClick={closeReport}
                  className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none font-semibold"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={closeReport}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p><strong>Generated on:</strong> {format(new Date(), 'MMMM dd, yyyy')}</p>
              <p><strong>Period:</strong> {dateRange === 'month' ? 'Last Month' : dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}</p>
              <p><strong>Department:</strong> {department === 'all' ? 'All Departments' : department}</p>
            </div>

            <ReportSection title="Executive Summary">
              {reportData.totalSpending > 0 && (
                <div className="p-4 border rounded-lg bg-white space-y-2">
                  <p><strong>Total Spending:</strong> LKR {reportData.totalSpending.toLocaleString()}</p>
                  <p><strong>Number of Transactions:</strong> {reportData.validSpendingData.length}</p>
                  <p><strong>Average Transaction Value:</strong> LKR {(reportData.totalSpending / reportData.validSpendingData.length || 0).toLocaleString()}</p>
                </div>
              )}
            </ReportSection>

            <ReportSection title="Department-wise Spending Analysis">
              {Object.keys(reportData.departmentTotals).length > 0 && reportData.totalSpending > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spending (LKR)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reportData.departmentTotals).map(([dept, amount]) => (
                      <tr key={dept}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((amount / reportData.totalSpending) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reportData.totalSpending.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </ReportSection>

            <ReportSection title="Monthly Spending Trends">
              {Object.keys(reportData.monthlyTotals).length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spending (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reportData.monthlyTotals).map(([month, amount]) => (
                      <tr key={month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ReportSection>

            <ReportSection title="Top 10 Highest Spending Items">
              {reportData.sortedItems.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.sortedItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ReportSection>

            <ReportSection title="Purchase History Details">
              {reportData.validSpendingData.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.validSpendingData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(item.date), 'MMM dd, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ReportSection>

            <ReportSection title="Average Usage Intensity by Department">
              {mockUsageTrends.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Usage Intensity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsageTrends.map((trend, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trend.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trend.avgUsageIntensity.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ReportSection>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseSpendingPage;