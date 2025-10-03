import React, { useContext, useEffect, useState } from 'react'
import Img from '../components/Image'
import assets from '../assets/assets'
import { ArrowUpFromLine, CircleUser, Filter, Link, PercentSquareIcon, PersonStanding, Users } from "lucide-react"
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import JobCard from '../components/JobCard';
import NotFound404 from '../components/NotFound404';

export const CompanyJobs = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();

  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [filter, setFilter] = useState("recent"); // default filter

  // Fetch company jobs
  const getCompanyJobs = async () => {
    setCompanyLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobsbyid`, { id });
      if (data.success) {
        setCompanyJobs(data.companyJobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
    <div className="p-4 flex items-start gap-8 ">
      <div className="w-[70%]">
        {/* Filters */}
        <div className="flex items-center gap-4 p-4">
          <h3 className='font-semibold flex items-center gap-3'>
            <Filter className='text-[var(--primary-color)]' />
            Filter:
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

        {/* Jobs list */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} e={job} />)
          ) : (
            <NotFound404 value={"No Job Found"} margin={"mt-5"} />
          )}
        </ul>
      </div>

      <div className="w-[30%] border p-4">
        {/* Sidebar or additional info */}
        <h2 className="font-bold text-lg">Company Info</h2>
      </div>
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

  const { backendUrl, userData } = useContext(AppContext);
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

  if (companyDetailsLoading) {
    return <Loading />
  }

  console.log('companyDetails', companyDetails)

  return (
    <main className='p-4 min-h-[calc(100vh-4.6rem)]'>
      <section className='pb-8 border-b border-gray-300'>
        <div className='rounded-2xl overflow-hidden border-2 border-gray-500'>
          <Img src={`${backendUrl}/uploads/${companyDetails.banner}`} style={"w-full h-[25vh] object-cover"} />
        </div>

        <div className='mt-3 w-full py-1 text-center'>
          Headline Here
        </div>

        <div className='flex items-center justify-between mt-4 px-8'>
          <div className='flex items-center gap-8'>
            {companyDetails.profilePicture ? <Img src={`${backendUrl}/uploads/${companyDetails.profilePicture}`} style={"w-32 h-32 rounded-full border-4 border-gray-500"} /> :
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
            <button
              onClick={followUnfollow}
              disabled={followLoading}
              className='follow-btn mr-20'
            >
              {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
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
      <section className='min-h-[100vh]'>
        {activeTab === 'jobs' ? <CompanyJobs /> : <CompanyReviews />}
      </section>
    </main>
  )
}

export default CompanyProfile
