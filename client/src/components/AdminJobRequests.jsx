import React, { useContext, useState, useEffect } from 'react';
import { FaCodePullRequest, FaRegEye, FaChevronRight } from "react-icons/fa6";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineTitle, MdOutlinePayment, MdCancel } from "react-icons/md";
import { FaBriefcase, FaCheckCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import NotFound404 from './NotFound404';
import Loading from './Loading';

const AdminJobRequests = () => {
  const { backendUrl } = useContext(AppContext);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch all pending jobs
  const getPendingJobs = async () => {
    setLoadingA(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getpendingjobs`);
      if (data.success) {
        setPendingJobs(data.jobs);
      }
    } catch (error) {
      toast.error("Error fetching pending jobs: " + error.message);
    } finally {
      setLoadingA(false);
    }
  };

  useEffect(() => {
    getPendingJobs();
  }, []);

  // Update job status
  const updateJobStatus = async (id, status) => {
    setLoadingJobId(id);
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/updatejobstatus`, { jobId: id, status });
      if (data.success) {
        toast.success("Job status updated successfully");
        getPendingJobs();
      }
    } catch (error) {
      toast.error("Error updating job status: " + error.message);
    } finally {
      setLoadingJobId(null);
    }
  };

  // View job details
  const viewDetails = (id) => {
    navigate(`/jobDetails/${id}`);
  };

  if (loadingA) return <Loading />;

  return (
    <div className="p-6 bg-white w-full rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
        <FaCodePullRequest className="text-[var(--primary-color)]" /> Job Requests
      </h1>

      {pendingJobs.length === 0 ? (
        <NotFound404 margin="mt-10" value="No Job Requests" />
      ) : (
        <ul className="p-4 grid gap-4 overflow-y-auto grid-cols-auto-fit">
          {pendingJobs.map((job) => (
            <li
              key={job._id}
              className={`p-4 shadow-lg relative border-l-4 rounded-lg transition
                ${
                  job.approved === "pending"
                    ? "border-yellow-500 bg-yellow-50"
                    : job.approved === "approved"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
            >
              <h5 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <MdOutlineTitle className="text-[var(--primary-color)]" />
                {job.title}
              </h5>

              <span className="flex items-center gap-2 text-sm font-semibold mb-2">
                <FaBriefcase size={13} className="text-[var(--primary-color)]" />
                {job.company}
              </span>

              <span
                className={`absolute right-2 top-2 px-4 rounded-lg py-1 text-sm capitalize
                  ${
                    job.approved === "pending"
                      ? "bg-yellow-200 text-yellow-900"
                      : job.approved === "approved"
                      ? "bg-green-200 text-green-900"
                      : "bg-red-200 text-red-900"
                  }`}
              >
                {job.approved}
              </span>

              {job.sponsored && (
                <span className="absolute right-2 top-12 px-4 rounded-lg py-1 text-sm bg-blue-200 text-blue-900">
                  Sponsored
                </span>
              )}

              <span
                onClick={() => viewDetails(job._id)}
                className="flex items-center cursor-pointer underline underline-offset-8 gap-2 text-sm mt-4 text-gray-600"
              >
                <FaRegEye className="text-[var(--primary-color)]" /> View Details {'>'}
              </span>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateJobStatus(job._id, "approved")}
                  className="mt-4 bg-green-300 border-2 border-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition flex items-center gap-2"
                  disabled={loadingJobId === job._id}
                >
                  {loadingJobId === job._id ? "Loading..." : (
                    <>
                      Approve <FaCheckCircle className="text-green-500" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => updateJobStatus(job._id, "rejected")}
                  className="mt-4 bg-red-300 border-2 border-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 transition flex items-center gap-2"
                  disabled={loadingJobId === job._id}
                >
                  {loadingJobId === job._id ? "Loading..." : (
                    <>
                      Reject <GiCancel className="text-red-500" />
                    </>
                  )}
                </button>

                {job?.sponsored && (
                  <span
                    className="self-end flex items-center gap-2 hover:underline cursor-pointer underline-offset-8 text-[var(--primary-color)]"
                    onClick={() => setShowPaymentDetails(job)}
                  >
                    Payment Details <FaChevronRight size={15} className="text-gray-500" />
                  </span>
                )}
              </div>

              {/* Payment Details Modal */}
              {showPaymentDetails?._id === job._id && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-screen w-full backdrop-blur-sm z-50">
                  <div className="bg-white shadow-lg relative rounded-2xl p-6 border border-gray-300 w-11/12 sm:w-1/2">
                    <MdCancel
                      className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-red-500"
                      size={22}
                      onClick={() => setShowPaymentDetails(null)}
                    />
                    <h2 className="font-semibold flex items-center gap-3 text-lg mb-4">
                      <MdOutlinePayment className="text-[var(--primary-color)]" /> Payment Details
                    </h2>
                    <div className="flex flex-col gap-2 text-sm">
                      <div>
                        <h4 className="font-semibold">Payment Name</h4>
                        <p>{job.cardName || "N/A"}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mt-2">Card Number</h4>
                        <p>{job.cardNumber || "N/A"}</p>
                      </div>

                      <div className="flex items-center justify-between w-3/4 mt-2">
                        <div>
                          <h4 className="font-semibold">Expiry Date</h4>
                          <p>{job.expiryDate || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">CVV</h4>
                          <p>{job.cvv || "N/A"}</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <h4 className="font-semibold">Payment Amount</h4>
                        <p>10 $</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminJobRequests;