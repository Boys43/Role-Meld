import React, { useContext, useRef, useState } from 'react'
import slugify from 'slugify'
// React Icons
import { FaBloggerB } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { toast } from 'react-toastify';

// Rte
import JoditEditor from "jodit-react";
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AdminBlog = () => {
  const { backendUrl } = useContext(AppContext);
  const [blogSteps, setBlogSteps] = useState(0);
  const [Tags, setTags] = useState([])
  const [tag, setTag] = useState('')
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tag.trim() !== "") {
      e.preventDefault();
      const newTags = [...Tags, tag.trim()];
      setTags(newTags);
      setFormData({ ...formData, tags: newTags });
      setTag(""); // reset input
    }
  };

  const removeTag = (index) => {
    const newTags = Tags.filter((_, i) => i !== index);
    setTags(newTags);
    setFormData({ ...formData, tags: newTags });
  };


  const editor = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, tags: Tags });
  };

  const createBlog = async () => {
    const formData = new FormData();  
    try {<bdo dir="ltr"></bdo>
      const { data } = await axios.post(`${backendUrl}/api/blog/createblog`, formData );
      if (data.success) {
        toast.success(data.message);
        setFormData({})
        setBlogSteps(0);
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <main className='w-full p-6 '>
      <h1 className='font-bold flex items-center gap-4'><FaBloggerB className='text-[var(--primary-color)]' />Add new Blog</h1>
      <section className='mt-10'>
        <button disabled={blogSteps === 0} className='my-5 bg-[var(--primary-color)] text-white p-2 rounded-md' onClick={() => setBlogSteps(blogSteps - 1)}><IoChevronBack /></button>
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
                value={slugify(formData?.title, { replacement: "_", lower: true }) || formData?.slug || ''}
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
                <JoditEditor
                  ref={editor}
                  // remove value here OR set defaultValue
                  defaultValue={formData?.content || ""}
                  config={{
                    readonly: false,
                    height: 400,
                    uploader: { insertImageAsBase64URI: true },
                    buttons: [
                      "bold",
                      "italic",
                      "|",
                      "paragraph",
                      "h1",
                      "h2",
                      "h3",
                      "|",
                      "link",
                      "image",
                      "blockquote",
                    ],
                    toolbarAdaptive: false,
                  }}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, content: newContent }))
                  }
                />
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
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press Enter"
                    className=' w-full p-2 border-2 border-[var(--primary-color)] rounded-md'
                  />
                </div>
                <div className='flex items-center'>
                  {/* tags */}
                  {Tags.map((t, i) => (
                    <div key={i} className=" px-2 py-1 rounded flex items-center gap-1">
                      <span className='bg-gray-300 px-2 py-1 rounded' onClick={() => removeTag(i)}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={() => {
                    if (formData?.tags?.length < 3) {
                      toast.error('Add at least 3 Tags')
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
                <div className="relative w-full h-[300px] border-2 border-[var(--primary-color)] rounded-2xl overflow-hidden bg-gray-50 flex justify-center items-center">
                  {formData?.coverImage ? (
                    <img
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-gray-400">No image selected</p>
                  )}

                  {/* File input at the bottom */}
                  <div className="absolute bottom-2 left-0 w-full flex justify-center">
                    <input
                      type="file"
                      name="coverImage"
                      onChange={(e) =>
                        setFormData({ ...formData, coverImage: e.target.files[0] })
                      }
                      className="p-2 border rounded-md cursor-pointer bg-white"
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault()
                    if (!formData?.coverImage) {
                      toast.error('Please upload the image')
                    } else {
                      createBlog();
                    }
                  }}>Post</button>
              </div>
            </div>
          }
        </form>
      </section>
    </main>
  )
}

export default AdminBlog
