import { Building, SearchIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ Param }) => {
  const navigate = useNavigate();
  const location = useLocation()

  const [searchJob, setSearchJob] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  useEffect(() => {
    setSearchJob(Param ?? "");
  }, [Param]);

  const handleSubmit = (e) => {
    if (!searchJob.trim()) return;
    e.preventDefault();
    let url = `/find-jobs?job=${encodeURIComponent(searchJob)}`;
    if (searchLocation) {
      url += `&location=${encodeURIComponent(searchLocation)}`;
    }
    navigate(url);
  };

  return (
    <section
      id="search"
      className="shadow-2xl backdrop-blur-xs w-[70vw] mx-auto border-[1px] border-[var(--primary-color)] rounded-2xl"
    >
      <form onSubmit={handleSubmit} className="flex gap-2 w-full items-center">
        <div className={`flex w-full items-center ${location.pathname === '/' ? "text-[var(--accent-color)]" : "text-[var(--primary-color)]"} relative`}>
          <SearchIcon
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
          <span className="w-1 h-10 bg-white/35">

          </span>

          {
            location.pathname === "/"
            &&
            <div className="relative w-full">
              <Building
                size={15}
                className="absolute left-6 top-1/2 -translate-y-1/2"
              />
              <input
                value={searchLocation}
                required
                onChange={(e) => setSearchLocation(e.target.value)}
                className="border-3 border-transparent focus:border-[var(--primary-color)] 
              focus:outline-none py-3 pl-14 rounded-2xl w-full transition-all"
                type="text"
                placeholder="City"
              />
            </div>
          }
        </div>
        <div className="p-1">
          <button type="submit" className="flex items-center gap-3">
            Find <FaSearch />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Search;