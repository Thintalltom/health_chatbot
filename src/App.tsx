import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from './store';
import { AuthValidator } from './components/AuthValidator';
import { Layout } from './components/layout/Layout';
import { WelcomeBanner } from './components/ui/WelcomeBanner';
import { OverviewSection } from './components/ui/OverviewSection';
import { ScheduledPatients } from './components/ui/ScheduledPatients';
import { AIAssistant } from './components/ui/AIAssistant';
import { PatientDetails } from './pages/PatientDetails';
import { PatientDetailsView } from './pages/PatientDetailsView';
import { ConsultationSession } from './pages/ConsultationSession';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import PatientTables from './pages/PatientTables';

function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <OverviewSection />

      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <ScheduledPatients />
        <AIAssistant />
      </div>
    </>
  );
}

function AppContent() {
  return (
    <AuthValidator>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
            <Route path="/patient-details/:id" element={<PatientDetailsView />} />
            <Route path="/consultation/:id" element={<ConsultationSession />} />
            <Route path='/patientTable' element={<PatientTables />} />
          </Route>
        </Routes>
      </Router>
    </AuthValidator>
  );
}

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PersistGate>
    </Provider>
  );
}