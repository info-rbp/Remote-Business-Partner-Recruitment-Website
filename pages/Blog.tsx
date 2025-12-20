
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Footer from '../components/Footer';

const Blog: React.FC = () => {
  const { blogPosts } = useAppStore();

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 cursor-pointer text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">R</div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Remote Business Partner</span>
            </Link>
            <div className="hidden md:flex space-x-8 items-center text-left">
              <Link to="/careers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Current Vacancies</Link>
              <Link to="/for-candidates" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Candidates</Link>
              <Link to="/careers?tab=employers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Employers</Link>
              <Link to="/platform-product" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Platform</Link>
              <Link to="/blog" className="text-sm font-medium text-blue-600">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-slate-50 py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Insights & Resources</h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto text-center">
                  Expert advice on remote hiring, team management, and the future of work.
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 text-left">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {blogPosts.map((post) => (
                  <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left">
                      <div className="h-48 overflow-hidden relative text-left">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-slate-800">{post.category}</div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col text-left">
                          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 text-left">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3"/> {post.author}</span>
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors text-left">{post.title}</h2>
                          <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1 text-left">{post.excerpt}</p>
                          <div className="flex items-center text-blue-600 font-medium text-sm mt-auto text-left">
                              Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
