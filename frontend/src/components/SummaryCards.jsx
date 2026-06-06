import React from 'react';

const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <p className="text-sm text-gray-500 uppercase font-semibold">Total Invoices</p>
        <p className="text-2xl font-bold text-gray-800">{stats.totalInvoices || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <p className="text-sm text-gray-500 uppercase font-semibold">Total Spent</p>
        <p className="text-2xl font-bold text-gray-800">
          {stats.dominantCurrency || '$'}{stats.totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
        <p className="text-sm text-gray-500 uppercase font-semibold">Average Bill</p>
        <p className="text-2xl font-bold text-gray-800">
          {stats.dominantCurrency || '$'}{Number(stats.averageAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
        <p className="text-sm text-gray-500 uppercase font-semibold">Top Category</p>
        <p className="text-2xl font-bold text-gray-800 truncate">{stats.highestCategory || 'N/A'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
        <p className="text-sm text-gray-500 uppercase font-semibold">ML 30-Day Forecast</p>
        <p className="text-2xl font-bold text-indigo-600 truncate">
          {stats.dominantCurrency || '$'}{Number(stats.predictedNextMonth || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
