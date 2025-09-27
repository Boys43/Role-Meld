import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from '../components/Loading';
import { AppContext } from '../context/AppContext';
import { MdSubtitles } from "react-icons/md";
import JoditEditor from 'jodit-react';
import BlogCard from '../components/BlogCard';
import { FiSearch } from 'react-icons/fi';

const EditBlog = () => {
    const location = useLocation();
    const search = location.search;
    const params = new URLSearchParams(search);
    const blogId = params.get('id');
    const { backendUrl } = useContext(AppContext)
    const editor = useRef(null);

    // Edit Blog
    const [blogEditLoading, setBlogEditLoading] = useState(false);
    const [blogDataloading, setBlogDataloading] = useState(false)
    const [blogData, setBlogData] = useState({})

    const handleChange = (e) => {
        e.preventDefault();
        setBlogData({ ...blogData, [e.target.name]: e.target.value })
    }

    const getBlogData = async () => {
        setBlogDataloading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/blog/getblog`, { blogId })
            if (data.success) {
                setBlogData(data.blog);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setBlogDataloading(false)
        }
    }

    useEffect(() => {
        getBlogData()
    }, [blogId])

    console.log(blogData);

    const editBlog = async (blogId) => {
        setBlogEditLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/blog/editblog`, { blogId, blogData })
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

    if (blogDataloading) {
        return <Loading />
    }

    return (
        <main className='w-full grid grid-cols-3 min-h-[calc(100vh-4.6rem)] p-10'>
            <div className='col-span-2'>
                <h1>Edit Blog</h1>
                <div className='px-10 py-4'>
                    <h2 className='font-semibold'>Title Details</h2>
                    <div className='p-4'>
                        <label htmlFor="title" className='font-medium'>Title</label>
                        <input
                            type="text"
                            name="title"
                            onChange={handleChange}
                            value={blogData?.title || ""}
                            className="my-2 w-full px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                        />
                        <label htmlFor="title" className='font-medium'>Title</label>
                        <input
                            type="text"
                            name="slug"
                            onChange={handleChange}
                            value={blogData?.slug || ""}
                            className="my-2 w-full px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                        />
                    </div>
                    <h2 className='font-semibold'>Content</h2>
                    <div className='p-4'>
                        <JoditEditor
                            ref={editor}
                            value={blogData?.content || ""}
                            config={{
                                readonly: false,
                                height: 400,
                                uploader: { insertImageAsBase64URI: true },
                                buttons: ["bold", "italic", "|", "paragraph", "|", "link", "image", "blockquote"],
                                toolbarAdaptive: false,
                            }}
                            onBlur={(newContent) =>
                                setBlogData((prev) => ({ ...prev, content: newContent }))
                            }
                        />
                    </div>
                </div>
            </div>
            <div className=''>
                <h2>
                    Preview
                </h2>
                <div className="w-full max-w-3xl mx-auto mt-2">
                    {/* MacBook top bar */}
                    <div className="bg-gray-200 rounded-t-xl flex items-center px-3 h-8 gap-2">
                        {/* Mac buttons */}
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>

                    {/* URL input */}
                    <div className="bg-white border border-gray-300 rounded-b-xl flex items-center px-3 py-2 shadow-md">
                        <FiSearch className="text-gray-400 mr-2" />
                        <span className="w-full text-sm text-gray-800 truncate block">
                            <span className='text-gray-400'>https://alfacareer.com/</span>{blogData.slug}
                        </span>
                    </div>
                </div>
                <div className='sticky mt-4 top-4'>
                    <BlogCard blog={blogData} />
                </div>
            </div>
        </main>
    )
}

export default EditBlog
