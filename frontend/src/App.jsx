import React, { useState, useEffect } from 'react';
import InvoiceUploader from './components/InvoiceUploader';
import InvoiceForm from './components/InvoiceForm';
import SummaryCards from './components/SummaryCards';
import CategoryPieChart from './components/CategoryPieChart';
import CategoryBarChart from './components/CategoryBarChart';
import InvoiceTable from './components/InvoiceTable';
import PredictionChart from './components/PredictionChart';
import { invoiceService, dashboardService } from './services/api';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const fetchData = async () => {
    try {
      const invRes = await invoiceService.getAll();
      setInvoices(invRes.data.data);
      const statRes = await dashboardService.getStats();
      setStats(statRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSuccess = (data) => {
    setExtractedData(data);
    setEditingInvoice(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingInvoice) {
        await invoiceService.update(editingInvoice._id, formData);
      } else {
        await invoiceService.create(formData);
      }
      setExtractedData(null);
      setEditingInvoice(null);
      fetchData();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setExtractedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleCancel = () => {
    setExtractedData(null);
    setEditingInvoice(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800">Invoice Expense Tracker</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {(!extractedData && !editingInvoice) ? (
              <InvoiceUploader onUploadSuccess={handleUploadSuccess} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4">{editingInvoice ? 'Edit Invoice' : 'Confirm Invoice Details'}</h2>
                <InvoiceForm 
                  initialData={editingInvoice || extractedData} 
                  onSubmit={handleFormSubmit} 
                  onCancel={handleCancel}
                />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {stats && <SummaryCards stats={stats} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stats && Object.keys(stats.categoryStats || {}).length > 0 && (
                <>
                  <CategoryPieChart categoryStats={stats.categoryStats} />
                  <CategoryBarChart categoryStats={stats.categoryStats} />
                </>
              )}
            </div>

            {stats && stats.trendData && (
              <PredictionChart trendData={stats.trendData} dominantCurrency={stats.dominantCurrency} />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">All Invoices</h2>
          <InvoiceTable invoices={invoices} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default App;
