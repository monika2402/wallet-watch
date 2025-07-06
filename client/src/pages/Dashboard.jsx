import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, TrendingUp, Receipt, Upload, List, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const categoryOptions = [
  'Food', 'Travel', 'Shopping', 'Salary', 'Health', 'Utilities', 'Investment', 'Entertainment', 'Other'
];

const Dashboard = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    note: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/transactions', form, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setForm({ amount: '', type: 'expense', category: '', date: '', note: '' });
      fetchTransactions();
      setSuccess('✅ Entry added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchTransactions();
  }, [user]);

  const quickActions = [
    {
      label: 'View Analytics',
      href: '/analytics',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      description: 'Analyze your spending patterns'
    },
    {
      label: 'Upload Receipt',
      href: '/receipt',
      icon: Receipt,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Scan and add receipts'
    },
    {
      label: 'Bulk Upload',
      href: '/bulk-upload',
      icon: Upload,
      color: 'from-orange-500 to-orange-600',
      description: 'Upload multiple receipts'
    },
    {
      label: 'All Transactions',
      href: '/transactions',
      icon: List,
      color: 'from-blue-500 to-blue-600',
      description: 'View transaction history'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Financial Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Track your expenses and income with ease</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Add Transaction</h2>
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-pulse">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                      placeholder="0.00"
                      className="text-gray-800 w-full pl-8 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 bg-white/50 backdrop-blur-sm text-lg"
                    />
                  </div>
                </div>

                {/* Type & Category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="text-gray-800 w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="expense">💸 Expense</option>
                      <option value="income">💰 Income</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="text-gray-800 w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="text-gray-800 w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="text-gray-800 w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      Add Transaction
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
            {quickActions.map((action, index) => (
              <Link
                key={action.label}
                to={action.href}
                className="block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{action.label}</h4>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200" />
      </div>
    </div>
  );
};

export default Dashboard;
