const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { extractDetailsFromText } = require('../util/extractReceiptData');

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

router.post('/extract-receipt', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported' });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const parsed = extractDetailsFromText(text);

    fs.unlinkSync(filePath); // Cleanup

    if (!parsed.amount) {
      return res.status(400).json({ error: 'Amount not detected from PDF' });
    }

    res.json({ text, ...parsed });
  } catch (err) {
    console.error('❌ PDF Parsing Error:', err);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

module.exports = router;
