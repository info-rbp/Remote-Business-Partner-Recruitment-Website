
import React from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Onboarding from './pages/Onboarding';
import Services from './pages/Services';
import CareerPortal from './pages/CareerPortal';
import Website from './pages/Website';
import Login from './pages/Login';
import ForCandidates from './pages/ForCandidates';
import PlatformProduct from './pages/PlatformProduct';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogManagement from './pages/BlogManagement';
import { AppProvider, useAppStore } from './store';

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { isAuthenticated } = useAppStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Website />} />
          <Route path="/login" element={<Login />} />
          <Route path="/careers" element={<CareerPortal />} />
          <Route path="/portal" element={<CareerPortal />} />
          <Route path="/for-candidates" element={<ForCandidates />} />
          <Route path="/platform-product" element={<PlatformProduct />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Protected Platform Routes */}
          <Route path="/platform/*" element={
            <ProtectedRoute>
                <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/candidates" element={<Candidates />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/blog" element={<BlogManagement />} />
                    <Route path="/services" element={<Services />} />
                </Routes>
                </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
