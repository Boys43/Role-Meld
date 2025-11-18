import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import BlogsSection from '../components/BlogsSection';

// React Icons
import { FaBloggerB } from "react-icons/fa";
import Loading from '../components/Loading';
import Img from '../components/Image';
import Navbar from '../components/Navbar';
import slugify from 'slugify';

const BlogsDetails = () => {
  // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
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

  // useEffect(() => {
  //   getBlog();
  // }, [id])

  const sampleBlogData = {
    title: "Remote Collaboration: Best Practices, Challenges, and Tools",
    category: "Learn",
    createdAt: Date.now(),
    content: `
    Collaboration is one of the most cited challenges of remote work, but it doesn’t have to be. Here are our best practices and tool recommendations.


In 2020 when the COVID pandemic locked down the world, billions of workers were thrown into a completely new way of working: remote collaboration.

Exciting? We think so. But ask anyone who works remotely: it’s not all smooth sailing. Yes, it’s never been easier to find a remote job or attract remote employees, but for many employers and remote workers, this avant-garde way of collaborating and working remotely came with new and daunting challenges. Distributed teams work across time zones and need to take advantage of asynchronous collaboration and remote collaboration tools to maintain productivity, engage current employees, and to attract and onboard new ones.




Despite this, remote workers are valuing the benefits of remote work. Skyrocketing productivity and improved work-life balance have irreversibly changed how we work and how we think about work. Remote workers tend to be more productive, engaged, and happier and employers who hire remote teams can attract the best talent regardless of geography. Here are some numbers: 97.6% of workers would like to work remotely forever after this pandemic is over and 1 in 2 US employees won’t return to jobs that don’t offer remote work.`,
    tags: ["app", "design", "digital", "jobs", "skills", "topic"]
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <div className='w-full min-h-screen bg-white mb-10'>
        <Img src={blogData.coverImage || '/placeholder.png'} style='h-[400px] object-cover w-full' />
        <div className='flex max-w-6xl mx-auto gap-15 '>
          <div className='mt-10 w-[70%]'>
            <Link className='cursor-pointer transition-all underline underline-offset-4 hover:text-[var(--primary-color)] uppercase' 
            to={'/category-jobs?category=' + slugify(sampleBlogData?.category)}
            >
              {sampleBlogData?.category || "Learn"}
            </Link>
            <h4 className='w-full text-4xl flex justify-center font-medium text-black leading-13 mt-5'>
              {sampleBlogData?.title || "Hello"}
            </h4>
            <p className='mt-5'>
              <i>by</i> <b>Admin</b> <span className='text-gray-400 italic'> | {new Date(sampleBlogData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </span>
            </p>
            <div className='mt-5 leading-7' dangerouslySetInnerHTML={{ __html: sampleBlogData?.content }} />

            <hr className='my-10 border-gray-100' />

            <div className='w-full'>
              <h4 className='text-4xl font-medium text-black'>Related Articles</h4>
              <div className='mt-10 w-full'>
                <BlogsSection limit={2} className={"grid-cols-2"} />
              </div>
            </div>
          </div>

          <div className='mt-10 px-4 w-[30%]'>
            <h4 className='font-semibold text-md'>
              Category
            </h4>
            <p className='mt-3'>
              {sampleBlogData?.category}
            </p>
            <hr className='border-gray-300 mt-10' />
            <h4 className='mt-10 font-semibold text-md'>
              Tags
            </h4>
            <div className='flex flex-wrap gap-4 mt-5'>
              {sampleBlogData?.tags?.map(tag => (
                <span className='cursor-pointer rounded p-2 hover:bg-[var(--primary-color)] border border-gray-100 capitalize hover:text-white text-[var(--primary-color)] transition-all'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default BlogsDetails;