// AdminSidebar.jsx
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
    {
      name: 'Jobs', key: "jobs", icon: <IoPersonSharp size={25} />,
      subTabs: [
        { name: 'Category', key: "category-manager" },
      ]
    },
    {
      name: 'Blog', key: "blog-management", icon: <IoPersonSharp size={25} />,
      subTabs: [
        { name: "Blog Management", key: "blog-management" },
        { name: "Add Blog", key: "add-blog" },
      ]
    },
  ]

  return (
    <aside className='w-72 pl-6 py-6 min-h-[calc(100vh-4.6rem)] overflow-y-auto bg-[var(--secondary-color)] flex flex-col gap-4 sticky top-0 border-r border-[var(--primary-color)] overflow-x-hidden'>
      <h1 className="text-white font-bold text-lg">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {Navlinks.map((e, i) => {
          const isParentActive = activeTab === e.key || (e.subTabs && e.subTabs.some(sub => sub.key === activeTab))
          return (
            <div key={i}>
              <span
                onClick={() => setActiveTab(e.key)}
                className={`px-4 py-2 rounded-xl cursor-pointer hover:bg-[var(--primary-color)]/10 flex items-center gap-3 text-white transition 
                  ${isParentActive ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)] translate-x-4 border shadow-[var(--primary-color)]' : ''}
                `}
              >
                {e.icon}
                {e.name}
              </span>

              {/* Render sub-tabs if parent is active */}
              {e.subTabs && isParentActive && (
                <div className="flex flex-col gap-1 translate-x-10 mt-2">
                  {e.subTabs.map((sub, idx) => (
                    <span
                      key={idx}
                      onClick={() => setActiveTab(sub.key)}
                      className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--primary-color)]/10 text-white transition 
                        ${activeTab === sub.key ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)] border shadow-[var(--primary-color)]' : ''}
                      `}
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar