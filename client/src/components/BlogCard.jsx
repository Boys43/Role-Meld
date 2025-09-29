import { useLocation, useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BlogCard = ({ blog }) => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            onClick={
                location.pathname !== "/admin"
                    ? () => navigate(`/blogdetails/${blog?.slug}?id=${blog._id}`)
                    : undefined
            }
            className="rounded-2xl cursor-pointer bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-300">
            {/* Image Section */}
            <div className="overflow-hidden">
                <img
                loading='lazy'
                    src={
                        blog.coverImage
                            ? location.pathname === "/editblog"
                                ? `${backendUrl}/${blog.coverImage}` // already saved file path
                                : blog.coverImage instanceof File || blog.coverImage instanceof Blob
                                    ? URL.createObjectURL(blog.coverImage) // local file
                                    : `${backendUrl}/${blog.coverImage}` // fallback if it's a string URL
                            : assets.preview_image // default preview
                    }
                    alt="Blog"
                    className="w-full border border-gray-300 h-[10rem] object-cover cursor-pointer transition-transform duration-500 hover:scale-110"
                />

            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-3">
                <span className="font-medium text-sm leading-snug line-clamp-2 text-gray-800">
                    {blog?.category || "Category Here"}
                </span>

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
                    onClick={
                        location.pathname !== "/admin"
                            ? () => navigate(`/blogdetails/${blog?.slug}?id=${blog._id}`)
                            : undefined
                    }
                >
                    Read More
                </button>
            </div>
        </div>

    )
}

export default BlogCard