import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export function App() {
  return (
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
  );
}