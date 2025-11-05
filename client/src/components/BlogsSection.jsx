import React, { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import assets from '../assets/assets';
import NotFound404 from './NotFound404';
import { FaBlogger } from 'react-icons/fa';

const BlogsSection = ({ className, limit = 4 }) => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([])
  const getAllBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/blog/getallblogs`);
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (loading) {
    return <div className="flex fixed top-1/2 left-1/2 tanslate-1/2 justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <>
      <h1 className="flex flex-col justify-center w-full items-center mb-8">
        <span className="font-bold flex items-center gap-2">
          <FaBlogger className=" text-[var(--primary-color)] my-4" /> Latest <span className="text-[var(--primary-color)]">Blogs</span>
        </span>
        <span className='text-gray-600 text-lg'>2025 blogs live - {blogs.filter(blog => new Date(blog.createdAt).toDateString() === new Date().toDateString()).length} uploaded today </span>
      </h1>
      <section className={`w-full grid ${className} items-center gap-4`}>
        {blogs.length > 0 ? blogs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
          .slice(0, {limit})
          .map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          )) :
          <NotFound404 margin={"mt-10"} value={"No Recent Blogs"} />
        }
      </section>
    </>
  )
}

export default BlogsSection