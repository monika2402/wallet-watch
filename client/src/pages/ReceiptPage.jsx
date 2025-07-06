import ReceiptUploader from '../components/ReceiptUploader';

const ReceiptPage = () => {
  const extractTransaction = (text) => {
    console.log('🔍 OCR Text:', text);

    // 🧠 Extract amount using regex
    const amountMatch = text.match(/(?:total|amount|subtotal)[^\d]*([\d,]+\.\d{2})/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : '';

    // 🗓️ Extract date
    const dateMatch = text.match(/\d{2}[\/.-]\d{2}[\/.-]\d{2,4}/);
    const date = dateMatch ? new Date(dateMatch[0]).toISOString().split('T')[0] : '';

    console.log({ amount, date });

    // You can auto-fill the form fields or auto-submit here
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧾 Extract Expense from Receipt</h2>
      <ReceiptUploader onExtract={extractTransaction} />
    </div>
  );
};

export default ReceiptPage;
