import { useLocation, useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import Img from '../components/Image';

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "October 29, 2022";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            onClick={
                location.pathname !== "/admin"
                    ? () => navigate(`/blogdetails/${blog?.slug}?id=${blog._id}`)
                    : undefined
            }
            className="bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer max-w-sm mx-auto">

            {/* Image Section */}
            <div className="relative group overflow-hidden w-full h-60 rounded-2xl">
                <Img
                    loading='lazy'
                    src={
                        blog.coverImage
                            ? location.pathname === "/editblog"
                                ? blog.coverImage // already saved file path
                                : blog.coverImage instanceof File || blog.coverImage instanceof Blob
                                    ? URL.createObjectURL(blog.coverImage) // local file
                                    : blog.coverImage // fallback if it's a string URL
                            : assets.preview_image // default preview
                    }
                    alt="Blog"
                    style="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Date and Category */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-500 text-sm font-medium">
                        {formatDate(blog?.createdAt)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-[var(--primary-color)]">
                        {blog?.category || "Learn"}
                    </span>
                </div>

                {/* Title */}
                <span className="text-gray-600 h-20 text-xl font-bold leading-tight mb-3 line-clamp-2">
                    {blog?.title || "Remote Collaboration: Best Practices, Challenges, and Tools"}
                </span>

            </div>
        </div>
    )
}

export default BlogCard