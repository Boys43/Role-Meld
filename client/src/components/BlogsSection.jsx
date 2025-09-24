import React, { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogsSection = () => {
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
    <section className='w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-4'>
      {blogs?.map((blog, index) =>(
        <BlogCard key={index} blog={blog} />
      ))}
    </section>
  )
}

export default BlogsSection
