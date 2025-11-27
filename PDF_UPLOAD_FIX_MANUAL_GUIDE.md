# PDF Upload Fix - Manual Installation Guide

## ✅ Completed Steps

1. **Fixed `react-pdf` CSS imports** in `MyResume.jsx`
   - Corrected import paths to `react-pdf/dist/Page/` (removed `/esm/`)
   
2. **Updated `userRouter.js`** with disk storage for resumes
   - Added `storageResume` using `multer.diskStorage()`
   - Updated `/updateresume` route to use `uploadResume` instead of `upload`
   
3. **Updated Cloudinary configuration** in `userRouter.js`
   - Set `resource_type: "raw"` for resume uploads to prevent corruption
   - Added `format` and `public_id` configuration for PDF files

## 🔧 Manual Step Required

Due to file editing complexity, please manually update `server/controllers/userController.js`:

### Step 1: Add Imports (at the top of the file, after line 1)

```javascript
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
```

### Step 2: Replace `updateResume` Function

Find the existing `updateResume` function (around line 280-302) and replace it with the code from:
**`server/controllers/MANUAL_INSTALL_updateResume.js`**

Or copy this code:

```javascript
export const updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user._id;
        const baseName = req.file.originalname.split(".")[0];

        // Upload to Cloudinary with resource_type: 'raw' to prevent corruption
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "users",
            resource_type: "raw",  // Critical: prevents PDF corruption
            public_id: `${baseName}_${Date.now()}`,
            format: "pdf"
        });

        // Delete temporary file after upload
        try { 
            fs.unlinkSync(req.file.path); 
        } catch (e) { 
            console.error("Error deleting temp file:", e); 
        }

        // Update user profile with new resume URL
        const user = await userProfileModel.findOne({ authId: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        user.resume = result.secure_url;
        user.profileScore = calculateProfileScore(user);
        await user.save();

        res.json({
            success: true,
            message: "Resume updated successfully",
            profile: user,
        });

    } catch (error) {
        // Cleanup temp file on error
        if (req.file && req.file.path) {
            try { 
                fs.unlinkSync(req.file.path); 
            } catch (e) {}
        }
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
```

## 🧪 Testing

After making the manual changes:

1. Restart the server: `npm run dev` (in the server directory)
2. Upload a new PDF resume in the MyResume page
3. Verify that:
   - The file uploads without errors
   - The PDF preview displays correctly in `MyResume` component
   - The file stored in Cloudinary has `.pdf` extension

## 🔍 What This Fixes

- **Cloudinary Corruption**: Uses `resource_type: "raw"` to store PDFs as files instead of images
- **Missing Extension**: Ensures uploaded files retain their `.pdf` extension
- **Temp File Cleanup**: Automatically deletes temporary files after upload to Cloudinary
- **Profile Score**: Updates user's profile completion score after resume upload

## 📁 Modified Files Summary

1. ✅ `client/src/components/MyResume.jsx` - Fixed CSS imports
2. ✅ `server/routes/userRouter.js` - Configured disk storage and Cloudinary settings
3. ⏳ `server/controllers/userController.js` - **REQUIRES MANUAL UPDATE** (see above)
