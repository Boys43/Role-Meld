import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Check } from 'lucide-react'
import { ChevronDown } from 'lucide-react'

const Pricing = () => {
  return (
    <div>
        <Navbar />
        <div className='py-20 text-center px-3 lg:p-0 flex flex-col items-center gap-2'>
            <h4 className='text-2xl font-semibold  text-black'>
                Simple, transparent pricing
            </h4>
            <p className='text-gray-500'>
                Our simple, per-job pricing scales with you.
            </p>
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4'>
                <div className='hover:shadow-xl shadow-gray-200 transition-all  relative rounded-lg cursor-pointer border border-gray-200 bg-white p-8'>
                    <p className='text-[var(--primary-color)] font-semibold uppercase text-sm'>Trial</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <h4 className='text-5xl font-semibold text-black'>Free</h4>
                        <span className='text-gray-500 text-lg'>/month</span>
                    </div>
                    <div className='my-6 h-px bg-gray-200' />
                    <div className='space-y-5 overflow-auto max-h-48 text-gray-700'>
                        <div className='flex items-center gap-3'><Check className='text-green-900' size={20} /> <span>5 job postings</span></div>
                        <div className='flex items-center gap-3'><Check className='text-green-900' size={20} /> <span>1 featured job</span></div>
                        <div className='flex items-center gap-3'><Check className='text-green-900' size={20} /> <span>2 candidates follow</span></div>
                        <div className='flex items-center gap-3'><Check className='text-green-900' size={20} /> <span>Limited support</span></div>
                    </div>
                    <button className='mt-10 w-full secondary-btn'>Get Started</button>
                </div>

                <div className='hover:shadow-xl shadow-gray-200 transition-all  relative rounded-lg cursor-pointer border border-yellow-400 bg-white p-8'>
                    <p className='text-[var(--primary-color)] font-semibold uppercase text-sm'>Extended</p>
                    <div className='mt-3 flex items-end gap-1'>
                        <span className='text-xl self-start text-black'>$</span>
                        <h4 className='text-5xl font-semibold text-black'>180</h4>
                        <span className='text-gray-500 text-lg'>/year</span>
                    </div>
                    <span className='absolute right-6 top-6 rounded-full bg-yellow-400/30 text-yellow-800 text-sm font-semibold px-3 py-1'>Recommended</span>
                    <div className='my-6 h-px bg-gray-200' />
                    <div className='space-y-5 text-gray-700 max-h-48 overflow-y-auto pr-1'>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>999 job postings</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>30 featured jobs</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>2 candidates follow</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>Invite Candidates</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>Send Messages</span></div>
                    </div>
                    <button className='primary-btn w-full mt-10'>Get Started</button>
                </div>

                <div className='hover:shadow-xl shadow-gray-200 transition-all  relative rounded-lg border border-gray-200 bg-white p-8 cursor-pointer'>
                    <p className='text-[var(--primary-color)] font-semibold uppercase text-sm'>Basic</p>
                    <div className='mt-3 flex items-end gap-1'>
                        <span className='text-xl self-start text-black'>$</span>
                        <h4 className='text-5xl font-semibold text-black'>90</h4>
                        <span className='text-gray-500 text-lg'>/year</span>
                    </div>
                    <div className='my-6 h-px bg-gray-200' />
                    <div className='space-y-5 text-gray-700 max-h-48 overflow-y-auto pr-1'>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>99 job postings</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>7 featured jobs</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>Print candidate profiles</span></div>
                        <div className='flex items-center gap-3'><Check className='text-[var(--primary-color)]' size={20} /> <span>Limited support</span></div>
                    </div>
                    <button className='secondary-btn w-full mt-10'>Get Started</button>
                </div>
            </div>
            <div className='mt-16 w-full max-w-3xl px-4'>
                <p className='font-semibold text-black text-center'>FAQ'S</p>
                <h2 className='text-2xl sm:text-3xl font-semibold text-center text-black mt-2'>Any questions? We’re here to help</h2>
                {(() => {
                    const faqs = [
                        {
                            q: "Can I edit my job listing after it’s posted?",
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
                            q: "How do I get access to my team’s company profile?",
                            a: "Invite teammates from the dashboard and assign roles. Admins control access, and domain verification links your company profile automatically.",
                        },
                    ];
                    const [openIndex, setOpenIndex] = useState(null);
                    return (
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
                    );
                })()}
                <div className='mt-8 text-center'>
                    <p className='text-sm text-black'>Have a question not covered in the FAQ?</p>
                    <button className='mt-3 primary-btn'>Contact us</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Pricing