
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Zap, Shield } from 'lucide-react';
import Footer from '../components/Footer';

const ForCandidates: React.FC = () => {
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
              <Link to="/for-candidates" className="text-sm font-medium text-blue-600">Candidates</Link>
              <Link to="/careers?tab=employers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Employers</Link>
              <Link to="/platform-product" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Platform</Link>
              <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative pt-20 pb-24 bg-slate-50 overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium mb-8">
                  <Sparkles className="w-4 h-4" /> Candidate Experience 2.0
              </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                Accelerate Your Career with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Intelligent Matching</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                Stop applying into the void. Our AI-powered platform gets your profile in front of the right hiring managers, instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link to="/careers" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 text-left">
                      <Search className="w-5 h-5" /> Browse Jobs
                  </Link>
            </div>
        </div>
      </div>

      {/* Features */}
       <div className="py-24 bg-white text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                <div className="grid md:grid-cols-3 gap-12 text-left">
                     <div className="text-center text-left">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6"><Sparkles className="w-8 h-8" /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">AI Smart Match</h3>
                        <p className="text-slate-600">Our algorithms highlight your skills and experience.</p>
                    </div>
                     <div className="text-center text-left">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 text-left"><Zap className="w-8 h-8" /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 text-left mx-auto">Fast-Track Review</h3>
                        <p className="text-slate-600 text-left mx-auto max-w-xs">Verified candidates get priority status in the pipeline.</p>
                    </div>
                     <div className="text-center text-left">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6"><Shield className="w-8 h-8" /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Trusted Roles</h3>
                        <p className="text-slate-600">We personally vet every company.</p>
                    </div>
                </div>
            </div>
       </div>

       <Footer />
    </div>
  );
};

export default ForCandidates;
