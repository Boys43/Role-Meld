# Complete Fix Guide for userController.js

## 🚨 Current Status
Your server crashes because `userController.js` was corrupted during automatic editing attempts.
The file has been **RESTORED FROM GIT** - your server should now be running.

## ✅ Quick Fix Steps

### Step 1: Add Missing Imports (Lines 1-7)

Open `server/controllers/userController.js` and add these two imports **after line 5**:

```javascript
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
```

Your imports section should look like this:
```javascript
import recruiterProfileModel from "../models/recruiterProfileModel.js"
import userProfileModel from "../models/userProfileModel.js"
import authModel from "../models/authModels.js";
import jobsModel from "../models/jobsModel.js";
import applicationModel from "../models/applicationModel.js";
import fs from 'fs';                              // ← ADD THIS
import cloudinary from '../config/cloudinary.js';  // ← ADD THIS
```

### Step 2: Replace updateResume Function (Lines 280-302)

**Find this code** (around line 280):
```javascript
export const updateResume = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.json({ success: false, message: "No resume uploaded" });
        }

        const updatedProfile = await userProfileModel.findOneAndUpdate(
            { authId: userId },
            { $set: { resume: req.file?.path } }, // only save filename or path
            { new: true }
        );

        return res.json({
            success: true,
            message: "Resume uploaded successfully",
            profile: updatedProfile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
```

**Replace it with this** (NEW version with manual Cloudinary upload):
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

## 💡 What Changed?

1. **Imports Added**: `fs` for file deletion, `cloudinary` for manual upload
2. **Manual Upload**: Direct call to `cloudinary.uploader.upload` with:
   - `resource_type: "raw"` - Treats PDF as a file, not an image (prevents corruption)  
   - `format: "pdf"` - Ensures .pdf extension is preserved
   - `public_id` with timestamp - Unique filename with .pdf extension
3. **Temp File Cleanup**: Deletes the multer temporary file after successful upload
4. **Profile Score Update**: Recalculates profile score after resume upload

## 🧪 Testing After Changes

1. Save the file
2. Server should auto-restart (nodemon is watching)
3. Go to your app and upload a PDF resume
4. Check that:
   - Upload succeeds without errors
   - PDF displays correctly in MyResume component  
   - File in Cloudinary has `.pdf` extension

## ⚠️ If Server Still Crashes

If you see syntax errors after making changes:
1. Double-check you copied the code exactly (no missing braces)
2. Make sure imports are at the TOP of the file
3. Check the terminal error message for the line number
4. If needed, restore from git again: `git checkout HEAD -- server/controllers/userController.js`

## 📋 Already Completed

✅ `MyResume.jsx` - Fixed react-pdf CSS imports
✅ `userRouter.js` - Configured disk storage for resume uploads
✅ `userRouter.js` - Set Cloudinary to use resource_type: "raw"
