const pdfParse = require('pdf-parse');

const extractTransactionsFromPDF = async (pdfBuffer) => {
  const data = await pdfParse(pdfBuffer);
  const lines = data.text.split('\n');
  const transactions = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s{2,}/); // assume 2+ spaces separate fields
    if (parts.length >= 3) {
      const [date, category, amountStr] = parts;
      const amount = parseFloat(amountStr.replace(/[^\d.]/g, ''));
      if (!isNaN(amount)) {
        transactions.push({ date, category, amount, type: 'expense' });
      }
    }
  }

  return transactions;
};

module.exports = { extractTransactionsFromPDF };
