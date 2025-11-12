// 📁 components/Currency.jsx
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Currency = ({ amount, from }) => {
  const { userData } = useContext(AppContext);
  const [converted, setConverted] = useState(null);

  const userCurrency = userData?.currency || "USD";

  useEffect(() => {
    const convert = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/b3c9345a1ea0fdc1e88d609d/latest/${from}`
        );
        const data = await res.json();

        // ✅ Ensure correct access of rate based on user's currency
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

    if (amount && from && userCurrency) convert();
  }, [amount, from, userCurrency]);

  if (converted === null) return <span>...</span>; // Loading or unavailable

  return (
    <span>
      {converted.toLocaleString().split(".")[0]} {userCurrency}
    </span>
  );
};

export default Currency;