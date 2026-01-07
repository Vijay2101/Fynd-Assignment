import { motion } from "framer-motion";

export default function StarRating({ rating, setRating }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setRating(star)}
          style={{
            fontSize: 28,
            cursor: "pointer",
            color: star <= rating ? "#facc15" : "#334155",
          }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}
