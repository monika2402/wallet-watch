import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TransactionsList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async (pageNumber = 1) => {
    if (!startDate || !endDate) return; // ✅ Prevent fetch if dates are missing

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        limit: 6,
        start: startDate,
        end: endDate,
      });

      const res = await axios.get(`http://localhost:5000/api/transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchTransactions(1); // ✅ Fetch only after valid input
    } else {
      alert('Please select both start and end dates to filter transactions.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📒</span> Your Transactions
          </h3>
        </div>

        {/* Filter */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Start:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">End:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              className={`px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-all duration-300 transform ${
                startDate && endDate
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleFilter}
              disabled={!startDate || !endDate}
            >
              🔍 Filter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-300 border-t-indigo-600" />
              <span className="ml-3 text-gray-600 font-medium">⏳ Loading...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">📝</div>
              <p className="text-gray-500 text-lg font-medium">No transactions found.</p>
              <p className="text-gray-400 text-sm mt-2">Select a date range to filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn, index) => (
                <div
                  key={txn.id}
                  className={`bg-gradient-to-r ${
                    txn.type === 'income'
                      ? 'from-green-50 to-emerald-50 border-green-200'
                      : 'from-red-50 to-pink-50 border-red-200'
                  } border rounded-xl p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          txn.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <div>
                        <span className="text-2xl font-bold text-gray-800">₹{txn.amount}</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            txn.type === 'income'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                      {txn.date}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                      {txn.category}
                    </span>
                  </div>

                  {txn.note && (
                    <div className="bg-white bg-opacity-70 p-2 rounded-lg border border-gray-200">
                      <span className="text-gray-600 text-sm font-medium">{txn.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => fetchTransactions(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white text-blue-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                ⏮ Prev
              </button>
              <span className="text-sm text-gray-600">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() => fetchTransactions(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white text-blue-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Next ⏭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
