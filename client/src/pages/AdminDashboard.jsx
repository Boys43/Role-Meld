import React, { useEffect, useState } from 'react'
import AnalyticDashboard from '../components/AnalyticDashboard'
import AdminUsers from '../components/AdminUsers'
import AdminRecruiters from '../components/AdminRecruiters'
import AdminJobRequests from '../components/AdminJobRequests'
import AdminJobs from '../components/AdminJobs'
import AdminSidebar from '../components/AdminSidebar'
import AdminBlog from '../components/AdminBlog'
import AdminListedBlogs from '../components/AdminListedBlogs'
import CategoryManager from '../components/CategoryManager'
import EmployeeProfileRequests from '../components/EmployeeProfileRequests'
import AddAssistant from '../components/AddAssistant'
import AdminAssistants from '../components/AdminAssistants'

const AdminDashboard = () => {
    // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const [activeTab, setActiveTab] = useState('analytic-dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'analytic-dashboard':
        return <AnalyticDashboard />
      case 'users':
        return <AdminUsers />
      case 'recruiters':
        return <AdminRecruiters />
      case 'job-requests':
        return <AdminJobRequests />
      case 'jobs':
        return <AdminJobs />
      case 'blog-management':
        return <AdminListedBlogs setActiveTab={setActiveTab} />
      case 'add-blog':
        return <AdminBlog setActiveTab={setActiveTab} />
      case 'listed-blogs':
        return <AdminListedBlogs />
      case "category-manager":
        return <CategoryManager />
      case "employee-profile-requests":
        return <EmployeeProfileRequests />
      case "add-assistant":
        return <AddAssistant />
      case "all-assistant":
        return <AdminAssistants setActiveTab={setActiveTab} />
      default:
        return <AnalyticDashboard />
    }
  }

  return (
    <div className='flex min-h-screen'>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  )
}

export default AdminDashboard