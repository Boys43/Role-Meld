import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import assets from '../assets/assets';

const BlogCard = ({ blog }) => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/blogdetails/${blog?.slug}?id=${blog._id}`)}
            className="rounded-2xl cursor-pointer bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-300">
            {/* Image Section */}
            <div className="overflow-hidden">
                <img
                    src={blog.coverImage ? `${backendUrl}/${blog.coverImage}` : assets.preview_image}
                    alt="Blog"
                    className="w-full border border-gray-300 h-[10rem] object-cover cursor-pointer transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-3">
                {/* Tags */}
                <div className="flex items-center gap-3 flex-wrap">
                    {blog?.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-[var(--primary-color)] text-white text-xs font-medium rounded-full px-3 py-1 shadow-sm">
                            {tag}
                        </span>
                    )) || "Tags Here"}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg leading-snug line-clamp-2 text-gray-800">
                    {blog?.title || "Title Here"}
                </h3>

                {/* Description */}
                <span className="line-clamp-3 min-h-[50px] text-sm text-gray-600">
                    {blog?.content?.match(/<p[^>]*>(.*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').slice(0, 100) || "Expercept Here"}
                </span>

                {/* Button */}
                <button className="mt-2 self-start text-[var(--primary-color)] font-semibold text-sm"
                    onClick={() => navigate(`/blogdetails/${blog?.slug}?id=${blog._id}`)}
                >
                    Read More
                </button>
            </div>
        </div>

    )
}

export default BlogCard