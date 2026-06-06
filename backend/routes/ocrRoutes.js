const express = require('express');
const router = express.Router();
const multer = require('multer');
const ocrController = require('../controllers/ocrController');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('invoice'), ocrController.extractText);

module.exports = router;
