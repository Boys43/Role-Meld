import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const SearchSelect = ({ label, icon: Icon, options, value, onChange, placeholder = "Select option" }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = options.filter(
        (item) =>
            item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    {label}
                </label>
            )}

            {/* Selected box */}
            <div
                onClick={() => setOpen(!open)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg cursor-pointer bg-white focus-within:border-blue-500"
            >
                {value || placeholder}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2 p-2 border-b">
                        <FaSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                        {filtered.length > 0 ? (
                            filtered.map((item) => (
                                <div
                                    key={item.code}
                                    onClick={() => {
                                        onChange({ target: { name: label.toLowerCase(), value: item.code } });
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className="p-2 hover:bg-blue-50 cursor-pointer"
                                >
                                    <span className="font-semibold">{item.code}</span>{" "}
                                    <span className="text-gray-600 text-sm">— {item.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500 text-sm">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchSelect;