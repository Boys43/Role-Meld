import React from 'react'
import { FaComputer } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

// React Icons
import { MdComputer } from "react-icons/md";
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import JobCard from '../components/JobCard';
import { FaFilter } from 'react-icons/fa';
import { MdLoop } from "react-icons/md";
import Loading from '../components/Loading';
import NotFound404 from '../components/NotFound404';

const CategoryJobs = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const category = search.get('category');
    const { backendUrl, userData } = useContext(AppContext)

    const [categoryJobs, setCategoryJobs] = useState([]);
    const [loading, setLoading] = useState(false)

    const getCategoryJobs = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/jobs/getcategoryjobs', { category });
            if (data.success) {
                setCategoryJobs(data.approvedCategoryJobs);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    const [filteredJobType, setFilteredJobType] = useState('jobType');
    const [filteredLocationType, setFilteredLocationType] = useState('locationType')
    const [subCategory, setSubCategory] = useState('');

    const filteredJobs = categoryJobs?.filter((job) => {
        return (
            (filteredLocationType === "locationType" || job.locationType === filteredLocationType) &&
            (filteredJobType === "jobType" || job.jobType === filteredJobType) &&
            (subCategory === '' || job.subCategory === subCategory)
        );
    });

    const gradients = [
        "from-violet-900 to-violet-600",   // Dark Violet → Lighter Violet
        "from-indigo-900 to-indigo-600",   // Dark Indigo → Lighter Indigo
        "from-blue-900 to-blue-600",       // Dark Blue → Light Blue
        "from-cyan-900 to-cyan-600",       // Dark Cyan → Lighter Cyan
        "from-slate-900 to-slate-600",     // Almost Black → Medium Gray
        "from-emerald-900 to-emerald-600", // Dark Green → Fresh Green
        "from-rose-900 to-rose-600",       // Deep Rose → Softer Rose
    ];

    const categoryDetails = [
        {
            name: "IT & Software",
            desc: "Build and manage modern digital solutions",
        },
        {
            name: "Digital Marketing",
            desc: "Promote brands and grow online presence",
        },
        {
            name: "Design & Creative",
            desc: "Craft visuals that inspire and engage",
        },
        {
            name: "Finance & Accounting",
            desc: "Manage money, taxes, and financial records",
        },
        {
            name: "Human Resources",
            desc: "Recruit, train, and support workplace teams",
        },
        {
            name: "Sales & Business Development",
            desc: "Drive growth and expand business opportunities",
        },
        {
            name: "Engineering & Architecture",
            desc: "Design, build, and innovate real-world structures",
        },
    ];

    const categories = {
        "IT & Software": [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Mobile App Developer",
            "UI/UX Designer",
            "Data Scientist",
            "AI / ML Engineer",
            "DevOps Engineer",
            "QA / Tester",
        ],
        "Digital Marketing": [
            "SEO Specialist",
            "Content Marketing",
            "Social Media Marketing",
            "Email Marketing",
            "PPC / Ads",
            "Affiliate Marketing",
        ],
        "Design & Creative": [
            "Graphic Designer",
            "Illustrator",
            "Animator",
            "Product Designer",
            "Presentation Designer",
        ],
        "Finance & Accounting": [
            "Accountant",
            "Bookkeeper",
            "Financial Analyst",
            "Tax Consultant",
            "Audit & Compliance",
        ],
        "Human Resources": [
            "HR Manager",
            "Recruiter",
            "Training & Development",
            "Virtual Assistant",
        ],
        "Sales & Business Development": [
            "Sales Executive",
            "Business Development Manager",
            "Account Manager",
            "Lead Generation",
        ],
        "Engineering & Architecture": [
            "Civil Engineer",
            "Mechanical Engineer",
            "Electrical Engineer",
            "Architect",
            "Project Manager",
        ],
    };

    const [randomGradient, setRandomGradient] = useState("");
    useEffect(() => {
        const newGradient = gradients[Math.floor(Math.random() * gradients.length)];
        setRandomGradient(newGradient);
        getCategoryJobs();
    }, [category])

    // Loading
    if (loading) {
        return  <Loading />
    }

    return (
        <main className='p-6'>
            <section
                className={`py-12 rounded-2xl shadow-2xl bg-gradient-to-br ${randomGradient}`}
            >
                <h1 className="text-3xl font-bold text-center text-white flex flex-col items-center justify-center gap-2">
                    <MdComputer size={60} /> {category} <span className='text-lg font-semibold'>
                        {categoryDetails.filter(category1 => category1.name === category).map(category1 => category1.desc)}
                    </span>
                </h1>
            </section>
            <section className="p-2">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={5}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        480: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    className="p-4"
                >
                    {categories[category].map((e, i) => (
                        <SwiperSlide
                            key={i}
                            className="py-4 my-4 px-6 text-xl font-semibold bg-white rounded-2xl border whitespace-nowrap cursor-pointer shadow hover:shadow-lg transition"
                            onClick={(i) => {
                                i.preventDefault();
                                setSubCategory(e);
                            }}
                        >
                            {e}
                        </SwiperSlide>
                    ))}
                </Swiper>
                <span
                onClick={()=> setSubCategory('')}
                className='w-full flex items-center gap-2 cursor-pointer justify-end'>
                    <MdLoop size={20}/> Reset
                </span>
            </section>
            <section className='p-2'>
                <h3 className='flex items-center gap-4 font-semibold'>
                    <IoHomeOutline size={30} className='text-[var(--primary-color)]' /> / {category} {subCategory === '' ? '' : '/ ' + subCategory}
                </h3>
            </section>
            <section className='mt-5 p-2'>
                <div className='flex items-center gap-8'>
                    <h2 className='flex items-center gap-4 font-semibold'>
                        <FaFilter className='text-[var(--primary-color)]' /> Filter:
                    </h2>
                    <div className='flex items-center gap-4'>
                        <select name="jobType" id="jobType"
                            className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
                            onChange={(e) => setFilteredJobType(e.target.value)}
                        >
                            <option value="jobType">Job Type</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                        </select>

                        <select name="LocationType" id="LocationType"
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
                    {filteredJobs.length !== 0 ? filteredJobs?.map((e, i) => (
                        <JobCard key={i} e={e} />
                    )): <NotFound404 value={"No Jobs Found"} margin={"my-10"} />}
                </div>
            </section>
        </main>
    )
}

export default CategoryJobs
