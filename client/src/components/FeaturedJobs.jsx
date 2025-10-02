import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import FeaturedJobCard from "./FeaturedJobCard";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import NotFound404 from "./NotFound404";
import CoverLetterModal from './CoverLetterModal';
import LoginReminderModal from './LoginReminderModal';

const FeaturedJobs = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [sponsoredJobs, setSponsoredJobs] = useState([]);
  const [sponsoredJobsLoading, setSponsoredJobsLoading] = useState(false)
  const getSponsoredJobs = async () => {
    setSponsoredJobsLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getsponsoredjobs`);
      if (data.success) {
        setSponsoredJobs(data.sponsoredJobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSponsoredJobsLoading(false);
    }
  }

  useEffect(() => {
    getSponsoredJobs();
  }, [])

  const [toggleApplyJob, setToggleApplyJob] = useState(false)
  const [applJobId, setapplJobId] = useState('')
  const [coverLetter, setCoverLetter] = useState('');
  const applyJob = async (id) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/applyjob', { jobId: id, resume: userData?.resume, coverLetter: coverLetter });

      if (data.success) {
        toast.success(data.message);
        setToggleApplyJob(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Login Reminder Pop Up
  const [loginReminder, setLoginReminder] = useState(false);

  if (sponsoredJobsLoading) {
    return <Loading />
  }

  return (
    <div className="my-4 z-0 relative">
      <Swiper
        modules={[Autoplay]}
        loop={sponsoredJobs.length >= 2}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
        }}
      >
        {sponsoredJobs.length > 0 ? sponsoredJobs.map((job, index) => (
          <SwiperSlide><FeaturedJobCard setLoginReminder={setLoginReminder} setapplJobId={setapplJobId} setToggleApplyJob={setToggleApplyJob} data={job} key={index} /></SwiperSlide>
        )) :
          <NotFound404 margin={"mt-5"} value={"No Recent Sponsored Jobs"} />
        }
      </Swiper>
      {/* Apply Job Modal */}
      <CoverLetterModal 
        isOpen={toggleApplyJob}
        onClose={() => setToggleApplyJob(false)}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        onApply={() => applyJob(applJobId)}
      />

      {/* Login Reminder Modal */}
      <LoginReminderModal 
        isOpen={loginReminder}
        onClose={() => setLoginReminder(false)}
        showLoginForm={false}
      />
    </div>
  );
};

export default FeaturedJobs;