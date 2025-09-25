import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const LeaveReview = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const submitReview = () => {
    if (!rating || !review) {
      toast.error("Please give a rating and write your review!");
      return;
    }
    // Here you can send review + rating to backend
    toast.success("Thank you for your review!");
    setRating(0);
    setReview("");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">Leave a Review ⭐</h2>

      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <FaStar
              size={30}
              className={`cursor-pointer transition-colors ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        className="w-full h-28 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <button
        onClick={submitReview}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
      >
        Submit Review
      </button>
    </div>
  );
};

export default LeaveReview;