const visionService = require('../services/visionService');

exports.extractText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const imagePath = req.file.path;
    
    // Extract structured data using Google Gemini API (Supervised Classification)
    const extractedData = await visionService.extractDataFromImage(imagePath);
    
    if (!extractedData) {
      return res.status(400).json({ message: 'Could not extract data from image.' });
    }

    res.status(200).json({
      success: true,
      data: {
        ...extractedData,
        imagePath
      }
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};
