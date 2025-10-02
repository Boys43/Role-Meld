import React, { useContext, useEffect, useState } from 'react'
import Img from '../components/Image'
import assets from '../assets/assets'
import { ArrowUpFromLine, CircleUser, Link, PercentSquareIcon, PersonStanding, Users } from "lucide-react"
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';

export const CompanyJobs = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const param = useParams()
  const id = param.id

  console.log('id', id)


  const [CompanyJobs, setCompanyJobs] = useState([])
  const [companyLoading, setCompanyLoading] = useState(false)
  const getcompanyJobs = async () => {
    setCompanyLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobsbyid`, { id })
      if (data.success) {
        setCompanyJobs(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setCompanyLoading(false)
    }
  }

  useEffect(() => {
    getcompanyJobs();
  })

  if (companyLoading) {
    return <Loading />
  }

  return (
    <div>
      {CompanyJobs?.map((job, i)=>(
        job._id
      ))}
    </div>
  )
}

export const CompanyReviews = () => {

  return (
    <div>
      <h1>Hello I am Company Reviews</h1>
    </div>
  )
}

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  return (
    <main className='p-4 min-h-[calc(100vh-4.6rem)]'>
      <section className='pb-8 border-b border-gray-300'>
        <div className='rounded-2xl overflow-hidden border-2 border-gray-500'>
          <Img src={assets.register_side} style={"w-full h-[25vh] object-cover"} />
        </div>
        <div className='flex items-center justify-between mt-4 px-8'>
          <div className='flex items-center gap-8'>
            <Img src={assets.tcs} style={"w-32 h-32 rounded-full border-4 border-gray-500"} />
            <div className='flex flex-col gap-2'>
              <h1 className='font-bold'>
                Company Name Here
              </h1>
              <div className='flex items-center gap-8'>
                <p className='flex text-gray-500 items-center gap-2'>
                  <CircleUser /> <span className='font-semibold'>120</span> Followers
                </p>
                <p className='flex text-gray-500 items-center gap-2'>
                  <ArrowUpFromLine /> <span className='font-semibold'>10</span> Jobs Posted
                </p>
                <p className='flex text-gray-500 items-center gap-2'>
                  <Users /> <span className='font-semibold'>20</span> Members
                </p>
              </div>
              <div onClick={() => {
                copy('Profile Link')
                toast.success('Copied to clipboard')

              }}
                className='flex mt-5 items-center gap-2 text-sm'
              >
                <Link size={20} />
                <span className='px-2 rounded-md bg-gray-200 cursor-pointer'>
                  https://www.linkedin.com/company/company-name-here
                </span>
              </div>
            </div>
          </div>
          <div>
            <button className='follow-btn mr-20'>
              Follow
            </button>
          </div>
        </div>
      </section>
      <section>
        {/* Navigation Bar */}
        <nav className='p-3 border'>
          <ul className='flex items-center gap-10'>
            <li className={` cursor-pointer ${activeTab === 'jobs' && "underline"} underline-offset-8  font-semibold text-lg`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </li>
            <li className={` cursor-pointer ${activeTab === 'reviews' && "underline"} underline-offset-8  font-semibold text-lg`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </li>
          </ul>
        </nav>
      </section>
      <section>
        {activeTab === 'jobs' ? <CompanyJobs /> : <CompanyReviews />}

      </section>
    </main>
  )
}

export default CompanyProfile
