import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import BlogsSection from '../components/BlogsSection';

// React Icons
import { FaBloggerB } from "react-icons/fa";

const BlogsDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [blogData, setBlogData] = useState({})

  const getBlog = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/blog/getblog`, { blogId: id });
      if (data.success) {
        setBlogData(data.blog);
      } else {
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBlog();
  }, [id])

  if (loading) {
    return <div className="flex fixed top-1/2 left-1/2 tanslate-1/2 justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className='w-full p-10 bg-gray-100 flex gap-4'>
      <div className='bg-white w-[70%] border border-gray-300 rounded-2xl p-4'>
        <img src={`${backendUrl}/${blogData.coverImage}`} alt={blogData?.coverImage} className='border rounded-2xl  border-gray-300' />
        <h1 className='w-full flex justify-center font-bold mt-5 underline underline-offset-8'>
          {blogData?.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: blogData?.content }} />
      </div>
      <div className='bg-white w-[30%] rounded-2xl px-4 w-300'>
        <h3 className='font-bold flex items-center gap-3 my-3 text-center'>
          <FaBloggerB className='text-[var(--primary-color)]' /> Related Blogs
        </h3>
        <BlogsSection />
      </div>
    </div>
  )
}

export default BlogsDetails;