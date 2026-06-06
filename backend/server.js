const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const ocrRoutes = require('./routes/ocrRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/ocr', ocrRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
