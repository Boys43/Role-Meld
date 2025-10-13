import React, { useContext, useEffect, useState } from 'react'

// React Icons
import { CiViewList } from "react-icons/ci";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { FaPlus } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Cross, X } from 'lucide-react';
import Img from './Image';
const AdminListedBlogs = ({ setActiveTab }) => {
    const { backendUrl, userData } = useContext(AppContext);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const getAllBlogs = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${backendUrl}/api/blog/getallblogs`);
            if (data.success) {
                setAllBlogs(data.blogs);
            } else {
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllBlogs()
    }, []);

    // Remove Blog
    const [blogRemovalLoading, setBlogRemovalLoading] = useState(false)
    const removeBlog = async (blogId) => {
        setBlogRemovalLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/blog/removeblog`, { blogId })
            if (data.success) {
                toast.success(data.message)
                getAllBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBlogRemovalLoading(false)
        }
    }

    const [imageModel, setImageModel] = useState(false);
    const [selectedImg, setSelectedImg] = useState('')

    if (loading) {
        return <div className='w-full flex justify-center'>
            <Loading />
        </div>
    }
    return (
        <div className='relative w-full p-6 overflow-y-auto min-h-screen'>
            <h1 className='font-bold flex items-center gap-4'>
                <CiViewList className='text-[var(--primary-color)]' /> Listed Blogs
            </h1>
            <button className='mt-10' onClick={() => (setActiveTab("add-blog"))}>
                Add <FaPlus />
            </button>
            <div className='overflow-x-auto mt-4 rounded-2xl border border-gray-200 shadow-md'>
                <table className=" w-full text-sm text-left text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 whitespace-nowrap">
                        <tr>
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Featured Image</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Created At</th>
                            <th colSpan={2} className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBlogs.map((blog, index) => (
                            <tr
                                key={index}
                                className={`transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-blue-50`}
                            >
                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                <td className="px-6 py-4 "><Img
                                    src={blog.coverImage}
                                    onClick={() => {
                                        setSelectedImg(blog.coverImage);
                                        setImageModel(true);
                                    }}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-300 cursor-pointer hover:scale-105 hover:shadow-md transition-transform duration-200"
                                />
                                </td>
                                <td className="px-6 py-4">{blog.title}</td>
                                <td className="px-6 py-4 font-semibold">{blog.category}</td>
                                <td className="px-6 py-4">
                                    {blog.createdAt.split('T')[0]}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-4">
                                        <HiOutlinePencilSquare
                                            onClick={() => navigate('/editblog?id=' + encodeURIComponent(blog._id))}
                                            className='cursor-pointer text-blue-300' />
                                        <FaTrash onClick={() => removeBlog(blog._id)} className=' cursor-pointer text-red-300' />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Image Model */}
            {imageModel &&
                <div className='fixed top-0 left-0 w-full h-screen bg-black/50 flex items-center justify-center '>
                    <div className='p-2 rounded-md bg-white relative '>
                        <X onClick={() => setImageModel(false)} className=' cursor-pointer border border-gray-300 bg-white rounded-md absolute top-3 right-3' />
                        <Img src={`${backendUrl}/${selectedImg}`} style="max-w-100 rounded-md" />
                    </div>
                </div>
            }
        </div>
    )
}

export default AdminListedBlogs
