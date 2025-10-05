import React, { useState } from "react";

const Test = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const items = [
    "Web Developer",
    "UI Designer",
    "Data Scientist",
    "Software Engineer",
    "Project Manager",
    "React Developer",
    "Backend Developer",
    "AI Engineer",
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    }
  };

  return (
    <div className="relative w-64 mx-auto">
      <input
        type="text"
        placeholder="Search job titles..."
        value={query}
        onChange={handleSearch}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full shadow-lg">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setQuery(item);
                setFiltered([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Test;
