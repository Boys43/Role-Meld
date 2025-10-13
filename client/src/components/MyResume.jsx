import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const MyResume = () => {
    const { backendUrl, userData, setUserData } = useContext(AppContext);
    const [uploading, setUploading] = useState(false);

    // ---------- Resume Update ----------
    const changeResume = async (resume) => {
        const formData = new FormData();
        formData.append("resume", resume);
        setUploading(true);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/updateresume`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                setUserData(data.profile);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] p-6 w-full bg-gray-50">
            {/* Header */}
            <h2 className="text-3xl font-bold mb-6 text-[var(--primary-color)] flex items-center gap-2">
                📄 My Resume
            </h2>

            {/* Embed Preview for PDF */}
            {userData?.resume?.endsWith('.pdf') && (
                <div className="mb-6 border rounded-2xl shadow-lg overflow-hidden h-[400px]">
                    <embed
                        src={userData.resume + "#page=1"}
                        type="application/pdf"
                        className="w-full h-full"
                    />
                </div>
            )}

            {/* Uploaded Resume Card */}
            {userData?.resume ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white shadow-lg rounded-2xl border border-gray-200 p-6 transition-transform duration-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Uploaded Resume</h3>
                            <p className="text-[var(--primary-color)] font-medium mt-1">{userData.resume}</p>
                        </div>
                        <a
                            href={userData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            View
                        </a>
                    </div>

                    {/* Upload / Change Form */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-[var(--primary-color)]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Change Resume</h3>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)]/80 file:text-white hover:file:bg-[var(--primary-color)]/100 cursor-pointer"
                            onChange={(e) => changeResume(e.target.files[0])}
                            disabled={uploading}
                        />
                        {uploading && (
                            <p className="text-sm text-gray-500 mt-2 animate-pulse">Uploading...</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Upload Resume</h3>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)]/80 file:text-white hover:file:bg-[var(--primary-color)]/100 cursor-pointer"
                            onChange={(e) => changeResume(e.target.files[0])}
                            disabled={uploading}
                        />
                        {uploading && (
                            <p className="text-sm text-gray-500 mt-2 animate-pulse">Uploading...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyResume;
