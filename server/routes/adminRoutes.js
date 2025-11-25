import express from 'express'
import Category from '../models/categoryModel.js';
import Package from '../models/packageModel.js';

const adminRouter = express.Router()

adminRouter.post("/categories", async (req, res) => {
  console.log("POST");
  const { name, icon = "Tag" } = req.body;

  console.log(req.body);
  try {
    const category = new Category({ name, icon, subcategories: [] });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

adminRouter.post("/categories/:id/subcategories", async (req, res) => {
  const { id } = req.params;
  const { subcategory } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.subcategories.push(subcategory);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

adminRouter.get("/categories", async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, categories });
});

adminRouter.post("/categories/:id/subcategories/remove", async (req, res) => {
  const { id } = req.params;
  const { subcategory } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.subcategories = category.subcategories.filter(sub => sub !== subcategory);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete entire category
adminRouter.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Category.findByIdAndDelete(id);
    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully`
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

adminRouter.patch("/categories/:id", async (req, res) => {
  console.log("PATCH");
  const { id } = req.params;
  const updates = {};

  console.log(req.body);

  if (typeof req.body.name === "string" && req.body.name.trim()) {
    updates.name = req.body.name.trim();
  }

  if (typeof req.body.icon === "string" && req.body.icon.trim()) {
    updates.icon = req.body.icon.trim();
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true, category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk import categories from Excel data
adminRouter.post("/categories/bulk-import", async (req, res) => {
  console.log("BULK");
  const { categories } = req.body;

  try {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const categoryData of categories) {
      try {
        const { name, subcategories = [], icon = "Tag" } = categoryData;

        if (!name || !name.trim()) {
          results.errors.push(`Category name is required for entry: ${JSON.stringify(categoryData)}`);
          continue;
        }

        // Check if category already exists
        let existingCategory = await Category.findOne({ name: name.trim() });

        if (existingCategory) {
          // Update existing category by adding new subcategories
          const newSubcategories = subcategories.filter(sub =>
            sub && sub.trim() && !existingCategory.subcategories.includes(sub.trim())
          );

          if (newSubcategories.length > 0) {
            existingCategory.subcategories.push(...newSubcategories.map(sub => sub.trim()));
            await existingCategory.save();
            results.updated++;
          }
        } else {
          // Create new category
          const newCategory = new Category({
            name: name.trim(),
            icon: icon || "Tag",
            subcategories: subcategories.filter(sub => sub && sub.trim()).map(sub => sub.trim())
          });
          await newCategory.save();
          results.created++;
        }
      } catch (err) {
        results.errors.push(`Error processing category "${categoryData.name}": ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Import completed. Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors.length}`,
      results
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Bulk import failed",
      details: err.message
    });
  }
});

// ============================
// Package Management Routes
// ============================

// Get all packages
adminRouter.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new package
adminRouter.post("/packages", async (req, res) => {
  const { name, price, currency, duration, jobPostings, featuredJobs, candidateAccess, features, isActive, displayOrder } = req.body;

  try {
    // Validate required fields
    if (name == null || price == null || duration == null || jobPostings == null) {
      return res.status(400).json({
        success: false,
        error: "Name, price, duration, and job postings are required"
      });
    }


    const newPackage = new Package({
      name: name.trim(),
      price,
      currency: currency || "USD",
      duration,
      jobPostings,
      featuredJobs: featuredJobs || 0,
      candidateAccess: candidateAccess || false,
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0
    });

    await newPackage.save();
    res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        success: false,
        error: "A package with this name already exists"
      });
    } else {
      res.status(400).json({ success: false, error: err.message });
    }
  }
});

// Update package
adminRouter.patch("/packages/:id", async (req, res) => {
  const { id } = req.params;
  const updates = {};

  // Only include fields that are provided
  const allowedUpdates = ['name', 'price', 'currency', 'duration', 'jobPostings', 'featuredJobs', 'candidateAccess', 'features', 'isActive', 'displayOrder'];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: "No updates provided"
    });
  }

  try {
    const updatedPackage = await Package.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        error: "Package not found"
      });
    }

    res.json({
      success: true,
      message: "Package updated successfully",
      package: updatedPackage
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        success: false,
        error: "A package with this name already exists"
      });
    } else {
      res.status(400).json({ success: false, error: err.message });
    }
  }
});

// Delete package
adminRouter.delete("/packages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: "Package not found"
      });
    }

    await Package.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Package "${pkg.name}" deleted successfully`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Toggle package active status
adminRouter.patch("/packages/:id/toggle-status", async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: "Package not found"
      });
    }

    pkg.isActive = !pkg.isActive;
    await pkg.save();

    res.json({
      success: true,
      message: `Package ${pkg.isActive ? 'activated' : 'deactivated'} successfully`,
      package: pkg
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default adminRouter;
