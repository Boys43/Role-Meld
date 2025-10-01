import express from 'express'
import Category from '../models/categoryModel.js';

const adminRouter = express.Router()

adminRouter.post("/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const category = new Category({ name, subcategories: [] });
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

export default adminRouter;
