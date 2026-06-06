const Invoice = require('../models/Invoice');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json({ success: true, data: savedInvoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single invoice
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
