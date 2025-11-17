import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// React Icons
import { MdComputer, MdCampaign, MdDesignServices, MdAccountBalance, MdPeople, MdBusinessCenter, MdEngineering } from "react-icons/md";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Categories = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/categories');
      if (data.success) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const getIcon = (categoryName) => {
    switch (categoryName) {
      case "IT & Software": return MdComputer;
      case "Digital Marketing": return MdCampaign;
      case "Design & Creative": return MdDesignServices;
      case "Finance & Accounting": return MdAccountBalance;
      case "Human Resources": return MdPeople;
      case "Sales & Business Development": return MdBusinessCenter;
      case "Engineering & Architecture": return MdEngineering;
      default: return MdComputer;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar className={"max-w-6xl mx-auto"} />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
                <p className="text-gray-600 mt-2">Browse all available job categories and find your perfect match</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <MdComputer size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat, index) => {
                const Icon = getIcon(cat.name);

                return (
                  <div
                    key={index}
                    onClick={() => navigate('/category-jobs?category=' + encodeURIComponent(cat.name))}
                    className="group bg-white hover:bg-gray-50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3">
                          {cat.subcategories?.length || 0} subcategories
                        </p>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {cat.subcategories.slice(0, 3).map((subcat, subIndex) => (
                              <span
                                key={subIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                              >
                                {subcat.name}
                              </span>
                            ))}
                            {cat.subcategories.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                +{cat.subcategories.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
