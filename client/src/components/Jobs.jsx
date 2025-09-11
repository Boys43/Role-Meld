import React from 'react'

const Jobs = () => {
    const jobs = [
        { id: 1, title: "Jobs for Programmers", desc: "Find the best programming jobs here." },
        { id: 2, title: "Frontend Developer Jobs", desc: "Explore frontend developer positions." },
        { id: 3, title: "Backend Engineer Opportunities", desc: "Discover backend engineer roles." },
        { id: 4, title: "Data Scientist Roles", desc: "Uncover data scientist job openings." },
        { id: 5, title: "Full Stack Programmer Jobs", desc: "Find full stack programmer positions." },
    ];

    jobs.filter((job) => {
        job.title.toLowerCase().includes(Search.toLowerCase())
    })
    return (
        <div>

        </div>
    )
}

export default Jobs
