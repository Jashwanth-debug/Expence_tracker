const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  vendor: {
    type: String,
    default: 'Unknown Vendor'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  currency: {
    type: String,
    default: '$'
  },
  date: {
    type: Date,
    default: Date.now
  },
  rawText: {
    type: String
  },
  imagePath: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
