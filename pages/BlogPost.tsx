
import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import Footer from '../components/Footer';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogPosts } = useAppStore();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
      return <Navigate to="/blog" replace />;
  }

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
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

      <div className="bg-slate-50 border-b border-slate-200 text-left">
           <div className="max-w-4xl mx-auto px-4 pt-12 pb-12 text-left">
               <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors text-left">
                   <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
               </Link>
               <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight text-left">{post.title}</h1>
           </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-left">
            <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-2xl mb-12 shadow-lg text-left" />
            <div className="prose prose-lg prose-slate max-w-none text-left" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
