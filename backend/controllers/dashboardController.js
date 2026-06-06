const Invoice = require('../models/Invoice');

exports.getDashboardStats = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: 1 });

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const averageAmount = totalInvoices > 0 ? (totalAmount / totalInvoices).toFixed(2) : 0;

    // Calculate spending per category
    const categoryStats = {};
    invoices.forEach(inv => {
      const cat = inv.category || 'Others';
      if (!categoryStats[cat]) categoryStats[cat] = 0;
      categoryStats[cat] += inv.amount || 0;
    });

    let highestCategory = 'N/A';
    let highestAmount = 0;

    for (const [cat, amt] of Object.entries(categoryStats)) {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    }

    // ==========================================
    // SUPERVISED LEARNING: LINEAR REGRESSION
    // ==========================================
    let predictedNextMonth = 0;
    const trendData = [];

    if (invoices.length > 0) {
      // Group expenses by Date string (YYYY-MM-DD)
      const dailyMap = {};
      invoices.forEach(inv => {
        if (!inv.date) return;
        const dObj = new Date(inv.date);
        if (isNaN(dObj.getTime())) return;
        const dateStr = dObj.toISOString().split('T')[0];
        if (!dailyMap[dateStr]) dailyMap[dateStr] = 0;
        dailyMap[dateStr] += inv.amount || 0;
      });

      const sortedDates = Object.keys(dailyMap).sort();
      if (sortedDates.length > 0) {
        const startDate = new Date(sortedDates[0]);

        const X = [];
        const Y = [];
        sortedDates.forEach(dateStr => {
          const currentDate = new Date(dateStr);
          const diffTime = Math.abs(currentDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          X.push(diffDays);
          Y.push(dailyMap[dateStr]);
        });

        const n = X.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        for (let i = 0; i < n; i++) {
          sumX += X[i];
          sumY += Y[i];
          sumXY += X[i] * Y[i];
          sumXX += X[i] * X[i];
        }

        let m = 0; // slope
        let b = sumY / n || 0; // intercept

        if (n > 1) {
          const denominator = (n * sumXX - sumX * sumX);
          if (denominator !== 0) {
            m = (n * sumXY - sumX * sumY) / denominator;
            b = (sumY - m * sumX) / n;
          }
        }

        // Populate trend data for graph representation
        for (let i = 0; i < n; i++) {
          const actual = Y[i];
          const predicted = parseFloat((m * X[i] + b).toFixed(2));
          trendData.push({
            date: sortedDates[i],
            actual,
            predicted: predicted < 0 ? 0 : predicted
          });
        }

        // Predict next 30 days total based on daily average trend
        const lastDayIndex = n > 0 ? X[n - 1] : 0;
        let next30DaysTotal = 0;
        for (let d = 1; d <= 30; d++) {
          const futureDay = lastDayIndex + d;
          let predDay = m * futureDay + b;
          if (predDay < 0) predDay = 0;
          next30DaysTotal += predDay;
        }
        predictedNextMonth = parseFloat(next30DaysTotal.toFixed(2));
      }
    }

    // Calculate dominant currency
    const currencyCounts = {};
    invoices.forEach(inv => {
      const cur = inv.currency || '$';
      currencyCounts[cur] = (currencyCounts[cur] || 0) + 1;
    });
    let dominantCurrency = '$';
    let maxCurCount = 0;
    for (const [cur, count] of Object.entries(currencyCounts)) {
      if (count > maxCurCount) {
        maxCurCount = count;
        dominantCurrency = cur;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalInvoices,
        totalAmount,
        averageAmount,
        highestCategory,
        categoryStats,
        predictedNextMonth,
        trendData,
        dominantCurrency
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
