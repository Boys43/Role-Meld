import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { createBlog } from '../controllers/blogsController.js';
import multer  from 'multer'

const blogRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

blogRouter.post('/createblog', userAuth, upload.single('coverImage'), createBlog);

export default blogRouter;