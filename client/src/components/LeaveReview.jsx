import React, { Suspense, useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {motion} from 'framer-motion'
import { Star } from "lucide-react";
// Lazy Heavy Components
const ReviewAnalytics = React.lazy(() => import("./ReviewAnalytics"));

const LeaveReview = () => {
  const {userData, backendUrl} = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false)
  const submitReview = async () => {
    setReviewSubmitLoading(true)
    if (!rating || !review) {
      toast.error("Please give a rating and write your review!");
      return setReviewSubmitLoading(false);
    }
    try {
      const {data} = await axios.post(`${backendUrl}/api/reviews/add-review`, {rating, review, name: userData?.name || "Anonymous", profilePicture: userData?.profilePicture || "https://picsum.photos/200/300/?random"});

      if (data.success) {
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setReviewSubmitLoading(false);
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Suspense fallback={<div>Loaing Analytics...</div>}>
        <ReviewAnalytics />
      </Suspense>
      <div className="rounded-xl p-6 my-6 border border-gray-300 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          Rate Us <span className="text-yellow-400"><Star /></span>
        </h2>

        <div className="flex mb-4 justify-start gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              whileHover={{ scale: 1.2 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="cursor-pointer"
            >
              <FaStar
                size={32}
                className={`${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"} transition-colors duration-200`}
              />
            </motion.span>
          ))}
        </div>

        <textarea
          className="w-full h-28 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 resize-none bg-white"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={submitReview}
          disabled={reviewSubmitLoading}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition duration-200 shadow-sm hover:shadow-md"
        >
          {reviewSubmitLoading ? "Submitting...": "Submit Review"}
        </button>
      </div>

    </section>
  );
};

export default LeaveReview;