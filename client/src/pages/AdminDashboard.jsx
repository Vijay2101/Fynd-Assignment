import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/admin/reviews");
      setReviews(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor user feedback and AI-generated insights
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-sm text-slate-400">Total Submissions</p>
            <p className="text-2xl font-semibold text-slate-100">
              {reviews.length}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-slate-400">Loading feedback…</p>
        ) : reviews.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No feedback submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-xs font-medium">
                    ⭐ {r.rating}
                  </span>
                </div>

                <p className="text-slate-200 text-sm mb-4">
                  {r.review}
                </p>

                <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-slate-300">
                      Summary:
                    </span>{" "}
                    <span className="text-slate-400">{r.ai_summary}</span>
                  </p>
                  <p>
                    <span className="font-medium text-slate-300">
                      Recommended Action:
                    </span>{" "}
                    <span className="text-slate-400">{r.ai_actions}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
