import axios from "axios";
import React, { useContext, useState, useRef } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Loader, Upload } from "lucide-react";

const MyResume = () => {
    const { backendUrl, userData, setUserData } = useContext(AppContext);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

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

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) changeResume(file);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] p-6 w-full bg-gray-50">
            <h2 className="text-3xl font-bold mb-6 text-[var(--primary-color)] flex items-center gap-2">
                📄 My Resume
            </h2>

            {/* Resume Preview */}
            {userData?.resume?.endsWith(".pdf") && (
                <div className="mb-8 border border-gray-200 rounded-2xl shadow-md overflow-hidden bg-white h-[420px]">
                    <embed
                        src={userData.resume + "#page=1"}
                        type="application/pdf"
                        className="w-full h-full"
                    />
                </div>
            )}

            {userData?.resume && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-md border border-gray-200 rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.01] mb-8">
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Uploaded Resume
                        </h3>
                        <span className="text-sm text-gray-500">
                            File Name:{" "}
                            <span className="font-medium text-gray-700">
                                {userData.resume.split("/").pop()}
                            </span>
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                            File Type:{" "}
                            <span className="font-medium text-gray-700">
                                {userData.resume.endsWith(".pdf")
                                    ? "PDF Document"
                                    : userData.resume.endsWith(".docx")
                                        ? "Word Document"
                                        : "Unknown"}
                            </span>
                        </span>
                    </div>
                    <a
                        href={userData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200"
                    >
                        View Resume
                    </a>
                </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-2xl p-12 bg-white flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragOver ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10" : "border-gray-300"
                    }`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                }}
                onDrop={handleDrop}
            >
                <span className="text-gray-500 text-center mb-3">
                    {uploading ?
                        <div className="flex items-center gap-3">
                            <Loader className="animate-spin" /> Uploadng...
                        </div>
                        :
                        <div className="flex flex-col items-center gap-3">
                            <Upload size={50} />
                            <span className="text-2xl font-semibold">Drag & Drop your resume here</span>
                        </div>
                    }
                </span>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => changeResume(e.target.files[0])}
                    disabled={uploading}
                />
            </div>
        </div>
    );
};

export default MyResume;
