import { GalleryVerticalEnd } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import NotFound404 from '../components/NotFound404'
import Img from '../components/Image'
import { useNavigate } from 'react-router-dom'

const FollowedAccounts = () => {
    // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const navigate = useNavigate()

  const { backendUrl, userData } = useContext(AppContext)
  const [followedaccountsLoading, setFollowedaccountsLoading] = useState(false);
  const [followedaccounts, setFollowedaccounts] = useState([])
  const getFollowedAccounts = async () => {
    setFollowedaccountsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/followedaccounts`)
      if (data.success) {
        setFollowedaccounts(data.companies)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setFollowedaccountsLoading(false);
    }
  }

  useEffect(() => {
    getFollowedAccounts();
  }, [])

  console.log(followedaccounts);

  // Loading 
  if (followedaccountsLoading) return <Loading />

  return (
    <div className='p-6 w-full min-h-[calc(100vh-4.6rem)]'>
      <h1 className='font-semibold flex items-center gap-3'>
        <GalleryVerticalEnd size={30} className='text-[var(--primary-color)]' /> Followed Accounts
      </h1>
      <div className="p-6 mt-4 border w-full bg-white rounded-xl">
        {followedaccounts.length === 0 ? (
          <NotFound404 value={"No Followed Accounts Yet"} />
        ) : (
          followedaccounts?.map((acc, i) => (
            <div className='flex items-center gap-4 '>
              <div className='text-lg border w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 border-gray-300'>
                {i + 1}
              </div>
              <div
                key={acc._id}
                onClick={() => navigate(`/company-profile/${acc?.authId}`)}
                className="flex items-center justify-between w-full bg-white/70 
              cursor-pointer backdrop-blur-sm hover:bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-4xl p-1 px-6 mb-3 transition-all duration-300"
              >

                <div className="flex items-center gap-4">
                  {acc.profilePicture ? (
                    <Img
                      src={backendUrl + "/uploads/" + acc.profilePicture}
                      style="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-bold shadow-sm">
                      {acc?.company?.slice(0, 1)?.toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{acc.name}</h3>
                    <p className="text-sm text-gray-500">{acc.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Followers
                  <span className="font-bold text-lg text-[var(--primary-color)]">{acc.followers}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default FollowedAccounts
