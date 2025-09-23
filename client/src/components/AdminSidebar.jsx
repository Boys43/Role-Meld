import React from 'react'
import { MdDashboard } from "react-icons/md"
import { PiOfficeChairFill } from "react-icons/pi"
import { FaCodePullRequest } from "react-icons/fa6"
import { RiAdminLine } from "react-icons/ri"
import { IoPersonSharp } from "react-icons/io5"

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const Navlinks = [
    { name: 'Analytics', key: "analytic-dashboard", icon: <MdDashboard size={25} /> },
    { name: 'Job Requests', key: "job-requests", icon: <PiOfficeChairFill size={25} /> },
    { name: 'Users', key: "users", icon: <FaCodePullRequest size={25} /> },
    { name: 'Recruiters', key: "recruiters", icon: <RiAdminLine size={25} /> },
    { name: 'Jobs', key: "jobs", icon: <IoPersonSharp size={25} /> },
    { name: 'Blog', key: "blog", icon: <IoPersonSharp size={25} /> },
  ]

  return (
    <aside className='w-72 pl-6 py-6 h-[calc(100vh-4.6rem)] overflow-y-auto bg-[var(--secondary-color)] flex flex-col gap-4 sticky top-0 border-r border-[var(--primary-color)] overflow-x-hidden'>
      <h1 className="text-white font-bold text-lg">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {Navlinks.map((e, i) => (
          <span
            key={i}
            onClick={() => setActiveTab(e.key)}
            className={`px-4 py-2 rounded-xl cursor-pointer hover:bg-[var(--primary-color)]/10 flex items-center gap-3 text-white transition 
              ${activeTab === e.key ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)] translate-x-2 border shadow-[var(--primary-color)]' : ''}
            `}
          >
            {e.icon}
            {e.name}
          </span>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar;