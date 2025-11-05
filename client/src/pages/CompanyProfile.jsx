import React, { useContext, useEffect, useState } from 'react'
import Img from '../components/Image'
import { ArrowUpFromLine, CircleUser, Filter, Link, Users, Star, MapPin, Calendar, Globe, Mail, Phone, Building2, Camera, Heart, MessageSquare, ThumbsUp, Eye, Briefcase, Clock, Award, TrendingUp } from "lucide-react"
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import JobCard from '../components/JobCard';
import NotFound404 from '../components/NotFound404';
import SimplePagination from '../components/SimplePagination';

export const CompanyJobs = () => {
    // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams()

  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [filter, setFilter] = useState("recent"); // default filter


  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Fetch company jobs
  const getCompanyJobs = async () => {
    setCompanyLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobsbyid`, { id });
      if (data.success) {
        setCompanyJobs(data.companyJobs);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    getCompanyJobs();
  }, [id]);

  // Apply filter
  const filteredJobs = companyJobs
    .slice() // copy array before sorting
    .filter((job) => {
      if (filter === "featured") return job.sponsored === true;
      return true; // recent shows all
    })
    .sort((a, b) => {
      if (filter === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  if (companyLoading) return <Loading />;

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4">
        <h3 className='font-semibold flex items-center gap-3'>
          <Filter className='text-[var(--primary-color)]' />
          Filter
        </h3>
        {["recent", "featured"].map((f) => (
          <span
            key={f}
            className={`cursor-pointer px-4 py-2 rounded-lg ${filter === f ? "bg-[var(--primary-color)]/50 border border-[var(--primary-color)] text-white" : "bg-gray-200"
              }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </span>
        ))}
      </div>

      <SimplePagination pageSize={6}>
        <ul className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} e={job} />)
          ) : (
            <NotFound404 value={"No Job Found"} margin={"mt-5"} />
          )}
        </ul>
      </SimplePagination>
    </div>
  );
};


export const CompanyOverview = ({ companyDetails }) => {
  // Use uploaded company images if available, otherwise fallback to sample photos
  const companyImages = companyDetails?.companyImages || [];
  const samplePhotos = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400"
  ];
  
  // Display uploaded images if available, otherwise show sample photos
  const displayPhotos = companyImages.length > 0 ? companyImages : samplePhotos;

  return (
    <div className="space-y-8">
      {/* Company Overview */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About {companyDetails?.company}</h3>
            <p className="text-gray-700 leading-relaxed">
              {companyDetails?.about || `${companyDetails?.company} is a leading company in the ${companyDetails?.industry || 'technology'} industry. We are committed to delivering exceptional services and creating innovative solutions for our clients. Our team of dedicated professionals works tirelessly to maintain our reputation for excellence and continue growing in the competitive market.`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Founded</h4>
              </div>
              <p className="text-gray-700">
                {companyDetails?.establishedAt 
                  ? new Date(companyDetails.establishedAt).getFullYear()
                  : new Date(companyDetails?.createdAt).getFullYear()
                }
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Company Size</h4>
              </div>
              <p className="text-gray-700">{companyDetails?.members || '50-200'} employees</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Industry</h4>
              </div>
              <p className="text-gray-700">{companyDetails?.industry || 'Technology'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Photos */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Photos</h2>
          </div>
          <span className="text-sm text-gray-500">{displayPhotos.length} photos</span>
        </div>
        
        {displayPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayPhotos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden group cursor-pointer">
                <img 
                  src={photo} 
                  alt={`${companyDetails?.company} office ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No company photos available</p>
            <p className="text-gray-400 text-sm">Company photos will appear here once uploaded</p>
          </div>
        )}
      </div>

      {/* Company Statistics */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Company Stats</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {companyDetails?.sentJobs?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {companyDetails?.followers || 0}
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {companyDetails?.profileScore || 0}%
            </div>
            <div className="text-sm text-gray-600">Profile Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {new Date().getFullYear() - new Date(companyDetails?.establishedAt || companyDetails?.createdAt).getFullYear()}
            </div>
            <div className="text-sm text-gray-600">Years Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompanyReviews = ({ companyId }) => {
  const { backendUrl, userData } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    workLifeBalance: 3,
    salary: 3,
    culture: 3,
    management: 3,
    careerGrowth: 3,
    isAnonymous: false,
    jobTitle: '',
    employmentStatus: 'current',
    workDuration: ''
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company-reviews/${companyId}`);
      if (data.success) {
        setReviews(data.reviews);
        setReviewStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!userData) {
      toast.error('Please login to add a review');
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company-reviews/${companyId}`,
        newReview,
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success('Review added successfully!');
        setShowAddReview(false);
        setNewReview({
          rating: 5,
          title: '',
          review: '',
          pros: '',
          cons: '',
          workLifeBalance: 3,
          salary: 3,
          culture: 3,
          management: 3,
          careerGrowth: 3,
          isAnonymous: false,
          jobTitle: '',
          employmentStatus: 'current',
          workDuration: ''
        });
        fetchReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (companyId) {
      fetchReviews();
    }
  }, [companyId]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {reviewStats && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(Math.round(reviewStats.avgRating))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {reviewStats.avgRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-gray-500">({reviewStats.totalReviews} reviews)</span>
            </div>
          )}
        </div>
        <span
          onClick={() => setShowAddReview(true)}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Write a Review
        </span>
      </div>

      {/* Rating Breakdown */}
      {reviewStats && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reviewStats.avgWorkLifeBalance?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Work-Life Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reviewStats.avgSalary?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Salary & Benefits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reviewStats.avgCulture?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Culture</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {reviewStats.avgManagement?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Management</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reviewStats.avgCareerGrowth?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Career Growth</div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.reviewerProfilePicture && !review.isAnonymous ? (
                    <Img src={review.reviewerProfilePicture} style="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <CircleUser className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {review.jobTitle && <span>{review.jobTitle}</span>}
                      {review.employmentStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          review.employmentStatus === 'current' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {review.employmentStatus === 'current' ? 'Current Employee' : 'Former Employee'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>
              
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Pros
                      </h5>
                      <p className="text-green-700 text-sm">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Cons
                      </h5>
                      <p className="text-red-700 text-sm">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {review.workDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {review.workDuration}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.isHelpful})
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Be the first to review this company!</p>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                <span
                  onClick={() => setShowAddReview(false)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✕
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        onClick={() => setNewReview({...newReview, rating: i + 1})}
                        className="cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Summarize your experience"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience working at this company"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
                    <textarea
                      value={newReview.pros}
                      onChange={(e) => setNewReview({...newReview, pros: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What did you like about working here?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
                    <textarea
                      value={newReview.cons}
                      onChange={(e) => setNewReview({...newReview, cons: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What could be improved?"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work-Life Balance</label>
                    <select
                      value={newReview.workLifeBalance}
                      onChange={(e) => setNewReview({...newReview, workLifeBalance: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary & Benefits</label>
                    <select
                      value={newReview.salary}
                      onChange={(e) => setNewReview({...newReview, salary: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Culture</label>
                    <select
                      value={newReview.culture}
                      onChange={(e) => setNewReview({...newReview, culture: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReview.isAnonymous}
                      onChange={(e) => setNewReview({...newReview, isAnonymous: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Post anonymously</span>
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <span
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </span>
                  <span
                    onClick={submitReview}
                    disabled={!newReview.title || !newReview.review}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { id } = useParams();

  const { backendUrl, userData, frontendUrl } = useContext(AppContext);

  const [followLoading, setFollowLoading] = useState(false)

  const [isFollowing, setIsFollowing] = useState(
    userData?.followedAccounts?.includes(id)
  );
  const followUnfollow = async () => {
    if (!userData || !userData._id) {
      toast.error("Please login to follow companies");
      return;
    }

    setFollowLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/follow-unfollow-acc`, {
        companyId: id,
        followerId: userData._id
      });

      if (data.success) {
        toast.success(data.message);
        setIsFollowing(!isFollowing)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setFollowLoading(false);
    }
  }

  const [companyDetails, setcompanyDetails] = useState({})
  const [companyDetailsLoading, setCompanyDetailsLoading] = useState(false)

  const getCompanyDetails = async (req, res) => {
    setCompanyDetailsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/getcompanydetails`, { companyId: id })
      if (data.success) {
        setcompanyDetails(data.company)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCompanyDetailsLoading(false)
    }
  }

  useEffect(() => {
    getCompanyDetails()
  }, [isFollowing]);

  console.log('companyDetails', companyDetails)

  if (companyDetailsLoading) {
    return <Loading />
  }

  return (
    <main className='bg-gray-50 min-h-[calc(100vh-4.6rem)]'>
      {/* Hero Section */}
      <section className='bg-white shadow-sm'>
        <div className='relative'>
          <div className='h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden'>
            {companyDetails.banner ? (
              <Img src={companyDetails.banner} style="w-full h-full object-cover" />
            ) : (
              <div className='w-full h-full bg-gradient-to-r from-blue-600 to-purple-600' />
            )}
          </div>
          
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='relative -mt-16 pb-8'>
              <div className='flex flex-col sm:flex-row items-start sm:items-end gap-6'>
                <div className='flex-shrink-0'>
                  {companyDetails.profilePicture ? (
                    <Img src={companyDetails.profilePicture} style="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white" />
                  ) : (
                    <div className='w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white flex items-center justify-center text-4xl font-bold text-gray-600'>
                      {companyDetails?.company?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className='flex-1 min-w-0'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {companyDetails.company}
                      </h1>
                      <div className='flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4'>
                        <div className='flex items-center gap-2'>
                          <CircleUser className='w-4 h-4' />
                          <span className='font-semibold'>{companyDetails.followers}</span> Followers
                        </div>
                        <div className='flex items-center gap-2'>
                          <Briefcase className='w-4 h-4' />
                          <span className='font-semibold'>{companyDetails?.sentJobs?.length || 0}</span> Jobs Posted
                        </div>
                        <div className='flex items-center gap-2'>
                          <Users className='w-4 h-4' />
                          <span className='font-semibold'>{companyDetails.members || '50-200'}</span> Employees
                        </div>
                        {companyDetails?.industry && (
                          <div className='flex items-center gap-2'>
                            <Building2 className='w-4 h-4' />
                            <span>{companyDetails.industry}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-3'>
                      <span
                        onClick={() => {
                          copy(frontendUrl + location.pathname)
                          toast.success('Link copied to clipboard!')
                        }}
                        className='cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                      >
                        <Link className='w-4 h-4' />
                        Share
                      </span>
                      
                      {id !== userData?.authId && (
                        <span
                          onClick={followUnfollow}
                          disabled={followLoading}
                          className={`cursor-pointer flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                            isFollowing 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {followLoading ? (
                            'Loading...'
                          ) : isFollowing ? (
                            <>
                              <Heart className='w-4 h-4 fill-current' />
                              Following
                            </>
                          ) : (
                            <>
                              <Heart className='w-4 h-4' />
                              Follow
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        {/* Navigation Bar */}
        <nav className='p-3 border-b border-gray-300 w-[90%] mx-auto'>
          <ul className='flex items-center gap-10'>
            <li className={`cursor-pointer ${activeTab === 'overview' && "underline"} underline-offset-8 font-semibold text-lg hover:text-blue-600 transition-colors`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li className={`cursor-pointer ${activeTab === 'jobs' && "underline"} underline-offset-8 font-semibold text-lg hover:text-blue-600 transition-colors`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </li>
            <li className={`cursor-pointer ${activeTab === 'reviews' && "underline"} underline-offset-8 font-semibold text-lg hover:text-blue-600 transition-colors`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </li>
          </ul>
        </nav>
      </section>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
        <div className='w-full'>
          {activeTab === 'overview' ? (
            <CompanyOverview companyDetails={companyDetails} />
          ) : activeTab === 'jobs' ? (
            <CompanyJobs />
          ) : (
            <CompanyReviews companyId={id} />
          )}
        </div>

        <aside className="lg:w-80 bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-xl text-white">Information</h2>
            </div>
          </div>

          <div className='px-6 py-8 space-y-8'>
            {/* About Section */}
            <div className='bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200'>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  About
                </h3>
              </div>
              <p className='text-xl font-bold text-slate-900 mb-3'>
                {companyDetails?.company}
              </p>
              <span className='text-slate-600 leading-relaxed text-sm'>
                {companyDetails?.about || (
                  <span>
                    {companyDetails?.company} was established on{' '}
                    {companyDetails?.establishedAt
                      ? new Date(companyDetails.establishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : new Date(companyDetails?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    }
                  </span>
                )}
              </span>
              {companyDetails?.establishedAt && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600">
                    Established {new Date(companyDetails.establishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className='rounded-xl p-6 border border-slate-200 bg-white'>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  Get in Touch
                </h3>
              </div>
              <div className='space-y-4'>
                {companyDetails?.email ? (
                  <div className='flex items-start group'>
                    <div className="bg-blue-50 p-2 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <a href={`mailto:${companyDetails.email}`} className='text-blue-600 hover:text-blue-700 font-medium text-sm break-all'>
                        {companyDetails.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className='text-slate-400 italic text-sm'>No email available</p>
                )}

                {companyDetails?.contactNumber ? (
                  <div className='flex items-start group'>
                    <div className="bg-green-50 p-2 rounded-lg mr-3 group-hover:bg-green-100 transition-colors">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Phone</p>
                      <span className='text-slate-700 font-medium text-sm'>{companyDetails.contactNumber}</span>
                    </div>
                  </div>
                ) : (
                  <p className='text-slate-400 italic text-sm'>No phone available</p>
                )}

                {companyDetails?.website && (
                  <div className='flex items-start group'>
                    <div className="bg-purple-50 p-2 rounded-lg mr-3 group-hover:bg-purple-100 transition-colors">
                      <Globe className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Website</p>
                      <a href={`https://${companyDetails.website}`} target="_blank" rel="noopener noreferrer" className='text-purple-600 hover:text-purple-700 font-medium text-sm break-all'>
                        {companyDetails.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className='rounded-xl p-6 border border-slate-200 bg-white'>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <h3 className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
                  Location
                </h3>
              </div>
              <div className='flex items-center'>
                <div className="bg-red-50 p-2 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div className='text-slate-700 flex items-center gap-2'>
                  <span>
                    {companyDetails?.city && companyDetails.city},
                  </span>
                  <span>
                    {companyDetails?.state && companyDetails.state},
                  </span>
                  <span>
                    {companyDetails?.country && companyDetails.country}
                  </span>
                  {!companyDetails?.city && !companyDetails?.state && !companyDetails?.country && (
                    <p className='text-slate-400 italic text-sm'>No location available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </main>
  )
}

export default CompanyProfile
