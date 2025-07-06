export const extractDetailsFromText = (text) => {
  // 0️⃣ Normalize text
  text = text.replace(/[^ -~\n]/g, ''); // remove non-ascii
  const lines = text
    .split('\n')
    .map(line => line.trim().toLowerCase())
    .filter(Boolean);

  let amount = null;
  let category = 'Other';

  // 1️⃣ Try to match total/amount/paid lines
  for (let line of lines) {
    const match = line.match(/(total|amount|grand total|paid)\s*[:\-]?\s*(rs\.?|inr|₹|\$)?\s*([\d,]+(?:\.\d{1,2})?)/i);
    if (match) {
      amount = parseFloat(match[3].replace(/,/g, ''));
      break;
    }
  }

  // 2️⃣ Fallback: find the highest price in text
  if (!amount) {
    const prices = lines.flatMap(line =>
      [...line.matchAll(/(₹|rs\.?|inr|\$)?\s*([\d,]+(?:\.\d{1,2})?)/gi)]
    ).map(m => parseFloat(m[2].replace(/,/g, '')));
    if (prices.length) {
      amount = Math.max(...prices);
    }
  }

  // 3️⃣ Smart category inference
  const categoryKeywords = {
    Food: ['latte', 'coffee', 'restaurant', 'muffin', 'tea', 'snack', 'cafe', 'beverage'],
    Travel: ['uber', 'ola', 'auto', 'flight', 'train', 'taxi', 'bus', 'cab'],
    Shopping: ['amazon', 'flipkart', 'store', 'mall', 'purchase', 'shopping', 'groceries', 'supermarket'],
    Health: ['clinic', 'hospital', 'pharmacy', 'medicines', 'doctor', 'health'],
    Utilities: ['electricity', 'water bill', 'internet', 'recharge', 'postpaid', 'broadband', 'mobile'],
    Entertainment: ['movie', 'cinema', 'netflix', 'bookmyshow', 'hotstar'],
    Salary: ['salary', 'credited', 'income', 'monthly pay', 'payment received'],
    Investment: ['mutual fund', 'sip', 'investment', 'stock', 'shares'],
    Education: ['school', 'tuition', 'coaching', 'university', 'exam fees'],
    Rent: ['rent', 'landlord', 'lease', 'tenant']
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (lines.some(line => keywords.some(keyword => line.includes(keyword)))) {
      category = cat;
      break;
    }
  }

  return { amount, category };
};
