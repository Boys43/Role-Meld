import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import CustomSelect from "./CustomSelect"; // your custom select
import Img from "./Image";
import NotFound404 from "./NotFound404";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Currency from "./CurrencyCovertor";

const formatDateShort = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
};

const useDebounce = (value, ms = 300) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

const SavedJobs = () => {
  const { backendUrl, toggleSaveJob } = useContext(AppContext);
  const [allsavedJobs, setAllsavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Filters & search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState(""); // "applied" | "not_applied" | ""

  // Sorting (simple)
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest

  // fetch
  const getSavedJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getsavedjobs`);
      if (data?.success) {
        setAllsavedJobs(data.savedJobs || []);
      } else {
        setAllsavedJobs([]);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Analytics computed values
  const analytics = useMemo(() => {
    const total = allsavedJobs.length;
    const applied = allsavedJobs.filter((j) => Array.isArray(j.applicants) && j.applicants.length > 0).length;
    const remote = allsavedJobs.filter((j) => j.remoteOption === true || j.locationType === "Remote").length;
    const fullTime = allsavedJobs.filter((j) => /full/i.test(j.jobType || "")).length;
    const avgSalary =
      allsavedJobs.reduce((s, j) => s + (Number(j.salary) || 0), 0) / (allsavedJobs.length || 1);

    return {
      total,
      applied,
      remote,
      fullTime,
      avgSalary: Math.round(avgSalary),
    };
  }, [allsavedJobs]);

  // Filtering pipeline
  const filteredJobs = useMemo(() => {
    let list = [...allsavedJobs];

    if (debouncedSearch?.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (j) =>
          String(j.title || "").toLowerCase().includes(q) ||
          String(j.company || "").toLowerCase().includes(q)
      );
    }

    if (jobTypeFilter) {
      list = list.filter((j) => (j.jobType || "").toLowerCase() === jobTypeFilter.toLowerCase());
    }

    if (locationTypeFilter) {
      list = list.filter((j) => (j.locationType || "").toLowerCase() === locationTypeFilter.toLowerCase());
    }

    if (appliedFilter) {
      if (appliedFilter === "applied") {
        list = list.filter((j) => Array.isArray(j.applicants) && j.applicants.length > 0);
      } else if (appliedFilter === "not_applied") {
        list = list.filter((j) => !Array.isArray(j.applicants) || j.applicants.length === 0);
      }
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return list;
  }, [allsavedJobs, debouncedSearch, jobTypeFilter, locationTypeFilter, appliedFilter, sortBy]);

  // handle unsave (optimistic)
  const handleUnsaveJob = async (jobId) => {
    const prev = [...allsavedJobs];
    setAllsavedJobs((p) => p.filter((j) => j._id !== jobId));
    try {
      await toggleSaveJob(jobId); // your context fn that toggles
      toast.success("Job unsaved");
      // refetch for safety:
      getSavedJobs();
    } catch (err) {
      setAllsavedJobs(prev);
      toast.error(err?.message || "Failed to unsave job");
    }
  };

  return (
    <div className="p-6 w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="font-bold text-2xl flex items-center gap-3">
          Saved Jobs <span className="text-lg opacity-80">({analytics.total})</span>
        </h1>

        {/* Search + controls */}
        <div className="w-full md:w-auto flex gap-3 items-center">
          <div className="relative w-full md:w-80">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title or company..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FaSearch />
            </div>
          </div>

          <CustomSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </CustomSelect>
        </div>
      </div>

      {/* Analytics boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 shadow-md rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500">Total saved</div>
          <div className="mt-2 text-2xl font-semibold">{analytics.total}</div>
          <div className="text-xs text-gray-400 mt-1">Saved jobs in your account</div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500">Applied</div>
          <div className="mt-2 text-2xl font-semibold">{analytics.applied}</div>
          <div className="text-xs text-gray-400 mt-1">Jobs you already applied to</div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500">Remote / Hybrid</div>
          <div className="mt-2 text-2xl font-semibold">{analytics.remote}</div>
          <div className="text-xs text-gray-400 mt-1">Remote job count</div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500">Full Time</div>
          <div className="mt-2 text-2xl font-semibold">{analytics.fullTime}</div>
          <div className="text-xs text-gray-400 mt-1">Full time positions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <div className="col-span-1 md:col-span-1">
          <CustomSelect
            name="jobType"
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className=""
          >
            <option value="">All job types</option>
            {/* Use common options, you can change */}
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </CustomSelect>
        </div>

        <div className="col-span-1 md:col-span-1">
          <CustomSelect
            name="locationType"
            value={locationTypeFilter}
            onChange={(e) => setLocationTypeFilter(e.target.value)}
          >
            <option value="">All locations</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </CustomSelect>
        </div>

        <div className="col-span-1 md:col-span-1">
          <CustomSelect name="applied" value={appliedFilter} onChange={(e) => setAppliedFilter(e.target.value)}>
            <option value="">All</option>
            <option value="applied">Applied</option>
            <option value="not_applied">Not applied</option>
          </CustomSelect>
        </div>

        <div className="col-span-1 md:col-span-1 flex gap-2">
          <span
            onClick={() => {
              setJobTypeFilter("");
              setLocationTypeFilter("");
              setAppliedFilter("");
              setSearch("");
            }}
            className="px-4  cursor-pointer py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Reset
          </span>
          <span onClick={() => getSavedJobs()} className="px-4 cursor-pointer  py-2 bg-[var(--primary-color)] text-white rounded-md shadow-sm">
            Refresh
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white shadow-xl rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[900px]">
          <thead className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">#</th>
              <th className="px-6 py-3 font-semibold">Job</th>
              <th className="px-6 py-3 font-semibold">Company</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">Salary</th>
              <th className="px-6 py-3 font-semibold">Applied</th>
              <th className="px-6 py-3 font-semibold">Posted</th>
              <th className="px-6 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => {
                const imgSrc = job.image || job.companyProfile || "/default-company.png";
                const appliedCount = Array.isArray(job.applicants) ? job.applicants.length : 0;
                return (
                  <tr
                    key={job._id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-6 py-4 align-top">{idx + 1}</td>

                    <td className="px-6 py-4 align-top max-w-[300px]">
                      <div className="flex flex-col">
                        <div className="font-semibold text-gray-900 line-clamp-2">{job.title || "No title"}</div>
                        <div className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: (job.description || "").slice(0, 120) + (job.description?.length > 120 ? "..." : "") }} />
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top cursor-pointer"
                      onClick={() => navigate('/company-profile/' + job.postedBy)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                          <Img src={imgSrc} style="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="flex flex-col">
                          <div className="font-semibold">{job.company || "No company"}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{job.category || ""}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <span className={`px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium ${/full/i.test(job.jobType || "")
                        ? "bg-green-100 text-green-800"
                        : /part/i.test(job.jobType || "")
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {job.jobType || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="text-sm">{job.location || "—"}</div>
                      <div className="text-xs text-gray-400">{job.locationType || (job.remoteOption ? "Remote" : "Onsite")}</div>
                    </td>

                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      {job.salaryType === "fixed" ? <span>
                        <Currency amount={job.fixedSalary} from={job.jobsCurrency} />
                      </span> : <span>

                        <Currency amount={job.minSalary} from={job.jobsCurrency} /> - <Currency amount={job.maxSalary} from={job.jobsCurrency} /></span>}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="text-center">
                        <div className="text-sm font-semibold">{appliedCount}</div>
                        <div className="text-xs text-gray-400">{appliedCount > 0 ? "Applicants" : "No apps"}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">{formatDateShort(job.createdAt)}</td>

                    <td className="px-6 py-4 text-center align-top">
                      <div className="flex items-center justify-center gap-3">
                        <span
                          onClick={() => handleUnsaveJob(job._id)}
                          className="p-2 cursor-pointer rounded-md hover:bg-red-50 text-red-600"
                          title="Unsave job"
                        >
                          <FaTrash />
                        </span>

                        <Link
                          to={`/jobDetails/${job._id}`}
                          className="p-2 rounded-md hover:bg-gray-100"
                          title="View job"
                        >
                          <FaExternalLinkAlt />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-12">
                  <div className="max-w-md mx-auto">
                    <NotFound404 value={"No Jobs"} />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavedJobs;
