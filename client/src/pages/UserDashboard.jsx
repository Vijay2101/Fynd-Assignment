import { useState } from "react";
import api from "../api";
import StarRating from "../components/StarRating";

export default function UserDashboard() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  const submitReview = async () => {
    if (!review.trim()) return;

    setLoading(true);
    setError("");
    setAiResponse("");

    try {
      const res = await api.post("/reviews", { rating, review });
      setAiResponse(res.data.ai_response);
      setReview("");
    } catch {
      setError("Unable to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12">
      <div className="max-w-3xl mx-auto flex justify-center">

        {/* LEFT PANEL */}
        <div className="w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-1">
            Share Your Feedback
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Your feedback directly improves our AI decisions.
          </p>

          {/* Rating */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Rating
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          {/* Review */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Your Review
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What went well? What could be improved?"
              className="w-full rounded-2xl bg-slate-950 border border-slate-700 p-4 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={submitReview}
            disabled={loading || !review.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-2xl py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {/* AI RESPONSE */}
          {aiResponse && (
            <div className="mt-8 bg-gradient-to-br from-indigo-600/10 to-emerald-600/10 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-indigo-400 font-semibold mb-2">
                🤖 AI Insight
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed">
                {aiResponse}
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
        </div>

        {/* RIGHT PANEL */}
        {/* <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">

          <Stat title="Your Avg Rating" value={`${rating}/5`} color="amber" />
          <Stat title="Feedback Status" value="Active" color="emerald" />
          <Stat title="AI Response Time" value="< 2s" color="indigo" />

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
              Why feedback matters
            </p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Improves AI decisions</li>
              <li>• Helps product iteration</li>
              <li>• Drives smarter automation</li>
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function Stat({ title, value, color }) {
  const colors = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    indigo: "text-indigo-400",
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
