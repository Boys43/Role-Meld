import React, { useState } from 'react'
import slugify from 'slugify'
// React Icons
import { FaBloggerB } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { toast } from 'react-toastify';

// Rte
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';

const AdminBlog = () => {
  const [blogSteps, setBlogSteps] = useState(0);
  const [formData, setFormData] = useState('');
  const [Tags, setTags] = useState([])
  const [tag, setTag] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, tags: Tags });
  };

  return (
    <main className='w-full p-6 '>
      <h1 className='font-bold flex items-center gap-4'><FaBloggerB className='text-[var(--primary-color)]' />Add new Blog</h1>
      <section className='mt-20'>
        <form className='flex flex-col gap-4 min-h-[50vh]'>
          {blogSteps === 0 && <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>Add Title of the Blog</h2>
            <div className='flex flex-col gap-2'>
              <label htmlFor="title">Title</label>
              <input type="text" name='title' id='title' value={formData?.title} onChange={handleChange} placeholder='Title' className='w-full p-2 border-2 border-[var(--primary-color)] rounded-md' />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="content">Slug</label>
              <input
                type='text'
                name='slug'
                id='slug'
                value={slugify(formData?.title || formData?.slug || '', { replacement: "_", lower: true })}
                onChange={handleChange}
                placeholder='Slug'
                className=' w-full p-2 border-2 border-[var(--primary-color)] rounded-md' />
            </div>
            <div className='flex justify-end mt-5'>
              <button
                type='button'
                onClick={() => {
                  if (!formData?.title && !formData?.slug) {
                    toast.error('Please fill all the fields')
                  } else {
                    setBlogSteps(blogSteps + 1)
                  }
                }}>Next <MdNavigateNext /></button>
            </div>
          </div>
          }

          {blogSteps === 1 &&
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold'>Choose Category</h2>
              <div className='flex flex-col gap-2'>
                <label htmlFor="Cateogry">Category</label>
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select Category --</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales & Business Development">Sales & Business Development</option>
                  <option value="Engineering & Architecture">Engineering & Architecture</option>
                </select>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={() => {
                    if (!formData?.category) {
                      toast.error('Please fill all the fields')
                    } else {
                      setBlogSteps(blogSteps + 1)
                    }
                  }}>Next <MdNavigateNext /></button>
              </div>
            </div>
          }

          {blogSteps === 2 &&
            <div>
              <h2 className='font-semibold'>Enter Main Content Here</h2>
              <div className='flex flex-col gap-2'>
                <label htmlFor="Cateogry">Content</label>
                <RichTextEditorComponent name='content' value={formData?.content || ""} onChange={handleChange}>
                  <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                </RichTextEditorComponent>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={() => {
                    if (!formData?.content) {
                      toast.error('Please fill all the fields')
                    } else {
                      setBlogSteps(blogSteps + 1)
                    }
                  }}>Next <MdNavigateNext /></button>
              </div>
            </div>
          }

          {blogSteps === 3 &&
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold'>Enter Related Tags</h2>
              <div className='flex flex-col gap-4'>
                <label htmlFor="Cateogry">Tags</label>
                <div className='flex items-center gap-4'>
                  <input type="text" name='tags' placeholder='Enter Comma Separated Tags'
                    value={tag || ''}
                    onChange={(e) => setTag(e.target.value)}
                    className=' w-full p-2 border-2 border-[var(--primary-color)] rounded-md' />
                  <button type='button' onClick={(e) => {
                    Tags.push(tag)
                    setTag('')
                  }}>
                    Add
                  </button>
                </div>
                <div>
                  {/* tags */}
                  {Tags.map((tag, index) => <span key={index} className='bg-gray-200 px-2 py-1 rounded-md mr-2'>{tag}</span>)}
                </div>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={() => {
                    if (!formData?.category) {
                      toast.error('Please fill all the fields')
                    } else {
                      setBlogSteps(blogSteps + 1)
                    }
                  }}>Next <MdNavigateNext /></button>
              </div>
            </div>
          }

          {blogSteps === 4 &&
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold'>Add Cover / Featured Image</h2>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col justify-center gap-4'>
                  <input type="file" name='coverImage'
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.files[0] })}
                    className=' w-full p-2 border-2 border-[var(--primary-color)] rounded-md' />
                    <div className='max-w-20 max-h-20 '>
                      {formData?.cover}
                    </div>
                </div>
                <div>
                  {/* tags */}
                  {Tags.map((tag, index) => <span key={index} className='bg-gray-200 px-2 py-1 rounded-md mr-2'>{tag}</span>)}
                </div>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={() => {
                    if (!formData?.category) {
                      toast.error('Please fill all the fields')
                    } else {
                      setBlogSteps(blogSteps + 1)
                    }
                  }}>Next <MdNavigateNext /></button>
              </div>
            </div>
          }
        </form>
      </section>
    </main>
  )
}

export default AdminBlog
