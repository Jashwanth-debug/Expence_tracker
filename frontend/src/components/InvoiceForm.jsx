import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Others'];

const InvoiceForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    currency: '$',
    category: 'Others',
    date: new Date().toISOString().split('T')[0],
    rawText: '',
    imagePath: ''
  });

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];

      setFormData({
        vendor: initialData.vendor || '',
        amount: initialData.amount || '',
        currency: initialData.currency || '$',
        category: CATEGORIES.includes(initialData.category) ? initialData.category : 'Others',
        date: formattedDate,
        rawText: initialData.rawText || '',
        imagePath: initialData.imagePath || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
        <input 
          type="text" 
          name="vendor" 
          value={formData.vendor} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input 
            type="number" 
            step="0.01"
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
          <input 
            type="text" 
            name="currency" 
            value={formData.currency} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input 
          type="date" 
          name="date" 
          value={formData.date} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save Invoice
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
