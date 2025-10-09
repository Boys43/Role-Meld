import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, Briefcase } from "lucide-react";
import { useLocation } from "react-router-dom";
import Img from "./Image";
import assets from "../assets/assets.js"


const Footer = () => {

  const location = useLocation();
  const restrctedPaths = ["/dashboard", 'editblog', "/admin", '/company-profile/:id', '/followed-accounts', '/category-jobs', '/jobdetails/:id']
  return (
    <footer className="bg-[var(--primary-color)] text-gray-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">

        {restrctedPaths.includes(location.pathname) ? null : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-700 mb-4">
              {/* Logo and Description */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Img src='/fav_logo.webp' />
                  </div>
                  <h2 className="text-xl font-bold text-white">Alfa Careers</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Helping people get jobs, build careers, and achieve success across the world.
                </p>

                {/* Social Icons */}
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 bg-[var(--secondary-color)] hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                    <Facebook size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 bg-[var(--secondary-color)] hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors">
                    <Twitter size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 bg-[var(--secondary-color)] hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 bg-[var(--secondary-color)] hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                    <Instagram size={16} />
                  </a>
                </div>
              </div>

              {/* Job Seekers */}
              <div>
                <h3 className="text-white font-semibold mb-4">Job Seekers</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <a href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                      Browse Jobs
                    </a>
                  </li>
                  <li>
                    <a href="/companies" className="text-gray-400 hover:text-white transition-colors">
                      Company Reviews
                    </a>
                  </li>
                  <li>
                    <a href="/countries" className="text-gray-400 hover:text-white transition-colors">
                      Browse by Country
                    </a>
                  </li>
                  <li>
                    <a href="/salary" className="text-gray-400 hover:text-white transition-colors">
                      Salary Search
                    </a>
                  </li>
                  <li>
                    <a href="/career-advice" className="text-gray-400 hover:text-white transition-colors">
                      Career Advice
                    </a>
                  </li>
                </ul>
              </div>

              {/* Employers */}
              <div>
                <h3 className="text-white font-semibold mb-4">Employers</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <a href="/post-job" className="text-gray-400 hover:text-white transition-colors">
                      Post a Job
                    </a>
                  </li>
                  <li>
                    <a href="/company-reviews" className="text-gray-400 hover:text-white transition-colors">
                      Employer Reviews
                    </a>
                  </li>
                  <li>
                    <a href="/recruitment" className="text-gray-400 hover:text-white transition-colors">
                      Recruitment Tools
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/resources" className="text-gray-400 hover:text-white transition-colors">
                      Employer Resources
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                <ul className="flex flex-col gap-3 text-sm">
                  <li className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} className="text-blue-400" />
                    Lahore, Pakistan
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-400" />
                    <a href="mailto:support@indeed.com" className="text-gray-400 hover:text-white transition-colors">
                      support@indeed.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-400" />
                    <a href="tel:+923286960243" className="text-gray-400 hover:text-white transition-colors">
                      +92 328 6960243
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Bottom Section */}
        <div className=" flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <span>© 2025 Alfa Career | All rights reserved</span>
          <div className="flex flex-wrap gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;