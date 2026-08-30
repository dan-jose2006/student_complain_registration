import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute, AdminRoute, StudentRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { CreateComplaint } from './pages/student/CreateComplaint';
import { StudentComplaints } from './pages/student/StudentComplaints';
import { StudentComplaintDetails } from './pages/student/StudentComplaintDetails';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminComplaintDetails } from './pages/admin/AdminComplaintDetails';
import { AdminAIInsights } from './pages/admin/AdminAIInsights';

import { NotFoundPage, ForbiddenPage } from './pages/errors/NotFoundPage';

// Portal Layout (with Sidebar)
const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden pb-12">{children}</main>
    </div>
  );
};

// Root App Router
export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Navbar />

              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forbidden" element={<ForbiddenPage />} />

                  {/* Student Routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <StudentRoute>
                        <PortalLayout>
                          <StudentDashboard />
                        </PortalLayout>
                      </StudentRoute>
                    }
                  />
                  <Route
                    path="/student/complaints/new"
                    element={
                      <StudentRoute>
                        <PortalLayout>
                          <CreateComplaint />
                        </PortalLayout>
                      </StudentRoute>
                    }
                  />
                  <Route
                    path="/student/complaints"
                    element={
                      <StudentRoute>
                        <PortalLayout>
                          <StudentComplaints />
                        </PortalLayout>
                      </StudentRoute>
                    }
                  />
                  <Route
                    path="/student/complaints/:id"
                    element={
                      <StudentRoute>
                        <PortalLayout>
                          <StudentComplaintDetails />
                        </PortalLayout>
                      </StudentRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <PortalLayout>
                          <AdminDashboard />
                        </PortalLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints"
                    element={
                      <AdminRoute>
                        <PortalLayout>
                          <AdminComplaints />
                        </PortalLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints/:id"
                    element={
                      <AdminRoute>
                        <PortalLayout>
                          <AdminComplaintDetails />
                        </PortalLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/ai-insights"
                    element={
                      <AdminRoute>
                        <PortalLayout>
                          <AdminAIInsights />
                        </PortalLayout>
                      </AdminRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
