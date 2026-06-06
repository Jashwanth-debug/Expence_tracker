import React from 'react';
import { Pie } from 'react-chartjs-2';

const bgColors = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'
];

const CategoryPieChart = ({ categoryStats }) => {
  const labels = Object.keys(categoryStats);
  const dataValues = Object.values(categoryStats);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: bgColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4 text-center">Expenses by Category (Pie)</h3>
      <div className="h-64 flex justify-center">
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
