import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AuthLayout from './components/auth/AuthLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Events from './pages/Events';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Routes>
          {/* Public Routes - Authentication */}
          <Route path="/login" element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          } />
          
          {/* Protected Routes - Main Application */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/network" element={
            <ProtectedRoute>
              <Layout>
                <Network />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Layout>
                <Jobs />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;