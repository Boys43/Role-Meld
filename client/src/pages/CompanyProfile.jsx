import React, { useContext, useEffect, useState } from 'react'
import Img from '../components/Image'
import { ArrowUpFromLine, CircleUser, Filter, Link, Users } from "lucide-react"
import { Mail, Phone, Globe, MapPin, Building2, Calendar } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import JobCard from '../components/JobCard';
import NotFound404 from '../components/NotFound404';
import SimplePagination from '../components/SimplePagination';

export const CompanyJobs = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams()

  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [filter, setFilter] = useState("recent"); // default filter


  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Fetch company jobs
  const getCompanyJobs = async () => {
    setCompanyLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobsbyid`, { id });
      if (data.success) {
        setCompanyJobs(data.companyJobs);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    getCompanyJobs();
  }, [id]);

  // Apply filter
  const filteredJobs = companyJobs
    .slice() // copy array before sorting
    .filter((job) => {
      if (filter === "featured") return job.sponsored === true;
      return true; // recent shows all
    })
    .sort((a, b) => {
      if (filter === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  if (companyLoading) return <Loading />;

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4">
        <h3 className='font-semibold flex items-center gap-3'>
          <Filter className='text-[var(--primary-color)]' />
          Filter
        </h3>
        {["recent", "featured"].map((f) => (
          <span
            key={f}
            className={`cursor-pointer px-4 py-2 rounded-lg ${filter === f ? "bg-[var(--primary-color)]/50 border border-[var(--primary-color)] text-white" : "bg-gray-200"
              }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </span>
        ))}
      </div>

      <SimplePagination pageSize={6}>
        <ul className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} e={job} />)
          ) : (
            <NotFound404 value={"No Job Found"} margin={"mt-5"} />
          )}
        </ul>
      </SimplePagination>
    </div>
  );
};


export const CompanyReviews = () => {

  return (
    <div>
      <h1>Hello I am Company Reviews</h1>
    </div>
  )
}

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const { id } = useParams();

  const { backendUrl, userData, frontendUrl } = useContext(AppContext);

  const [followLoading, setFollowLoading] = useState(false)

  const [isFollowing, setIsFollowing] = useState(
    userData?.followedAccounts?.includes(id)
  );
  const followUnfollow = async () => {
    if (!userData || !userData._id) {
      toast.error("Please login to follow companies");
      return;
    }

    setFollowLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/follow-unfollow-acc`, {
        companyId: id,
        followerId: userData._id
      });

      if (data.success) {
        toast.success(data.message);
        setIsFollowing(!isFollowing)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setFollowLoading(false);
    }
  }

  const [companyDetails, setcompanyDetails] = useState({})
  const [companyDetailsLoading, setCompanyDetailsLoading] = useState(false)

  const getCompanyDetails = async (req, res) => {
    setCompanyDetailsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/getcompanydetails`, { companyId: id })
      if (data.success) {
        setcompanyDetails(data.company)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCompanyDetailsLoading(false)
    }
  }

  useEffect(() => {
    getCompanyDetails()
  }, [isFollowing]);

  console.log('companyDetails', companyDetails)

  if (companyDetailsLoading) {
    return <Loading />
  }

  return (
    <main className='p-4 min-h-[calc(100vh-4.6rem)]'>
      <section className='pb-8 border-b border-gray-300'>
        <div className='rounded-2xl overflow-hidden border-2 border-gray-500'>
          <Img src={companyDetails.banner} style={"w-full h-[30vh] object-cover"} />
        </div>

        <div className='flex items-center justify-between mt-4 px-8'>
          <div className='flex items-center gap-8'>
            {
              companyDetails.profilePicture ? <Img src={companyDetails.profilePicture} style={"w-32 h-32 rounded-full border-4 border-gray-500"} /> :
                <span className='w-32 h-32 rounded-full border-4 border-gray-500 flex items-center justify-center text-4xl font-bold text-gray-500'>
                  {companyDetails?.company?.slice(0, 1).toUpperCase()}
                </span>
            }

            <div className='flex flex-col gap-2'>
              <h1 className='font-bold'>
                {companyDetails.company}
              </h1>
              <div className='flex items-center gap-8'>
                <p className='flex text-gray-500 items-center gap-2'>
                  <CircleUser /> <span className='font-semibold'>{companyDetails.followers}</span> Followers
                </p>
                <p className='flex text-gray-500 items-center gap-2'>
                  <ArrowUpFromLine /> <span className='font-semibold'>{companyDetails?.sentJobs?.length}</span> Jobs Posted
                </p>
                <p className='flex text-gray-500 items-center gap-2'>
                  <Users /> <span className='font-semibold'>{companyDetails.members}</span> Members
                </p>
              </div>
              <div onClick={() => {
                copy(frontendUrl + location.pathname)
                toast.success('Copied to clipboard')

              }}
                className='flex mt-5 items-center gap-2 text-sm'
              >
                <Link size={20} />
                <span className='px-2 rounded-md bg-gray-200 cursor-pointer'>
                  {frontendUrl + location.pathname}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={followUnfollow}
              disabled={followLoading}
              className={`follow-btn mr-20 ${id === userData?.authId ? "hidden" : ""} `}
            >
              {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      </section>
      <section>
        {/* Navigation Bar */}
        <nav className='p-3 border-b border-gray-300'>
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
      <section className='min-h-[100vh] w-full flex gap-8'>
        <div className='w-full'>
          {activeTab === 'jobs' ? <CompanyJobs /> : <CompanyReviews />}
        </div>

        <aside className="w-[50%] bg-white border-l border-slate-200 overflow-y-auto shadow-lg">
          <div className="sticky top-0 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] px-6 py-6 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-xl text-white">Company Profile</h2>
            </div>
          </div>

          <div className='px-6 py-8 space-y-8'>
            {/* About Section */}
            <div className='bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200'>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  About
                </h3>
              </div>
              <p className='text-xl font-bold text-slate-900 mb-3'>
                {companyDetails?.company}
              </p>
              <span className='text-slate-600 leading-relaxed text-sm'>
                {companyDetails?.about || (
                  <span>
                    {companyDetails?.company} was established on{' '}
                    {companyDetails?.establishedAt
                      ? new Date(companyDetails.establishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : new Date(companyDetails?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    }
                  </span>
                )}
              </span>
              {companyDetails?.establishedAt && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600">
                    Established {new Date(companyDetails.establishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className='rounded-xl p-6 border border-slate-200 bg-white'>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  Get in Touch
                </h3>
              </div>
              <div className='space-y-4'>
                {companyDetails?.email ? (
                  <div className='flex items-start group'>
                    <div className="bg-blue-50 p-2 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <a href={`mailto:${companyDetails.email}`} className='text-blue-600 hover:text-blue-700 font-medium text-sm break-all'>
                        {companyDetails.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className='text-slate-400 italic text-sm'>No email available</p>
                )}

                {companyDetails?.contactNumber ? (
                  <div className='flex items-start group'>
                    <div className="bg-green-50 p-2 rounded-lg mr-3 group-hover:bg-green-100 transition-colors">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Phone</p>
                      <span className='text-slate-700 font-medium text-sm'>{companyDetails.contactNumber}</span>
                    </div>
                  </div>
                ) : (
                  <p className='text-slate-400 italic text-sm'>No phone available</p>
                )}

                {companyDetails?.website && (
                  <div className='flex items-start group'>
                    <div className="bg-purple-50 p-2 rounded-lg mr-3 group-hover:bg-purple-100 transition-colors">
                      <Globe className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Website</p>
                      <a href={`https://${companyDetails.website}`} target="_blank" rel="noopener noreferrer" className='text-purple-600 hover:text-purple-700 font-medium text-sm break-all'>
                        {companyDetails.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className='rounded-xl p-6 border border-slate-200 bg-white'>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  Location
                </h3>
              </div>
              <div className='flex items-center'>
                <div className="bg-red-50 p-2 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div className='text-slate-700 flex items-center gap-2'>
                  <span>
                    {companyDetails?.city && companyDetails.city},
                  </span>
                  <span>
                    {companyDetails?.state && companyDetails.state},
                  </span>
                  <span>
                    {companyDetails?.country && companyDetails.country}
                  </span>
                  {!companyDetails?.city && !companyDetails?.state && !companyDetails?.country && (
                    <p className='text-slate-400 italic text-sm'>No location available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default CompanyProfile
