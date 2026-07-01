import { BookOpen, CheckSquare, ChevronRight, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SUBJECTS = [
  { name: 'Anatomy', questions: 320, color: 'bg-blue-100 text-blue-700' },
  { name: 'Physiology', questions: 280, color: 'bg-green-100 text-green-700' },
  { name: 'Biochemistry', questions: 240, color: 'bg-purple-100 text-purple-700' },
  { name: 'Pharmacology', questions: 310, color: 'bg-amber-100 text-amber-700' },
  { name: 'Pathology', questions: 290, color: 'bg-red-100 text-red-700' },
  { name: 'Microbiology', questions: 220, color: 'bg-teal-100 text-teal-700' },
  { name: 'Surgery', questions: 180, color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Medicine', questions: 350, color: 'bg-pink-100 text-pink-700' },
];

export default function MCQsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            <CheckSquare className="w-4 h-4" /> Medical MCQ Bank
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Practice MCQs</h1>
          <p className="text-gray-500">Sharpen your medical knowledge with topic-wise questions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Questions', value: '2,190+', icon: BookOpen },
            { label: 'Subjects', value: '8', icon: CheckSquare },
            { label: 'Top Scorers', value: '1.2K', icon: Trophy },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Subjects */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Choose a Subject</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBJECTS.map((s) => (
              <button key={s.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition group text-left">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${s.color}`}>{s.name[0]}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.questions} questions</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center space-y-2">
          <p className="text-sm font-bold text-blue-800">Full MCQ bank coming soon!</p>
          <p className="text-xs text-blue-600">We're building a comprehensive question bank with explanations, difficulty levels, and performance tracking.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
