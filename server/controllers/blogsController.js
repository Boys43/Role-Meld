import blogModel from "../models/blogModel.js";

export const createBlog = async (req, res) => {
    const { title, slug, content, tags, category } = req.body;

    if (!title || !slug || !content || !tags || !category) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const blog = new blogModel({
            title,
            slug,
            excerpt: content.substring(0, 150),
            content,
            coverImage: req.file?.path,
            tags: JSON.parse(tags),
            category,
            author: req.user._id
        })
        await blog.save();

        return res.status(201).json({ success: true,  message: 'Blog created successfully' });
        
    } catch (error) {
        return res.json({success: false, message: error.message });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find().populate('author', 'name email').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, blogs });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.messages });
    }
}

export const getBlog = async (req, res) => {
    const {blogId} = req.body;
    try {
        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        return res.status(200).json({ success: true, blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Remove the Blog
export const removeBlog = async (req, res) => {
    const {blogId} = req.body;
    try {
        await blogModel.findByIdAndDelete(blogId);
        return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Edit the Blog
export const editBlog = async (req, res) => {
    const { updatedBlog, blogId } = req.body;

    if (!updatedBlog || !blogId) {
        return res.status(400).json({ success: false, message: 'Please provide all the required fields' });   
    }
    try {
        const blog = await blogModel.findByIdAndUpdate(blogId, {$set: updatedBlog}, { new: true });

        return res.json({ success: true, message: "Blog Updated Successfully" });
    } catch (error) {
        return res.json({success: false, message: error.message });
    }
}