import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Download, Eye, Mail, MoreVerticalIcon, Phone, Search, Trash } from 'lucide-react'
import CustomSelect from './CustomSelect';
import Img from './Image';

const applicants = () => {
    const [applicants, setapplicants] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [cityFilter, setCityFilter] = useState("all")
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)


    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, cityFilter, itemsPerPage])

    const availableCities = useMemo(() => (
        Array.from(new Set(applicants.map(applicant => applicant.city))).filter(Boolean)
    ), [applicants])

    const filteredapplicants = useMemo(() => {
        return applicants.filter(applicant => {
            const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
                || applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = cityFilter === 'all' || applicant.city === cityFilter
            return matchesSearch && matchesCity
        })
    }, [applicants, searchTerm, cityFilter])

    const totalPages = Math.ceil(filteredapplicants.length / itemsPerPage) || 1
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedapplicants = filteredapplicants.slice(startIndex, endIndex)

    const sampleApplicants = [
        { name: "applicant", status: "pending", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 1 },
        { name: "applicant", status: "approved", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 2, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "rejected", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 3, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "pending", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 4, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "approved", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 5, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "rejected", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 6, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "pending", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 7, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "approved", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 8, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "rejected", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 9, profilePicture: 'https://picsum.photos/200/200' },
        { name: "applicant", status: "pending", createdAt: Date.now(), email: "nt50616840@gmail.com", phone: "1234567890", cv: "https://via.placeholder.com/150", id: 10, profilePicture: 'https://picsum.photos/200/200' },
    ]

    useEffect(() => {
        setapplicants(sampleApplicants)
    }, [])


    return (
        <div className="bg-white rounded-xl w-full min-h-screen border border-gray-200 p-6 rouned-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray-800 mb-3">
                    All Applicants
                </h1>
            </div>

            {/* Filters */}
            <div className='flex flex-col justify-between lg:flex-row lg:items-center gap-4 mt-6 mb-6'>
                <div className="relative w-full lg:w-1/2">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                </div>
                <div className='flex gap-3 w-full lg:w-auto'>
                    <CustomSelect
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    >
                        <option value="all">All Cities</option>
                        {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </CustomSelect>

                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto rounded-lg border border-gray-200'>
                <table className='min-w-full bg-white'>
                    <thead>
                        <tr className='text-black uppercase text-sm'>
                            <th className='px-6 py-6 text-left'>Name</th>
                            <th className='px-6 py-6 text-left'>Status</th>
                            <th className='px-6 py-6 text-left'>Information</th>
                            <th className='px-6 py-6 text-left'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedapplicants.length === 0 && (
                            <tr>
                                <td colSpan={4} className='px-6 py-6 text-center text-gray-500'>
                                    No applicants found.
                                </td>
                            </tr>
                        )}
                        {paginatedapplicants.map(applicant => (
                            <tr key={applicant.id} className='border-t border-gray-100 hover:bg-gray-50'>
                                <td className='px-6 py-4 flex items-center gap-4'>
                                    <Img src={'/placeholder.png'} style='w-12 h-12 rounded-full' />
                                    <div>
                                        <div className='font-semibold text-gray-800'>{applicant.name}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`${applicant.status === "pending" ? "bg-yellow-100 text-yellow-800" : applicant.status === "approved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} px-2 py-1 rounded-full text-sm text-center capitalize w-24`}>
                                        {applicant.status}
                                    </div>
                                    <div className='text-sm mt-2'>
                                        Applied: <span className='text-gray-400 italic'>{new Date(applicant.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        </span>
                                    </div>
                                </td>
                                <td className='space-y-1'>
                                    <div className='text-sm flex items-center gap-2'>
                                        <Mail size={20} /> {applicant?.email}
                                    </div>
                                    <div className='text-sm flex items-center gap-2'>
                                        <Phone size={20} /> {applicant?.phone}
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex justify-end gap-4 cursor-pointer'>
                                        <a
                                            download={applicant?.cv}
                                            href={applicant?.cv}
                                            target='_blank'
                                        >
                                            <Download size={20} />
                                        </a>
                                        <button
                                            onClick={() => handleToggleFollow(applicant)}
                                        >
                                            <MoreVerticalIcon size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredapplicants.length > 0 && (
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6'>
                    <div className='flex items-center gap-4'>
                        <div className='text-sm text-gray-600'>
                            Showing {filteredapplicants.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredapplicants.length)} of {filteredapplicants.length}
                        </div>
                        <div>
                            <CustomSelect
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                {[5, 10, 25].map(size => (
                                    <option key={size} value={size}>{size} / page</option>
                                ))}
                            </CustomSelect>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className='px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50'
                        >
                            Previous
                        </button>
                        <span className='text-sm text-gray-600'>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className='px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default applicants