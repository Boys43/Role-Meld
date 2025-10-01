import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Plus, Trash2, Tag, FolderPlus } from 'lucide-react';
import { toast } from "react-toastify";

const CategoryManager = () => {
    const { backendUrl } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newSub, setNewSub] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/categories");
            if (data.success) {
                setCategories(data.categories);
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            TbContrast2Off.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    console.log('categories', categories);


    // Add category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await axios.post(backendUrl + "/api/admin/categories", { name: newCategory });
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    // Add subcategory
    const handleAddSubcategory = async (categoryId) => {
        const subName = newSub[categoryId];
        if (!subName || !subName.trim()) return;
        try {
            await axios.post(backendUrl + `/api/admin/categories/${categoryId}/subcategories`, { subcategory: subName });
            setNewSub({ ...newSub, [categoryId]: "" });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    // Delete subcategory
    const handleDeleteSub = async (categoryId, subcategory) => {
        try {
            await axios.post(
                backendUrl + `/api/admin/categories/${categoryId}/subcategories/remove`,
                { subcategory } // send subcategory in request body
            );
            fetchCategories(); // refresh categories after deletion
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="w-full min-h-screen p-6">
            <h1 className="font-semibold">
                Manage and add Job Cateogories
            </h1>
            <div className="border border-gray-300 rounded-lg mt-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-xl">
                        <FolderPlus className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Category Manager
                    </h2>
                    <p className="text-gray-600">Organize your categories and subcategories</p>
                </div>

                {/* Add New Category Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Add New Category</h3>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCategory}
                            placeholder="Enter category name..."
                            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Categories List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Categories Yet</h3>
                        <p className="text-gray-500">Start by adding your first category above</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categories?.map((cat) => (
                            <div
                                key={cat._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                            >
                                {/* Category Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-5 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                                <Tag className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800">{cat.name}</h3>
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                                            {cat.subcategories.length} subcategories
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {/* Subcategories List */}
                                    {cat.subcategories.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                                                Subcategories
                                            </h4>
                                            <ul className="space-y-2">
                                                {cat.subcategories.map((sub) => (
                                                    <li
                                                        key={sub}
                                                        className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors group"
                                                    >
                                                        <span className="text-gray-700 font-medium">{sub}</span>
                                                        <button
                                                            onClick={() => handleDeleteSub(cat._id, sub)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Add Subcategory */}
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newSub[cat._id] || ""}
                                            placeholder="Add new subcategory..."
                                            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            onChange={(e) =>
                                                setNewSub({ ...newSub, [cat._id]: e.target.value })
                                            }
                                        />
                                        <button
                                            onClick={() => handleAddSubcategory(cat._id)}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
