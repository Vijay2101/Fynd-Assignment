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

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Admin Feedback Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time feedback intelligence powered by AI
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Stat title="Total Feedback" value={reviews.length} color="indigo" />
          <Stat title="Average Rating" value={avgRating} color="amber" />
          <Stat title="AI Insights Generated" value={reviews.length} color="emerald" />
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-slate-400">Loading feedback...</p>
        ) : reviews.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No feedback yet.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                    ⭐ {r.rating}/5
                  </span>
                  <span className="text-xs text-slate-400">
                    Feedback #{i + 1}
                  </span>
                </div>

                <p className="text-slate-200 text-sm mb-6 leading-relaxed">
                  {r.review}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <Insight label="AI Summary" value={r.ai_summary} />
                  <Insight label="Recommended Action" value={r.ai_actions} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value, color }) {
  const colors = {
    indigo: "text-indigo-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function Insight({ label, value }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-slate-200 leading-relaxed">{value}</p>
    </div>
  );
}
