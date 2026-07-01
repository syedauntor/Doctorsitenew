import { Star, TrendingUp, ThumbsUp, Flag } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

const REVIEWS = [
  { id: 1, patient: 'Rahim Hossain', avatar: 'R', rating: 5, comment: 'Excellent doctor! Very thorough and explained everything clearly. Highly recommended.', date: 'Jun 28, 2026', helpful: 4 },
  { id: 2, patient: 'Nasrin Begum', avatar: 'N', rating: 4, comment: 'Very professional and knowledgeable. The wait time was a bit long but the consultation was worth it.', date: 'Jun 25, 2026', helpful: 2 },
  { id: 3, patient: 'Kamal Uddin', avatar: 'K', rating: 5, comment: 'Dr. Rahim is outstanding. He listens patiently and gives practical advice.', date: 'Jun 20, 2026', helpful: 7 },
  { id: 4, patient: 'Sultana Rani', avatar: 'S', rating: 3, comment: 'Good doctor but the chamber can be better organized. Prescription was clear and helpful.', date: 'Jun 15, 2026', helpful: 1 },
  { id: 5, patient: 'Abdul Karim', avatar: 'A', rating: 5, comment: 'Best cardiologist I have visited. Very calm demeanor and excellent diagnosis.', date: 'Jun 10, 2026', helpful: 5 },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
const counts = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: REVIEWS.filter((r) => r.rating === s).length }));

export default function ReviewsPage() {
  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-3xl space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" /> Patient Reviews
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">See what patients are saying about you</p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-6 items-center">
          <div className="text-center">
            <p className="text-5xl font-black text-gray-900">{avg}</p>
            <Stars n={Math.round(Number(avg))} />
            <p className="text-xs text-gray-400 mt-1">{REVIEWS.length} reviews</p>
          </div>
          <div className="flex-1 min-w-[180px] space-y-1.5">
            {counts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3 shrink-0">{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${(count / REVIEWS.length) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-4 shrink-0">{count}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              <TrendingUp className="w-4 h-4" /> 98% would recommend
            </div>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-3">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shrink-0">
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{r.patient}</p>
                      <Stars n={r.rating} />
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpful})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition font-semibold">
                      <Flag className="w-3.5 h-3.5" /> Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
