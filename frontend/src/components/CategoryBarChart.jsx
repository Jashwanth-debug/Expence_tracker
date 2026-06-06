import React from 'react';
import { Bar } from 'react-chartjs-2';

const bgColors = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'
];

const CategoryBarChart = ({ categoryStats }) => {
  const labels = Object.keys(categoryStats);
  const dataValues = Object.values(categoryStats);

  const data = {
    labels,
    datasets: [
      {
        label: 'Amount Spent',
        data: dataValues,
        backgroundColor: bgColors.slice(0, labels.length),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4 text-center">Expenses by Category (Bar)</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryBarChart;
