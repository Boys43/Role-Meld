import blogModel from "../models/blogModel.js";

export const createBlog = async (req, res) => {
    const { formData } = req.body;

    if (!formData) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const blog = new blogModel({
            title: formData?.title,
            slug: formData?.slug,
            excerpt: formData?.content.substring(0, 150),
            content: formData?.content,
            coverImage: req.file?.path,
            tags: formData?.tags,
            category: formData?.category,
            author: req.user._id
        })
        await blog.save();

        return res.status(201).json({ success: true,  message: 'Blog created successfully' });
        
    } catch (error) {
        return res.json({success: false, message: error.message });
    }
}