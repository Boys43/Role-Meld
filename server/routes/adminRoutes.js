import express from 'express'
import Category from '../models/categoryModel.js';

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

export default adminRouter;
