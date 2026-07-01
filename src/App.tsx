import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
import PSDashboardPage from './pages/ps/DashboardPage';
import PSQueuePage from './pages/ps/QueuePage';
import PSAppointmentsPage from './pages/ps/AppointmentsPage';
import PSPrescriptionsPage from './pages/ps/PrescriptionsPage';
import PSRegisterPage from './pages/ps/RegisterPatientPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
        <Route path="/queue/:doctorId" element={<LiveQueuePage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/medicines/:slug" element={<MedicineDetailPage />} />
        <Route path="/join-as-doctor" element={<JoinAsDoctorPage />} />
        {/* Doctor portal */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<AppointmentsPage />} />
        <Route path="/doctor/queue" element={<QueuePage />} />
        <Route path="/doctor/prescriptions/new" element={<NewPrescriptionPage />} />
        <Route path="/doctor/settings" element={<SettingsPage />} />
        <Route path="/doctor/analytics" element={<AnalyticsPage />} />
        <Route path="/doctor/patients" element={<PatientsPage />} />
        {/* PS portal */}
        <Route path="/ps/dashboard" element={<PSDashboardPage />} />
        <Route path="/ps/queue" element={<PSQueuePage />} />
        <Route path="/ps/appointments" element={<PSAppointmentsPage />} />
        <Route path="/ps/prescriptions" element={<PSPrescriptionsPage />} />
        <Route path="/ps/register" element={<PSRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
