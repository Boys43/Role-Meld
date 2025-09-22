import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ Param }) => {
  const navigate = useNavigate();

  const [searchJob, setSearchJob] = useState('')

  // Update state when URL changes (important for back/forward nav)
  useEffect(() => {
    setSearchJob(Param);
  }, [Param]);

  const handleSubmit = (e) => {
    if (!searchJob.trim()) return;
    e.preventDefault();
    navigate("/find-jobs?job=" + encodeURIComponent(searchJob));
  };

  return (
    <section
      id="search"
      className="shadow-2xl w-[70vw] mx-auto border-[1px] border-[var(--primary-color)] rounded-2xl"
    >
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <div className="flex w-full text-[var(--primary-color)] relative">
          <FaSearch
            size={15}
            className="absolute left-6 top-1/2 -translate-y-1/2"
          />
          <input
            value={searchJob}
            required
            onChange={(e) => setSearchJob(e.target.value)}
            className="border-3 border-transparent focus:border-[var(--primary-color)] 
              focus:outline-none py-3 pl-14 rounded-2xl w-full transition-all"
            type="text"
            placeholder="Job title, keywords, or company"
          />
        </div>
        <div className="p-1">
          <button type="submit">
            Find <FaSearch />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Search;