import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

const PdfBulkUploader = () => {
  // const { user } = useAuth();
  const user = { token: 'demo-token' }; // Demo token for testing
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successCount, setSuccessCount] = useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setLoading(true);
    setError('');
    setResult(null);
    setSuccessCount(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulated response
      const res = {
        data: {
          entries: [
            { id: 1, amount: 100, description: 'Coffee Shop', date: '2024-01-15' },
            { id: 2, amount: 50, description: 'Gas Station', date: '2024-01-16' }
          ],
          count: 2
        }
      };

      const entries = res.data.entries;
      setResult(res.data);

      let count = 0;
      for (let entry of entries) {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          count++;
        } catch (err) {
          console.error('❌ Failed to save:', entry, err);
        }
      }

      setSuccessCount(count);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError('PDF upload or parsing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <h3 className="text-xl font-semibold text-white">PDF Transaction Uploader</h3>
          </div>
          <p className="text-blue-100 text-sm mt-1">Upload a PDF file to extract and save transactions</p>
        </div>

        {/* Upload Section */}
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <span className="text-gray-800 font-medium">Choose PDF file</span>
                  <span className="text-gray-500 block text-sm mt-1">or drag and drop</span>
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              {file && (
                <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-2 inline-block">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">Processing PDF...</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">Extracting transactions and saving to database</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">Upload Failed</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">Extracted</p>
                      <p className="text-green-600 text-sm">{result.count} transactions found</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-blue-800 font-semibold">Saved</p>
                      <p className="text-blue-600 text-sm">{successCount} transactions saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Data Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h4 className="text-gray-800 font-medium">Transaction Preview</h4>
                  <p className="text-gray-600 text-sm">Raw extracted data from PDF</p>
                </div>
                <div className="p-4">
                  <div className="bg-white rounded border">
                    <pre className="text-xs text-gray-800 p-4 overflow-auto max-h-60 font-mono">
                      {JSON.stringify(result.entries, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfBulkUploader;
