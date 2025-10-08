import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Plus, Trash2, Tag, FolderPlus, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';

const CategoryManager = () => {
    const { backendUrl } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newSub, setNewSub] = useState({});
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importResults, setImportResults] = useState(null);

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

    // Delete entire category
    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (window.confirm(`Are you sure you want to delete the category "${categoryName}" and all its subcategories?`)) {
            try {
                await axios.delete(backendUrl + `/api/admin/categories/${categoryId}`);
                toast.success(`Category "${categoryName}" deleted successfully`);
                fetchCategories(); // refresh categories after deletion
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete category');
            }
        }
    };

    // Handle Excel file upload and parsing
    const handleExcelImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }

        setImporting(true);
        setImportResults(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Get the first worksheet
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    
                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    // Parse the data
                    const parsedCategories = parseExcelData(jsonData);
                    
                    if (parsedCategories.length === 0) {
                        toast.error('No valid category data found in the Excel file');
                        setImporting(false);
                        return;
                    }

                    // Send to backend
                    const response = await axios.post(
                        backendUrl + '/api/admin/categories/bulk-import',
                        { categories: parsedCategories }
                    );

                    if (response.data.success) {
                        setImportResults(response.data.results);
                        toast.success(response.data.message);
                        fetchCategories(); // Refresh the categories list
                    } else {
                        toast.error(response.data.error || 'Import failed');
                    }
                } catch (parseError) {
                    console.error('Excel parsing error:', parseError);
                    toast.error('Error parsing Excel file. Please check the format.');
                } finally {
                    setImporting(false);
                }
            };
            
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('File reading error:', error);
            toast.error('Error reading the file');
            setImporting(false);
        }

        // Clear the input
        event.target.value = '';
    };

    // Parse Excel data into categories format
    const parseExcelData = (jsonData) => {
        const categories = [];
        const categoryMap = new Map();

        // Skip header row if it exists
        const startRow = jsonData.length > 0 && 
            (typeof jsonData[0][0] === 'string' && jsonData[0][0].toLowerCase().includes('category')) ? 1 : 0;

        for (let i = startRow; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;

            const categoryName = row[0]?.toString().trim();
            const subcategoryName = row[1]?.toString().trim();

            if (!categoryName) continue;

            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, {
                    name: categoryName,
                    subcategories: []
                });
            }

            if (subcategoryName) {
                const category = categoryMap.get(categoryName);
                if (!category.subcategories.includes(subcategoryName)) {
                    category.subcategories.push(subcategoryName);
                }
            }
        }

        return Array.from(categoryMap.values());
    };

    // Download Excel template
    const downloadTemplate = () => {
        const templateData = [
            ['Category Name', 'Subcategory Name'],
            ['Technology', 'Web Development'],
            ['Technology', 'Mobile Development'],
            ['Technology', 'Data Science'],
            ['Marketing', 'Digital Marketing'],
            ['Marketing', 'Content Marketing'],
            ['Design', 'UI/UX Design'],
            ['Design', 'Graphic Design']
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        
        // Set column widths
        worksheet['!cols'] = [
            { width: 20 },
            { width: 25 }
        ];

        XLSX.writeFile(workbook, 'categories_template.xlsx');
        toast.success('Template downloaded successfully!');
    };

    return (
        <div className="w-full overflow-y-auto min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Manager</h1>
                    <p className="text-gray-600">Manage and organize job categories and subcategories</p>
                </div>

                {/* Add New Category */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Category</h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCategory}
                            placeholder="Enter category name..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Excel Import Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Import from Excel</h3>
                    <span className="text-gray-600 text-sm mb-4">
                        Upload an Excel file to bulk import categories and subcategories. 
                        The file should have two columns: "Category Name" and "Subcategory Name".
                    </span>
                    
                    <div className="flex flex-wrap gap-3 my-4">
                        <button
                            onClick={downloadTemplate}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Template
                        </button>
                        
                        <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            {importing ? 'Importing...' : 'Import Excel File'}
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleExcelImport}
                                disabled={importing}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {importing && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="text-blue-700">Processing Excel file...</span>
                        </div>
                    )}

                    {importResults && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Import Results:</h4>
                            <div className="space-y-1 text-sm">
                                <div className="text-green-700">
                                    ✅ Created: {importResults.created} categories
                                </div>
                                <div className="text-blue-700">
                                    🔄 Updated: {importResults.updated} categories
                                </div>
                                {importResults.errors.length > 0 && (
                                    <div className="text-red-700">
                                        ❌ Errors: {importResults.errors.length}
                                        <details className="mt-2">
                                            <summary className="cursor-pointer font-medium">View Errors</summary>
                                            <ul className="mt-2 space-y-1 pl-4">
                                                {importResults.errors.map((error, index) => (
                                                    <li key={index} className="text-xs">{error}</li>
                                                ))}
                                            </ul>
                                        </details>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories List */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-gray-500">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8">
                            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Categories Yet</h3>
                            <p className="text-gray-500">Start by adding your first category above</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {categories?.map((cat) => (
                                <div key={cat._id} className="border border-gray-200 rounded-lg p-4">
                                    {/* Category Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Tag className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                {cat.subcategories.length} subcategories
                                            </span>
                                            <button
                                                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title={`Delete category "${cat.name}"`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subcategories List */}
                                    {cat.subcategories.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-600 mb-2">Subcategories</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {cat.subcategories.map((sub) => (
                                                    <div
                                                        key={sub}
                                                        className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors group"
                                                    >
                                                        <span className="text-gray-700">{sub}</span>
                                                        <button
                                                            onClick={() => handleDeleteSub(cat._id, sub)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Subcategory */}
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newSub[cat._id] || ""}
                                            placeholder="Add new subcategory..."
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            onChange={(e) =>
                                                setNewSub({ ...newSub, [cat._id]: e.target.value })
                                            }
                                        />
                                        <button
                                            onClick={() => handleAddSubcategory(cat._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
