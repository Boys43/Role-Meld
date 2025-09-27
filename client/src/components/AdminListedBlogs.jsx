import React, { useContext, useEffect, useState } from 'react'

// React Icons
import { CiViewList } from "react-icons/ci";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';

const AdminListedBlogs = () => {
    const { backendUrl, userData } = useContext(AppContext);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(false)
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

    // Edit Blog
    const [blogEditLoading, setBlogEditLoading] = useState(false);
    const [updatedBlogData, setUpdateBlogdData] = useState({});

    const editBlog = async (blogId) => {
        setBlogEditLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/blog/editblog`, { blogId, updatedBlogData })
            if (data.success) {
                toast.success(data.message)
                getAllBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBlogEditLoading(false)
        }
    }

    if (loading) {
        return <div className='w-full flex justify-center'>
            <Loading />
        </div>
    }
    return (
        <div className='w-full p-6'>
            <h1 className='font-bold flex items-center gap-4'>
                <CiViewList className='text-[var(--primary-color)]' /> Listed Blogs
            </h1>
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2'>
                {allBlogs?.map((blog, index) => (
                    <li className='p-4 border border-gray-300 rounded-lg' key={index}>{blog._id}
                        <button disabled={blogRemovalLoading} onClick={() => removeBlog(blog._id)}>
                            remove
                        </button>
                        <button>
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AdminListedBlogs
