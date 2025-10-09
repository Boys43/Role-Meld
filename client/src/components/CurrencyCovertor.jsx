// 📁 components/Currency.jsx
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Currency = ({ amount, from }) => {
  const { userData } = useContext(AppContext);
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    const convert = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/fca65323df0cc46a8920b15f/latest/${from}`
        );
        const data = await res.json();

        // ✅ Ensure correct access of rate based on user's currency
        const userCurrency = userData?.currency || "USD"; // fallback
        const rate = data?.conversion_rates?.[userCurrency];

        if (rate) {
          setConverted(amount * rate);
        } else {
          setConverted(null);
        }
      } catch (err) {
        console.error("Currency conversion error:", err.message);
        setConverted(null);
      }
    };

    if (amount && from && userData?.currency) convert();
  }, [amount, from, userData?.currency]);

  if (converted === null) return <span>...</span>; // Loading or unavailable

  return (
    <span>
      {converted.toFixed(0)} {userData?.currency}
    </span>
  );
};

export default Currency;