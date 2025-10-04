import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { useInView } from "react-intersection-observer";
import { ProgressBar } from "react-step-progress-bar";
import { motion } from "framer-motion";
import "react-step-progress-bar/styles.css";
import { FaStar } from "react-icons/fa";

const ReviewAnalytics = () => {
  const { backendUrl } = useContext(AppContext);
  const [ratingAnalytics, setRatingAnalytics] = useState(null);
  const [analyticLoading, setAnalyticLoading] = useState(false);

  const getRatingAnalytics = async () => {
    setAnalyticLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/reviews/rating-analytics`);
      if (data.success) {
        setRatingAnalytics(data.data);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAnalyticLoading(false);
    }
  };

  useEffect(() => {
    getRatingAnalytics();
  }, []);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [percents, setPercents] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (inView && ratingAnalytics) {
      const { totalReviews, oneStar, twoStars, threeStars, fourStars, fiveStars } = ratingAnalytics;
      if (totalReviews > 0) {
        setTimeout(() => {
          setPercents([
            (fiveStars / totalReviews) * 100,
            (fourStars / totalReviews) * 100,
            (threeStars / totalReviews) * 100,
            (twoStars / totalReviews) * 100,
            (oneStar / totalReviews) * 100,
          ]);
        }, 200);
      }
    }
  }, [inView, ratingAnalytics]);

  if (analyticLoading || !ratingAnalytics) return <Loading />;

  const stars = ["5", "4", "3", "2", "1"];
  const colors = ["#FF6B6B", "#FFA36C", "#FFD36B", "#A0E868", "#4CAF50"].reverse(); // subtle gradient

  return (
    <div className="py-6 px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Our Reviews</h2>
      <h1 className="text-3xl flex items-center gap-3 font-bold text-gray-900 mb-6">
        {ratingAnalytics.averageRating.toFixed(1)} <FaStar className="text-yellow-500" /> ({ratingAnalytics.totalReviews})
      </h1>

      <div ref={ref} className="flex flex-col gap-4 w-full">
        {percents.map((p, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <span className="w-10 text-gray-700 font-medium">{stars[i]}</span>
            <div className="relative flex-1 h-5">
              <ProgressBar
                percent={p}
                filledBackground={colors[i]}
                height={20}
                transition="all 1.2s ease-in-out"
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-900">
                {p.toFixed(1)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewAnalytics;
