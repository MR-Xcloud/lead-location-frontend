import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';
import TimeEntryForm from './components/TimeEntryForm';
import HistoryPage from './components/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<TimeEntryForm />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;