import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import { Check } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Pricing = () => {
    const { backendUrl } = useContext(AppContext);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    // Fetch packages from backend
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/packages`);
                if (data.success) {
                    // Filter only active packages and sort by displayOrder
                    const activePackages = data.packages
                        .filter(pkg => pkg.isActive)
                        .sort((a, b) => a.displayOrder - b.displayOrder);
                    setPackages(activePackages);
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [backendUrl]);

    // Determine if package should have recommended badge (middle package or highest price)
    const getRecommendedIndex = () => {
        if (packages.length === 0) return -1;
        if (packages.length === 1) return 0;
        if (packages.length === 2) return 1;
        // For 3+ packages, return middle index
        return Math.floor(packages.length / 2);
    };

    const recommendedIndex = getRecommendedIndex();

    const faqs = [
        {
            q: "Can I edit my job listing after it's posted?",
            a: "Yes. You can edit title, description, location, and compensation from your dashboard. Changes publish instantly and candidates see the updated post right away.",
        },
        {
            q: "Are there any additional fees attached to my job post?",
            a: "No hidden fees. You pay only the plan price shown. Taxes may apply depending on your billing region.",
        },
        {
            q: "How do refunds work?",
            a: "Annual plans are eligible for prorated refunds within 7 days of purchase. Posted jobs are non-refundable once applications have been received.",
        },
        {
            q: "How do I get started hiring on Alfa Careers?",
            a: "Create a recruiter account, choose a plan, and publish your first job. Guided steps and prompts help you complete the listing in minutes.",
        },
        {
            q: "How do I get access to my team's company profile?",
            a: "Invite teammates from the dashboard and assign roles. Admins control access, and domain verification links your company profile automatically.",
        },
    ];

    return (
        <div>
            <Navbar />
            <div className='my-20 text-center px-3 lg:p-0 flex flex-col items-center gap-2'>
                <h4 className='text-2xl font-semibold text-black'>
                    Simple, transparent pricing
                </h4>
                <p className='text-gray-500'>
                    Our simple, per-job pricing scales with you.
                </p>

                {loading ? (
                    <div className='mt-10 text-gray-500'>Loading packages...</div>
                ) : packages.length === 0 ? (
                    <div className='mt-10 text-gray-500'>No packages available at the moment.</div>
                ) : (
                    <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4'>
                        {packages.map((pkg, index) => {
                            const isRecommended = index === recommendedIndex;
                            const isFree = pkg.price === 0;

                            return (
                                <div
                                    key={pkg._id}
                                    className={`hover:shadow-xl shadow-gray-200 transition-all relative rounded-lg cursor-pointer border ${isRecommended ? 'border-yellow-400' : 'border-gray-200'
                                        } bg-white p-8`}
                                >
                                    <p className='text-[var(--primary-color)] font-semibold uppercase text-sm'>
                                        {pkg.name}
                                    </p>

                                    <div className='mt-3 flex items-end gap-1'>
                                        {!isFree && (
                                            <span className='text-xl self-start text-black'>{pkg.currency === 'USD' ? '$' : pkg.currency}</span>
                                        )}
                                        <h4 className='text-5xl font-semibold text-black'>
                                            {isFree ? 'Free' : pkg.price}
                                        </h4>
                                        <span className='text-gray-500 text-lg'>
                                            /{pkg.duration >= 365 ? 'year' : pkg.duration >= 30 ? 'month' : `${pkg.duration} days`}
                                        </span>
                                    </div>

                                    {isRecommended && (
                                        <span className='absolute right-6 top-6 rounded-full bg-yellow-400/30 text-yellow-800 text-sm font-semibold px-3 py-1'>
                                            Recommended
                                        </span>
                                    )}

                                    <div className='my-6 h-px bg-gray-200' />

                                    <div className='space-y-5 overflow-auto max-h-48 text-gray-700'>
                                        {/* Job Postings */}
                                        <div className='flex items-center gap-3'>
                                            <Check className={isRecommended ? 'text-[var(--primary-color)]' : 'text-green-900'} size={20} />
                                            <span>{pkg.jobPostings} job posting{pkg.jobPostings !== 1 ? 's' : ''}</span>
                                        </div>

                                        {/* Featured Jobs */}
                                        {pkg.featuredJobs > 0 && (
                                            <div className='flex items-center gap-3'>
                                                <Check className={isRecommended ? 'text-[var(--primary-color)]' : 'text-green-900'} size={20} />
                                                <span>{pkg.featuredJobs} featured job{pkg.featuredJobs !== 1 ? 's' : ''}</span>
                                            </div>
                                        )}

                                        {/* Candidate Access */}
                                        {pkg.candidateAccess && (
                                            <div className='flex items-center gap-3'>
                                                <Check className={isRecommended ? 'text-[var(--primary-color)]' : 'text-green-900'} size={20} />
                                                <span>Candidate database access</span>
                                            </div>
                                        )}

                                        {/* Custom Features */}
                                        {pkg.features && pkg.features.length > 0 && pkg.features.map((feature, idx) => (
                                            <div key={idx} className='flex items-center gap-3'>
                                                <Check className={isRecommended ? 'text-[var(--primary-color)]' : 'text-green-900'} size={20} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className={`${isRecommended ? 'primary-btn' : 'secondary-btn'} w-full mt-10`}>
                                        Get Started
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className='mt-16 w-full max-w-3xl px-4'>
                    <p className='font-semibold text-black text-center'>FAQ'S</p>
                    <h2 className='text-2xl sm:text-3xl font-semibold text-center text-black mt-2'>
                        Any questions? We're here to help
                    </h2>

                    <div className='mt-8 space-y-6'>
                        {faqs.map((item, i) => {
                            const open = openIndex === i;
                            return (
                                <div key={i} className='rounded-3xl border border-gray-200 bg-white'>
                                    <button
                                        type='button'
                                        className='w-full flex items-center justify-between px-6 py-6'
                                        onClick={() => setOpenIndex(open ? null : i)}
                                    >
                                        <span className='text-black'>{item.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`text-black transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </button>
                                    <div className={`px-6 transition-all duration-300 overflow-hidden ${open ? 'max-h-40 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}>
                                        <p className='text-gray-600'>{item.a}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className='mt-8 text-center'>
                        <p className='text-sm text-black'>Have a question not covered in the FAQ?</p>
                        <button className='mt-3 primary-btn'>Contact us</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing