// components/Sidebar.jsx
import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-1/5 h-screen sticky top-0 p-6 border border-gray-300 ">
      <nav className="flex flex-col gap-4">
        <a href="#" className="hover:text-blue-600">Dashboard</a>
        <a href="#" className="hover:text-blue-600">Saved Jobs</a>
        <a href="#" className="hover:text-blue-600">Applications</a>
        <a href="#" className="hover:text-blue-600">Profile</a>
      </nav>
    </aside>
  );
};

export default Sidebar;