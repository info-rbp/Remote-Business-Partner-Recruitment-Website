import React from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Onboarding from './pages/Onboarding';
import Services from './pages/Services';
import Website from './pages/Website';
import Login from './pages/Login';
import ForCandidates from './pages/ForCandidates';
import ForEmployers from './pages/ForEmployers';
import CurrentVacancies from './pages/CurrentVacancies';
import VacancyDetail from './pages/VacancyDetail';
import BlogManagement from './pages/BlogManagement';
import { AppProvider, useAppStore } from './store';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/vacancies" element={<CurrentVacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/for-candidates" element={<ForCandidates />} />
          <Route path="/for-employers" element={<ForEmployers />} />
          <Route path="/login" element={<Login />} />

          {/* Legacy public links redirect into the simplified launch experience. */}
          <Route path="/careers" element={<Navigate to="/vacancies" replace />} />
          <Route path="/portal" element={<Navigate to="/vacancies" replace />} />
          <Route path="/platform-product" element={<Navigate to="/for-employers" replace />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/blog/:id" element={<Navigate to="/" replace />} />

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
