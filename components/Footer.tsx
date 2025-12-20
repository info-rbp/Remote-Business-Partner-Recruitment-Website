
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12 text-left">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="font-bold text-xl tracking-tight text-white">Remote Business Partner</span>
            </div>
            <p className="max-w-sm text-slate-400">
              The complete talent acquisition partner for high-growth teams. We blend executive headhunting expertise with proprietary AI intelligence to build world-class organizations.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/platform-product" className="hover:text-blue-400 transition-colors">Our Technology</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Career Portal</Link></li>
              <li><Link to="/careers?tab=employers" className="hover:text-blue-400 transition-colors">Client Solutions</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Insights</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Hiring Blog</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Remote Business Partner. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
