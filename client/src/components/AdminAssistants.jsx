import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, CheckCircle, XCircle, Mail, Phone, MapPin, Globe, UserRound, Plus } from 'lucide-react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import Img from './Image';

const AdminAssistants = ({ setActiveTab }) => {
    const { backendUrl } = useContext(AppContext);
    const [assistants, setAssistants] = useState([]);
    const [assistantLoading, setAssistantLoading] = useState(false);
    const navigate = useNavigate()

    const getAssistants = async () => {
        setAssistantLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/get-assistants`);
            if (data.success) {
                setAssistants(data.assistants);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error.message);
        } finally {
            setAssistantLoading(false);
        }
    };

    useEffect(() => {
        getAssistants();
    }, []);

    if (assistantLoading) {
        return (
            <div className="w-full flex justify-center items-center py-16">
                <Loading />
            </div>
        );
    }

    if (assistants.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                No assistants found.
            </div>
        );
    }

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Assistants</h1>

            <div className='w-full flex justify-end'>
                <button
                    className='flex items-center gap-3'
                    onClick={() => setActiveTab('add-assistant')}
                >
                    <Plus /> Add Assistant
                </button>
            </div>

            <div className="w-full mt-4">
                {assistants.map((a) => (
                    <div
                        key={a._id}
                        className="bg-white mt-3 border w-full border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <Img
                                src={a.profilePicture ? `${backendUrl}/uploads/${a.profilePicture}` : "/default-avatar.png"}
                                style="w-14 h-14 rounded-full object-cover border"
                            />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{a.name}</h2>
                                <span className="text-sm text-gray-500">{a.headline || "No headline"}</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" />
                                <span>{a.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-green-500" />
                                <span>{a.contactNumber || "N/A"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-red-500" />
                                <span>{a.address || "No address"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-purple-500" />
                                <span>{a.website || "No website"}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-4 flex items-center justify-between">
                            <span
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${a.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {a.isActive ? (
                                    <>
                                        <CheckCircle size={14} />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={14} />
                                        Inactive
                                    </>
                                )}
                            </span>

                            <span
                                className={`text-xs px-3 py-1 rounded-full ${a.reviewStatus === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : a.reviewStatus === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {a.reviewStatus.charAt(0).toUpperCase() + a.reviewStatus.slice(1)}
                            </span>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex items-center justify-between border-t pt-3">
                            <span className="text-xs text-gray-500">
                                Joined: {new Date(a.createdAt).toLocaleDateString()}
                            </span>

                            <span
                                onClick={() => navigate("/company-profile/" + a.authId)}
                                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <UserRound size={14} /> View Profile
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAssistants;