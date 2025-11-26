import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DarkModeProvider from './components/DarkModeProvider';
import LoginPage from './components/pages/loginPage';
import HomePage from './components/pages/homePage';
import AdmissionPage from './components/pages/admissionPage';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/dashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

import DashboardPage from './components/pages/dashboardPage';
import AcademicPage from './components/pages/academicPage';
import TransactionPage from './components/pages/transactionPage';
import PaymentPortalPage from './components/pages/paymentPortalPage';
import SettingsPage from './components/pages/settingsPage';
import HelpSupportPage from './components/pages/helpSupportDashboardPage';
import ProfilePage from './components/pages/profilePage';
import SubjectPage from './components/pages/subjectPage';
import DocumentPage from './components/pages/documentPage';
import EventPage from './components/pages/eventPage';
import LibraryPage from './components/pages/libraryPage';
import TeacherPage from './components/pages/teacherPage';
import TextSundoPage from './components/pages/TextSundoPage';

import ProfileSettingPage from './components/pages/profileSettingPage';
import CurrentGradesPage from './components/pages/currentGradesPage';
import PreviousGradesPage from './components/pages/previousGradesPage';
import TryPage from './components/pages/tryPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <DarkModeProvider>
          <ThemeProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/admission" element={<AdmissionPage />} />
                <Route path="/student-dashboard" element={<ProtectedRoute> <DashboardLayout /> </ProtectedRoute>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="academic" element={<AcademicPage />} />
                  <Route path="transaction" element={<TransactionPage />} />
                  <Route path="transaction/payment-portal" element={<PaymentPortalPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="help" element={<HelpSupportPage />} />
                  <Route path="my-account" element={<ProfilePage />} />
                  <Route path="subject" element={<SubjectPage />} />
                  <Route path="document-request" element={<DocumentPage />} />
                  <Route path="events" element={<EventPage />} />
                  <Route path="library" element={<LibraryPage />} />
                  <Route path="teacher-qa" element={<TeacherPage />} />
                  <Route path="text-sundo" element={<TextSundoPage />} />
                  <Route path="profile-settings" element={<ProfileSettingPage />} />
                  <Route path="academic/current-grades" element={<CurrentGradesPage />} />
                  <Route path="academic/previous-grades" element={<PreviousGradesPage />} />
                  <Route path="try" element={<TryPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </DarkModeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;