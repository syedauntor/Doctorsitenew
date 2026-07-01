import { MessageSquare, ThumbsUp, Clock, CheckCircle, Plus, Search } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

const SAMPLE_QAS = [
  { id: 1, patient: 'Rahim H.', avatar: 'R', question: 'Is it safe to take metformin with ibuprofen for a diabetic patient?', time: '2 hours ago', answered: true, answer: 'Generally, short-term use of ibuprofen is not recommended for diabetic patients on metformin as it can affect kidney function. Paracetamol is a safer alternative. Please consult before any OTC pain medication.' },
  { id: 2, patient: 'Nasrin B.', avatar: 'N', question: 'I have been experiencing sharp chest pain for 3 days, is this related to my last visit?', time: '5 hours ago', answered: false, answer: '' },
  { id: 3, patient: 'Kamal U.', avatar: 'K', question: 'When should I repeat the ECG after starting the new medication?', time: '1 day ago', answered: true, answer: 'Please get an ECG done 4 weeks after starting the medication, or sooner if you experience palpitations or dizziness.' },
  { id: 4, patient: 'Sultana R.', avatar: 'S', question: 'My blood pressure reading this morning was 145/92 — should I be worried?', time: '2 days ago', answered: false, answer: '' },
];

export default function QAPage() {
  const unanswered = SAMPLE_QAS.filter((q) => !q.answered).length;

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Patient Q&amp;A
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Answer questions from your patients</p>
          </div>
          {unanswered > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4" /> {unanswered} unanswered
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>

        {/* Question list */}
        <div className="space-y-3">
          {SAMPLE_QAS.map((qa) => (
            <div key={qa.id} className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 ${qa.answered ? 'border-gray-100' : 'border-amber-200'}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-blue-600 text-sm">
                  {qa.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{qa.patient}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{qa.time}</span>
                      {qa.answered
                        ? <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" /> Answered</span>
                        : <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pending</span>
                      }
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{qa.question}</p>
                </div>
              </div>

              {qa.answered && qa.answer && (
                <div className="ml-12 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Your Answer
                  </p>
                  <p className="text-sm text-blue-800">{qa.answer}</p>
                </div>
              )}

              {!qa.answered && (
                <div className="ml-12">
                  <textarea placeholder="Type your answer…"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <div className="flex justify-end mt-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
                      <Plus className="w-3.5 h-3.5" /> Post Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
