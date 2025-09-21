import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'

const Search = () => {
    const [searchJob, setSearchJob] = useState('')
    const navigate = useNavigate()

    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const query = search.get('jobs');

    return (
        <section
            id="search"
            className="shadow-2xl w-[70vw] mx-auto border-[1px] border-[var(--primary-color)] rounded-2xl"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // stop default reload
                    if (location.pathname !== "/find-jobs" && searchJob !== "") {
                        navigate("/find-jobs?job=" + searchJob);
                    }
                }}
                className="flex w-full items-center">
                <div className="flex w-full text-white relative">
                    <FaSearch
                        size={15}
                        className="absolute left-6 top-1/2 -translate-y-1/2 "
                    />
                    <input
                        value={searchJob || query}
                        required={true}
                        onChange={(e) => setSearchJob(e.target.value)}
                        className="border-3 border-transparent focus:border-[var(--primary-color)] 
                  focus:outline-none py-3 pl-14 rounded-2xl w-full transition-all"
                        type="text"
                        placeholder="Job title, keywords, or company"
                    />
                </div>
                <div className='p-1'>
                    <button
                        type='submit'
                    >
                        Find <FaSearch />
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Search
