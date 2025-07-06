import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './components/Analytics';
import ReceiptUploader from './components/ReceiptUploader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import PdfBulkUploader from './components/PdfBulkUploader';
import TransactionsList from './components/TransactionsList';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}


function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/receipt' element={<ReceiptUploader />} />
            <Route path='/bulk-upload' element={<PdfBulkUploader />} />
            <Route path="/transactions" element={<TransactionsList />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}


export default App;
