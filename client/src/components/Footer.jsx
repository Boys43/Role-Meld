import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {/* About Us */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mauris
              risus, lobortis a commodo at, varius sit amet ipsum.
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">T.</span> (00) 658 54332
            </p>
            <p className="text-sm">
              <span className="font-semibold">E.</span>{" "}
              <a href="mailto:hello@uxper.co" className="hover:underline">
                hello@uxper.co
              </a>
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-800">About us</a></li>
              <li><a href="#" className="hover:text-gray-800">Career</a></li>
              <li><a href="#" className="hover:text-gray-800">Blogs</a></li>
              <li><a href="#" className="hover:text-gray-800">FAQ’s</a></li>
              <li><a href="#" className="hover:text-gray-800">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-800">Jobs</a></li>
              <li><a href="#" className="hover:text-gray-800">Companies</a></li>
              <li><a href="#" className="hover:text-gray-800">Candidates</a></li>
              <li><a href="#" className="hover:text-gray-800">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-800">Partner</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-800">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-800">Terms of Use</a></li>
              <li><a href="#" className="hover:text-gray-800">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-800">Updates</a></li>
              <li><a href="#" className="hover:text-gray-800">Documentation</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Linkedin size={16} /> Linkedin
              </li>
              <li className="flex items-center gap-2">
                <Twitter size={16} /> Twitter
              </li>
              <li className="flex items-center gap-2">
                <Facebook size={16} /> Facebook
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} /> Instagram
              </li>
              <li className="flex items-center gap-2">
                <Youtube size={16} /> Youtube
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © 2025 Uxper. All Right Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
