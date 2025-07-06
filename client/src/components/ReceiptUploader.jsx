import { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { extractDetailsFromText } from '../utils/extractReceiptData';

const ReceiptUploader = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setResult(null);
    setText('');

    try {
      let ocrText = '';

      if (selectedFile.type === 'application/pdf') {
        // Send PDF to backend for processing
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post('http://localhost:5000/api/extract-receipt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user?.token}`,
          },
        });

        ocrText = response.data.text;
      } else {
        // Process image using OCR
        const { data: { text: imageText } } = await Tesseract.recognize(selectedFile, 'eng', {
          logger: (message) => console.log(message),
        });
        ocrText = imageText;
      }

      setText(ocrText);

      const { amount, category } = extractDetailsFromText(ocrText);

      if (!amount) {
        setError('Could not detect amount from receipt. Please try a clearer image.');
        return;
      }

      const transactionEntry = {
        amount,
        category,
        type: 'expense',
        date: new Date().toISOString().slice(0, 10),
        note: 'Auto-generated from receipt',
      };

      await axios.post('http://localhost:5000/api/transactions', transactionEntry, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setResult(transactionEntry);
    } catch (error) {
      console.error('Receipt processing failed:', error);
      setError('Failed to process or save the receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="mr-3">🧾</span>
            Extract Expense from Receipt
          </h3>
      
      <div className="mb-6">
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          onChange={handleUpload}
          className="text-gray-800 w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="flex items-center text-blue-600 bg-blue-50 p-4 rounded-lg mb-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-lg">Extracting text from file...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <span className="font-medium text-lg">❌ Error:</span> 
          <span className="text-lg ml-2">{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
          <span className="font-medium text-lg">✅ Success:</span> 
          <span className="text-lg ml-2">Saved entry: ₹{result.amount} in "{result.category}"</span>
        </div>
      )}

      {text && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
            <span className="mr-3">📝</span>
            OCR Result:
          </h4>
          <pre className="text-gray-800 text-sm bg-gray-50 border border-gray-200 p-4 rounded-lg min-h-96 overflow-auto whitespace-pre-wrap font-mono">
            {text}
          </pre>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptUploader;