import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Clock, Check, X, User, Mail, Building, Calendar, Loader } from 'lucide-react'

const RecruiterApprovalRequests = () => {
  const { backendUrl } = useContext(AppContext)
  const [pendingRecruiters, setPendingRecruiters] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const getPendingRecruiters = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/auth/pending-recruiters`);
      if (data.success) {
        setPendingRecruiters(data.pendingRecruiters)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRecruiterStatus = async (email, status) => {
    try {
      setProcessingId(email)
      const { data } = await axios.post(`${backendUrl}/api/auth/update-employee-status`, { email, status });
      if (data.success) {
        await getPendingRecruiters()
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    getPendingRecruiters()
  }, [])

  return (
    <div className='w-full min-h-screen overflow-y-auto p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-800 mb-2'>
          <Clock size={30} className='text-[var(--primary-color)]' />
          Pending Employee Approval Requests
        </h1>
        <span className='text-gray-600'>Review and approve Employee registration requests</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader className='animate-spin text-[var(--primary-color)] mr-2' size={24} />
          <span className='text-gray-600'>Loading pending requests...</span>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-2'>
              <Clock className='text-blue-600' size={20} />
              <span className='text-blue-800 font-medium'>
                {pendingRecruiters.length} pending approval{pendingRecruiters.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          {pendingRecruiters.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm border border-blue-300 p-12 text-center'>
              <Clock className='animate-pulse mx-auto text-gray-400 mb-4' size={48} />
              <h3 className='text-xl font-medium text-gray-600 mb-2'>No Pending Requests</h3>
              <span className='text-gray-500'>All Employee requests have been processed.</span>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Recruiter Details
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Role
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Registration Date
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {pendingRecruiters.map((recruiter, index) => (
                      <tr key={recruiter._id || index} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <div className='h-10 w-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center'>
                                <User className='text-white' size={20} />
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {recruiter.name || 'N/A'}
                              </div>
                              <div className='text-sm text-gray-500 flex items-center gap-1'>
                                <Mail size={14} />
                                {recruiter.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Building className='text-gray-400' size={16} />
                            <span className='text-sm text-gray-900'>
                              {recruiter.role || 'Not specified'}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='text-gray-400' size={16} />
                            <span className='text-sm text-gray-900'>
                              {recruiter.createdAt ? formatDate(recruiter.createdAt) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-3'>
                            <span
                              onClick={() => updateRecruiterStatus(recruiter.email, true)}
                              disabled={processingId === recruiter.email}
                              className='inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                              {processingId === recruiter.email ? (
                                <Loader className='animate-spin' size={16} />
                              ) : (
                                <Check size={16} />
                              )}
                              Approve
                            </span>
                            <span
                              onClick={() => updateRecruiterStatus(recruiter.email, false)}
                              disabled={processingId === recruiter.email}
                              className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                              {processingId === recruiter.email ? (
                                <Loader className='animate-spin' size={16} />
                              ) : (
                                <X size={16} />
                              )}
                              Reject
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RecruiterApprovalRequests
