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
        const blog = await blogModel.findById(blogId).populate('author', 'name email');
        return res.status(200).json({ success: true, blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}