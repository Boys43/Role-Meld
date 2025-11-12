import { Building, SearchIcon, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ Param }) => {
  const navigate = useNavigate();
  const location = useLocation()

  const [searchJob, setSearchJob] = useState('')
  const [searchLocation, setSearchLocation] = useState('All Cities')
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)

  const cities = [
    'All Cities',
    'New York',
    'Los Angeles', 
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Lahore'
  ];

  useEffect(() => {
    setSearchJob(Param ?? "");
  }, [Param]);

  const handleSubmit = (e) => {
    if (!searchJob.trim()) return;
    e.preventDefault();
    let url = `/find-jobs?job=${encodeURIComponent(searchJob)}`;
    if (searchLocation && searchLocation !== 'All Cities') {
      url += `&location=${encodeURIComponent(searchLocation)}`;
    }
    navigate(url);
  };

  const handleLocationSelect = (city) => {
    setSearchLocation(city);
    setIsLocationDropdownOpen(false);
  };

  return (
    <section
      id="search"
      className={`bg-white rounded-4xl border border-gray-200 ${location.pathname === '/' ? "w-[100%] max-w-4xl mx-auto" : "w-[70vw] mx-auto"}`}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-2">
        {/* Job Search Input */}
        <div className="flex-1 relative">
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchJob}
            onChange={(e) => setSearchJob(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none text-sm"
            type="text"
            placeholder="Jobs title or keyword"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          >
            <Building size={20} className="text-gray-400" />
            <span className="text-gray-700 text-sm min-w-[100px]">{searchLocation}</span>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>
          
          {/* Dropdown Menu */}
          {isLocationDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
              <div className="py-1 max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLocationSelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          type="submit" 
          className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium text-sm transition-colors ml-2"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default Search;