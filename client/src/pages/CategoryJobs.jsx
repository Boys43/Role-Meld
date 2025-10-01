import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { MdComputer, MdLoop } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import NotFound404 from '../components/NotFound404';
import "swiper/css";

const CategoryJobs = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const category = search.get('category');
  const { backendUrl } = useContext(AppContext);

  const [categoryJobs, setCategoryJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [filteredJobType, setFilteredJobType] = useState('jobType');
  const [filteredLocationType, setFilteredLocationType] = useState('locationType');
  const [subCategory, setSubCategory] = useState('');

  const gradients = [
    "from-violet-900 to-violet-600",
    "from-indigo-900 to-indigo-600",
    "from-blue-900 to-blue-600",
    "from-cyan-900 to-cyan-600",
    "from-slate-900 to-slate-600",
    "from-emerald-900 to-emerald-600",
    "from-rose-900 to-rose-600",
  ];
  const [randomGradient, setRandomGradient] = useState("");

  const getCategoryJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getcategoryjobs`, { category });
      if (data.success) setCategoryJobs(data.approvedCategoryJobs);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/categories`);
      if (data.success) setCategories(data.categories);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    getCategoryJobs();
    getCategories();
    const newGradient = gradients[Math.floor(Math.random() * gradients.length)];
    setRandomGradient(newGradient);
  }, [category]);

  const filteredJobs = categoryJobs.filter((job) =>
    (filteredLocationType === "locationType" || job.locationType === filteredLocationType) &&
    (filteredJobType === "jobType" || job.jobType === filteredJobType) &&
    (subCategory === '' || job.subCategory === subCategory)
  );

  if (loading || categoriesLoading) return <Loading />;

  const currentCategory = categories.find(cat => cat.name === category);

  console.log('', currentCategory);
  

  return (
    <main className='p-6'>
      <section className={`py-12 rounded-2xl shadow-2xl bg-gradient-to-br ${randomGradient}`}>
        <h1 className="text-3xl font-bold text-center text-white flex flex-col items-center justify-center gap-2">
          <MdComputer size={60} /> {category}
        </h1>
      </section>

      {/* Subcategories */}
      <section className="p-2 mt-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {currentCategory?.subcategories?.map((sub, i) => (
            <SwiperSlide
              key={i}
              className="py-4 my-4 px-6 text-xl font-semibold bg-white rounded-2xl border whitespace-nowrap cursor-pointer shadow hover:shadow-lg transition"
              onClick={() => setSubCategory(sub)}
            >
              {sub}
            </SwiperSlide>
          ))}
        </Swiper>
        {subCategory && (
          <span
            onClick={() => setSubCategory('')}
            className='w-full flex items-center gap-2 cursor-pointer justify-end mt-2'
          >
            <MdLoop size={20} /> Reset
          </span>
        )}
      </section>

      {/* Breadcrumb */}
      <section className='p-2'>
        <h3 className='flex items-center gap-4 font-semibold'>
          <IoHomeOutline size={30} className='text-[var(--primary-color)]' /> / {category} {subCategory && `/ ${subCategory}`}
        </h3>
      </section>

      {/* Filters */}
      <section className='mt-5 p-2'>
        <div className='flex items-center gap-8'>
          <h2 className='flex items-center gap-4 font-semibold'>
            <FaFilter className='text-[var(--primary-color)]' /> Filter:
          </h2>
          <div className='flex items-center gap-4'>
            <select
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
              onChange={(e) => setFilteredJobType(e.target.value)}
            >
              <option value="jobType">Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
              onChange={(e) => setFilteredLocationType(e.target.value)}
            >
              <option value="locationType">Location Type</option>
              <option value="Remote">Remote</option>
              <option value="On Site">On Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className='grid my-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredJobs.length !== 0
            ? filteredJobs.map((job, i) => <JobCard key={i} e={job} />)
            : <NotFound404 value={"No Jobs Found"} margin={"my-10"} />}
        </div>
      </section>
    </main>
  );
};

export default CategoryJobs;
