import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({ name, value, onChange, children, className }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = React.Children.toArray(children).filter((child) => child.type === "option");
  const selectedOption = options.find((opt) => opt.props.value === value);

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({ target: { name, value: optionValue } }); // mimic native select event
    }
    setOpen(false);
  };

  return (
    <div ref={menuRef} className={`relative w-full text-sm ${className || ""}`}>
      {/* Display Button */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-[var(--primary-color)] transition-colors duration-200 ${
          open ? "ring-2 ring-[var(--primary-color)] border-[var(--primary-color)]" : ""
        }`}
      >
        <span className={`truncate ${value ? "text-gray-800" : "text-gray-400"}`}>
          {selectedOption?.props.children || "Select..."}
        </span>
        <ChevronDown
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          size={18}
        />
      </div>

      {/* Options Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden animate-fadeIn max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.props.value}
              onClick={() => handleSelect(opt.props.value)}
              className={`px-4 py-2 cursor-pointer transition-all hover:bg-[var(--primary-color)]/70 hover:text-white ${
                opt.props.value === value ? "bg-[var(--primary-color)] text-white" : "text-gray-700"
              }`}
            >
              {opt.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;