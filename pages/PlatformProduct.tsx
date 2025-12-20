
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap, CheckCircle2, ArrowRight, BarChart3, Globe, Palette, ShieldCheck, CreditCard, MessageSquare } from 'lucide-react';
import Footer from '../components/Footer';

const PlatformProduct: React.FC = () => {
  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">R</div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Remote Business Partner</span>
            </Link>
            <div className="hidden md:flex space-x-8 items-center text-left">
              <Link to="/careers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Current Vacancies</Link>
              <Link to="/for-candidates" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Candidates</Link>
              <Link to="/careers?tab=employers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Employers</Link>
              <Link to="/platform-product" className="text-sm font-medium text-blue-600">Platform</Link>
              <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-28 bg-slate-900 overflow-hidden text-left">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                Now Available for Business Licensing
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Your Proprietary <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Recruitment OS</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
                Deploy the world's most intelligent hiring stack within your own organization. Our platform is now available for businesses seeking an elite, automated, and scalable recruitment solution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <a 
                    href="#pricing" 
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
                  >
                      View Licensing Options
                      <ArrowRight className="w-5 h-5" />
                  </a>
                  <Link 
                    to="/login"
                    className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                      Live Demo
                  </Link>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="mt-16 -mb-48 relative rounded-xl bg-slate-800 p-2 shadow-2xl border border-slate-700 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                <img 
                    src="https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
                    alt="Platform Dashboard" 
                    className="rounded-lg opacity-90 w-full"
                />
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="pt-56 pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Enterprise Power, Custom Tailored</h2>
                  <p className="text-lg text-slate-600 text-center">We've built the ultimate recruitment engine so you don't have to. Licensed for internal use by high-growth companies.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-left">
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 transition-all hover:shadow-lg text-left">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                          <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 text-left">Applicant Tracking</h3>
                      <p className="text-slate-600 mb-4 text-left">
                          Visual pipelines that let you drag-and-drop candidates through stages. Never lose track of a resume again.
                      </p>
                      <ul className="space-y-2 text-left">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Customizable stages</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Email integration</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Team collaboration</li>
                      </ul>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 transition-all hover:shadow-lg relative overflow-hidden text-left">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Zap className="w-24 h-24 text-purple-600" />
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 relative z-10">
                          <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10 text-left">AI Copilot</h3>
                      <p className="text-slate-600 mb-4 relative z-10 text-left">
                          Your always-on recruiting assistant. Generate job descriptions, screen resumes, and draft emails instantly.
                      </p>
                      <ul className="space-y-2 relative z-10 text-left">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Resume Analysis</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Auto-Generated Interview Qs</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Contextual Outreach</li>
                      </ul>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 transition-all hover:shadow-lg text-left">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                          <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 text-left">Branded Career Sites</h3>
                      <p className="text-slate-600 mb-4 text-left">
                          Launch a professional career portal in one click. No coding required. Show off your culture and benefits.
                      </p>
                      <ul className="space-y-2 text-left">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> SEO Optimized</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Mobile Responsive</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500"/> Custom Domain Support</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

      {/* White-label Section */}
      <div className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-16 items-center text-left">
                  <div className="relative">
                      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                          <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4">
                              <div className="flex items-center justify-between">
                                  <div className="h-6 w-32 bg-blue-500/20 rounded-md"></div>
                                  <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                              </div>
                              <div className="space-y-2">
                                  <div className="h-4 w-full bg-slate-800 rounded"></div>
                                  <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
                              </div>
                              <div className="pt-4 grid grid-cols-3 gap-2">
                                  <div className="h-20 bg-slate-800 rounded-lg"></div>
                                  <div className="h-20 bg-slate-800 rounded-lg"></div>
                                  <div className="h-20 bg-slate-800 rounded-lg"></div>
                              </div>
                          </div>
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl hidden lg:block">
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">Brand Identity</p>
                          <p className="text-sm font-medium">Fully customizable UI & Domains</p>
                      </div>
                  </div>
                  <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-6 text-left">White-Label & Agency Solutions</h2>
                      <p className="text-lg text-slate-600 mb-8 leading-relaxed text-left">
                          For recruitment agencies and large enterprises, we offer fully white-labeled environments. Host our platform on your own domain, under your own brand, with complete control over the candidate experience.
                      </p>
                      <div className="space-y-4 text-left">
                          <div className="flex items-center gap-3 text-slate-700 font-semibold">
                              <Palette className="w-5 h-5 text-blue-600" />
                              Custom Logos, Colors & Styling
                          </div>
                          <div className="flex items-center gap-3 text-slate-700 font-semibold text-left">
                              <Globe className="w-5 h-5 text-blue-600" />
                              Custom Domain & SSL Mapping
                          </div>
                          <div className="flex items-center gap-3 text-slate-700 font-semibold text-left">
                              <ShieldCheck className="w-5 h-5 text-blue-600" />
                              Enterprise Security & SSO Integration
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing Tailored to Your Volume</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
                  We don't believe in one-size-fits-all. Our licensing models scale with your hiring needs.
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Business License</h3>
                      <p className="text-slate-500 text-sm mb-6">Perfect for scaling startups and SMEs.</p>
                      <div className="mb-8">
                          <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                          <span className="text-slate-400 font-medium ml-2">/ month</span>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Unlimited Jobs</li>
                          <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Full AI Suite Access</li>
                          <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Branded Career Portal</li>
                      </ul>
                      <button className="w-full py-4 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 transition-colors">Contact Sales</button>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col transform md:scale-105">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white">Enterprise & White-Label</h3>
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Recommended</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">For agencies and high-volume organizations.</p>
                      <div className="mb-8">
                          <span className="text-4xl font-extrabold text-white">Tiered</span>
                          <span className="text-slate-500 font-medium ml-2">/ volume</span>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Everything in Business</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Custom White-Label UI</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Priority Support & API</li>
                      </ul>
                      <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">Get Custom Quote</button>
                  </div>
              </div>
          </div>
      </div>

      {/* Metrics Section */}
      <div className="py-24 bg-slate-900 text-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid md:grid-cols-2 gap-16 items-center text-left">
                   <div className="text-left">
                       <h2 className="text-3xl font-bold mb-6 text-left">Data-Driven Hiring Decisions</h2>
                       <p className="text-slate-400 text-lg mb-8 text-left">
                           Stop guessing. Our built-in analytics give you insights into your pipeline health, time-to-hire, and sourcing effectiveness.
                       </p>
                       <div className="grid grid-cols-2 gap-8 text-left">
                           <div className="text-left">
                               <p className="text-4xl font-bold text-blue-400 mb-2">40%</p>
                               <p className="text-slate-400 text-sm">Reduction in time-to-hire</p>
                           </div>
                           <div className="text-left">
                               <p className="text-4xl font-bold text-purple-400 mb-2">2x</p>
                               <p className="text-slate-400 text-sm">Qualified candidate flow</p>
                           </div>
                       </div>
                   </div>
                   <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-left">
                       <div className="flex items-center justify-between mb-8">
                           <h4 className="font-bold">Pipeline Velocity</h4>
                           <BarChart3 className="text-slate-500" />
                       </div>
                       <div className="space-y-4">
                           <div>
                               <div className="flex justify-between text-sm mb-1">
                                   <span>Engineering</span>
                                   <span className="text-blue-400">12 days</span>
                               </div>
                               <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500 w-[70%]"></div>
                               </div>
                           </div>
                           <div>
                               <div className="flex justify-between text-sm mb-1">
                                   <span>Marketing</span>
                                   <span className="text-purple-400">8 days</span>
                               </div>
                               <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                   <div className="h-full bg-purple-500 w-[85%]"></div>
                               </div>
                           </div>
                           <div>
                               <div className="flex justify-between text-sm mb-1">
                                   <span>Sales</span>
                                   <span className="text-green-400">15 days</span>
                               </div>
                               <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                   <div className="h-full bg-green-500 w-[60%]"></div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlatformProduct;
