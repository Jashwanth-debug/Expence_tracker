exports.parseInvoiceData = (text) => {
  const lowerText = text.toLowerCase();
  
  // Try to parse vendor name (basic heuristics)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let vendor = lines[0] || 'Unknown Vendor';
  if (vendor.length < 3 && lines.length > 1) {
    vendor = lines[1];
  }

  // Try to parse amount (looking for numbers with decimals often near 'total')
  let amount = 0;
  const totalMatch = lowerText.match(/total[\s:=-]*(\d+[\.,]\d{2})/i) || lowerText.match(/(?:rs\.?|inr|\$|₹)\s*(\d+[\.,]\d{2})/i);
  if (totalMatch && totalMatch[1]) {
    amount = parseFloat(totalMatch[1].replace(',', '.'));
  } else {
    // Just find the largest number with a decimal
    const matches = lowerText.match(/\d+\.\d{2}/g);
    if (matches) {
      const numbers = matches.map(n => parseFloat(n));
      amount = Math.max(...numbers);
    }
  }

  // Try to parse date
  let date = new Date();
  // match simple dates like DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const dateMatch = lowerText.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/) || lowerText.match(/\d{4}[\/\-]\d{2}[\/\-]\d{2}/);
  if (dateMatch) {
    const parsedDate = new Date(dateMatch[0]);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  // Determine Category based on keywords
  const categories = {
    Food: ['restaurant', 'cafe', 'kfc', 'mcdonalds', 'dominos', 'swiggy', 'zomato'],
    Travel: ['uber', 'ola', 'irctc', 'fuel', 'petrol', 'diesel', 'bus', 'train'],
    Shopping: ['amazon', 'flipkart', 'myntra', 'reliance trends'],
    Utilities: ['electricity', 'water', 'internet', 'wifi', 'recharge'],
    Healthcare: ['pharmacy', 'apollo', 'hospital', 'medical'],
    Entertainment: ['movie', 'netflix', 'spotify', 'bookmyshow']
  };

  let detectedCategory = 'Others';
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedCategory = cat;
      break;
    }
  }

  return {
    vendor,
    amount,
    date,
    category: detectedCategory
  };
};
