import React from 'react';

const InvoiceTable = ({ invoices, onEdit, onDelete }) => {
  if (!invoices || invoices.length === 0) {
    return <p className="text-gray-500 py-4 text-center">No invoices found. Upload one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-left text-sm font-light">
        <thead className="border-b bg-gray-50 font-medium">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Vendor</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id} className="border-b hover:bg-gray-50 transition">
              <td className="whitespace-nowrap px-6 py-4">
                {new Date(inv.date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">{inv.vendor}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {inv.category}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right font-medium">
                {inv.currency || '$'}{inv.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center space-x-2">
                <button 
                  onClick={() => onEdit(inv)}
                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(inv._id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
