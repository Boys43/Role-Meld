import React, { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import assets from '../assets/assets';

const BlogsSection = ({className}) => {
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
    <section className={`w-full grid ${className} items-center gap-4`}>
      {blogs.length > 0 ? blogs?.map((blog, index) => (
        <BlogCard key={index} blog={blog} />
      )) :
        <h2 className='col-span-full text-center mt-5 flex flex-col justify-center items-center gap-4 font-semibold'>
          <img src={assets.not_found} alt="Not Found" className='w-20' />
          No Recent Blogs
        </h2>
      }
    </section>
  )
}

export default BlogsSection