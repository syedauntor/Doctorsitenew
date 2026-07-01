import { MessageCircle, ThumbsUp, Tag, Clock, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const QUESTIONS = [
  { id: 1, title: 'What is the first-line treatment for uncomplicated hypertension in a young adult?', tags: ['Cardiology', 'Pharmacology'], author: 'Med Student', time: '2 hours ago', answers: 3, votes: 12 },
  { id: 2, title: 'How does metformin work in type 2 diabetes? Why is it preferred over other biguanides?', tags: ['Endocrinology', 'Pharmacology'], author: 'Resident Doctor', time: '5 hours ago', answers: 5, votes: 28 },
  { id: 3, title: 'What are the diagnostic criteria for SIADH and how does it differ from cerebral salt wasting?', tags: ['Nephrology', 'Neurology'], author: 'MBBS Intern', time: '1 day ago', answers: 2, votes: 7 },
  { id: 4, title: 'When should a patient with stable angina be referred for coronary angiography?', tags: ['Cardiology'], author: 'GP', time: '2 days ago', answers: 4, votes: 19 },
  { id: 5, title: 'What is the recommended approach for managing a patient with resistant hypertension on 3 medications?', tags: ['Cardiology', 'Internal Medicine'], author: 'Cardiologist', time: '3 days ago', answers: 6, votes: 34 },
];

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Q&amp;A</h1>
            <p className="text-gray-500 mt-1">Ask and answer medical questions with the community</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
            <MessageCircle className="w-4 h-4" /> Ask a Question
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" />
        </div>

        {/* Question list */}
        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-blue-200 transition cursor-pointer group">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 shrink-0 text-center">
                  <div className="flex flex-col items-center">
                    <ThumbsUp className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition" />
                    <span className="text-sm font-bold text-gray-700">{q.votes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-4 h-4 text-gray-300" />
                    <span className="text-sm font-bold text-gray-700">{q.answers}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition leading-snug">{q.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    {q.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                    <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                      <Clock className="w-3 h-3" /> {q.time} · by {q.author}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center space-y-2">
          <p className="text-sm font-bold text-blue-800">Full Q&amp;A community coming soon!</p>
          <p className="text-xs text-blue-600">A peer-to-peer knowledge platform for healthcare professionals in Bangladesh.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
