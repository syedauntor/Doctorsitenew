import { Printer, Download, FileText } from 'lucide-react';
import PSLayout from '../../components/PSLayout';

const PRESCRIPTIONS = [
  { id: 1, patientName: 'Jahangir Alam', patientId: 'PI-24-00005', time: '12:42 PM', diagnosis: 'CAD — stable angina', medicineCount: 4 },
  { id: 2, patientName: 'Karim Hossain', patientId: 'PI-26-00001', time: '10:18 AM', diagnosis: 'Hypertension — Grade 1', medicineCount: 2 },
  { id: 3, patientName: 'Rafiq Ahmed', patientId: 'PI-25-00003', time: '11:05 AM', diagnosis: 'T2DM — HbA1c 7.8', medicineCount: 4 },
];

export default function PSPrescriptionsPage() {
  return (
    <PSLayout>
      <div className="p-5 max-w-3xl space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prescriptions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Today's prescriptions — view and print only</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-700">PS access: view and print prescriptions only. No editing allowed.</span>
        </div>

        {PRESCRIPTIONS.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-400">No prescriptions written today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {PRESCRIPTIONS.map((rx) => (
              <div key={rx.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{rx.patientName}</span>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{rx.patientId}</span>
                    </div>
                    <p className="text-xs text-gray-500">{rx.diagnosis}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Written at {rx.time} · {rx.medicineCount} medicines</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 text-xs font-bold rounded-xl hover:bg-teal-100 transition">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PSLayout>
  );
}
