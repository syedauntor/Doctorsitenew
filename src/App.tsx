import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import LiveQueuePage from './pages/LiveQueuePage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import JoinAsDoctorPage from './pages/JoinAsDoctorPage';
import DoctorDashboard from './pages/doctor/DashboardPage';
import AppointmentsPage from './pages/doctor/AppointmentsPage';
import QueuePage from './pages/doctor/QueuePage';
import NewPrescriptionPage from './pages/doctor/NewPrescriptionPage';
import SettingsPage from './pages/doctor/SettingsPage';
import AnalyticsPage from './pages/doctor/AnalyticsPage';
import PatientsPage from './pages/doctor/PatientsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
        <Route path="/queue/:doctorId" element={<LiveQueuePage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/medicines/:slug" element={<MedicineDetailPage />} />
        <Route path="/join-as-doctor" element={<JoinAsDoctorPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<AppointmentsPage />} />
        <Route path="/doctor/queue" element={<QueuePage />} />
        <Route path="/doctor/prescriptions/new" element={<NewPrescriptionPage />} />
        <Route path="/doctor/settings" element={<SettingsPage />} />
        <Route path="/doctor/analytics" element={<AnalyticsPage />} />
        <Route path="/doctor/patients" element={<PatientsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
