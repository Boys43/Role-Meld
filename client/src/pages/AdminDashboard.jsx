import React, { useState } from 'react'
import AnalyticDashboard from '../components/AnalyticDashboard'
import AdminUsers from '../components/AdminUsers'
import AdminRecruiters from '../components/AdminRecruiters'
import AdminJobRequests from '../components/AdminJobRequests'
import AdminJobs from '../components/AdminJobs'
import AdminSidebar from '../components/AdminSidebar'
import AdminBlog from '../components/AdminBlog'
import AdminListedBlogs from '../components/AdminListedBlogs'

const AdminDashboard = () => {
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
        return <AdminBlog />
      case 'listed-blogs':
        return <AdminListedBlogs />
      default:
        return <AnalyticDashboard />
    }
  }

  return (
    <div className='flex'>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  )
}

export default AdminDashboard