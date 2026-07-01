import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import LiveQueuePage from './pages/LiveQueuePage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import JoinAsDoctorPage from './pages/JoinAsDoctorPage';

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
      </Routes>
    </BrowserRouter>
  );
}
