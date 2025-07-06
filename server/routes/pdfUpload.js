const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const { extractCategoryFromNote } = require('../util/extractReceiptData');

// 🔥 Route: Upload PDF & extract transactions
router.post('/upload-pdf-transactions', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const lines = pdfData.text.split('\n').map(line => line.trim());

    const parsedEntries = [];

    for (let line of lines) {
      // 👇 Match lines like: 01/01/2024 Amazon 1000 Expense
      const match = line.match(/^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\d,]+(?:\.\d{1,2})?)\s+(Income|Expense)/i);
      if (match) {
        const [, date, note, amount, type] = match;
        parsedEntries.push({
          date: new Date(date).toISOString().slice(0, 10),
          note,
          amount: parseFloat(amount.replace(/,/g, '')),
          type: type.toLowerCase(),
          category: extractCategoryFromNote(note),
        });
      }
    }

    fs.unlinkSync(filePath); // 🧹 delete file after use

    res.json({ message: '✅ Transactions extracted', count: parsedEntries.length, entries: parsedEntries });
  } catch (err) {
    console.error('❌ PDF parsing failed:', err);
    res.status(500).json({ error: 'PDF processing error' });
  }
});

module.exports = router;
