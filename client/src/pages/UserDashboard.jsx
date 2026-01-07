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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100">
            Share Your Feedback
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Your input helps us improve our product experience.
          </p>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rating
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* Review */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Review
          </label>
          <textarea
            rows="4"
            placeholder="Tell us what worked well or what could be improved..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          onClick={submitReview}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-medium py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Submitting feedback…" : "Submit Feedback"}
        </button>

        {/* AI Response */}
        {aiResponse && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-slate-200 mb-1">
              AI Response
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {aiResponse}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
