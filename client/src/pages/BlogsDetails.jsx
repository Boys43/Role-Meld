import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

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
    <div className='w-full p-10 bg-gray-100'>
      <div className='bg-white shadow-xl rounded-2xl p-4'>
        <img src={`${backendUrl}/${blogData.coverImage}`} alt={blogData?.coverImage} />
        <div dangerouslySetInnerHTML={{ __html: blogData?.content }} />
      </div>
    </div>
  )
}

export default BlogsDetails;