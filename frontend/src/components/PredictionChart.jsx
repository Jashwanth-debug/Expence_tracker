import React from 'react';
import { Line } from 'react-chartjs-2';

const PredictionChart = ({ trendData, dominantCurrency = '$' }) => {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500 py-12">
        Not enough data for supervised learning predictions. Upload invoices to generate trend line.
      </div>
    );
  }

  const labels = trendData.map(d => d.date);
  const actualData = trendData.map(d => d.actual);
  const predictedData = trendData.map(d => d.predicted);

  const data = {
    labels,
    datasets: [
      {
        label: `Actual Daily Spend (${dominantCurrency})`,
        data: actualData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.2,
        fill: true,
      },
      {
        label: `ML Supervised Trend (${dominantCurrency})`,
        data: predictedData,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4 text-center">Supervised Learning Trend & Prediction</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PredictionChart;
