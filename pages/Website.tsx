
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Zap, Users, Briefcase, Globe, Target, ShieldCheck, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

const Website: React.FC = () => {
  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">R</div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Remote Business Partner</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/careers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Find a Job</Link>
              <Link to="/for-candidates" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">For Candidates</Link>
              <Link to="/careers?tab=employers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Hire Talent</Link>
              <Link to="/platform-product" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Our Tech</Link>
              <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Insights</Link>
              <Link to="/login" className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">Client Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none text-left">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Human Expertise Augmented by Gemini 2.5
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight animate-fade-in-up">
                  The Future of Strategic <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Talent Acquisition</span>
              </h1>
              
              <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-1000">
                  We don't just fill seats; we build high-performance teams. Remote Business Partner blends 
                  deep industry headhunting expertise with proprietary AI technology to deliver the top 1% 
                  of global talent to your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-2000">
                  <Link 
                    to="/careers?tab=employers" 
                    className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                  >
                      <Briefcase className="w-5 h-5" />
                      Partner With Us
                  </Link>
                  <Link 
                    to="/careers" 
                    className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                      <Search className="w-5 h-5" />
                      Find a New Role
                  </Link>
              </div>

              {/* Ecosystem Preview */}
              <div className="mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/50 shadow-2xl backdrop-blur overflow-hidden animate-fade-in-up animation-delay-4000">
                   <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-white">
                           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                           <span className="text-xs font-bold uppercase tracking-widest opacity-80">RBP Ecosystem: Live Transparency</span>
                       </div>
                       <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <span>Sourcing</span>
                           <ArrowRight className="w-3 h-3" />
                           <span>Vetting</span>
                           <ArrowRight className="w-3 h-3" />
                           <span>Placement</span>
                       </div>
                   </div>
                   <div className="bg-slate-50 p-2 border-t border-slate-200">
                       <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" alt="Recruitment Ecosystem" className="rounded-2xl opacity-90 shadow-inner" />
                   </div>
                   <div className="p-6 bg-white flex flex-col md:flex-row gap-6 items-center justify-between text-left">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-1">Proprietary Client Portal</h4>
                            <p className="text-sm text-slate-500">Track every headhunting lead and interview stage in real-time with full AI-generated dossiers.</p>
                        </div>
                        <Link to="/platform-product" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">Learn About Our Tech <ArrowRight className="w-4 h-4"/></Link>
                   </div>
              </div>
          </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
              <div className="max-w-3xl mb-16">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Strategic Recruitment Solutions</h2>
                  <p className="text-xl text-slate-600">We offer a range of specialized services designed to help scaling companies build world-class organizations without the traditional friction.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                          <Target className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Executive Search</h3>
                      <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                          Our discreet, high-touch headhunting service for leadership roles. We identify and attract visionary talent that isn't actively on the job market.
                      </p>
                      <Link to="/careers?tab=employers" className="text-blue-600 font-bold flex items-center gap-2 group">
                          Explore Search <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </div>
                   <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                          <Globe className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Remote Team Scaling</h3>
                      <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                          Build entire departments across borders. We handle the sourcing, vetting, and local compliance checks so you can focus on building your product.
                      </p>
                      <Link to="/careers?tab=employers" className="text-purple-600 font-bold flex items-center gap-2 group">
                          Scale Globally <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </div>
                   <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                          <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Intelligent Vetting</h3>
                      <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                          Using our Gemini-powered engine, we conduct deep technical and cultural assessments to ensure every candidate delivered is a perfect match.
                      </p>
                      <Link to="/platform-product" className="text-emerald-600 font-bold flex items-center gap-2 group">
                          View Vetting Tech <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-20 items-center text-left">
                  <div className="relative">
                      <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Recruitment Excellence" className="rounded-3xl shadow-2xl" />
                      <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl max-w-xs hidden lg:block">
                          <p className="text-3xl font-bold mb-2">98%</p>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">Placement retention rate after 12 months for our executive search placements.</p>
                      </div>
                  </div>
                  <div>
                      <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Recruitment Philosophy</h2>
                      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                          Traditional recruitment is broken. Agencies focus on volume; we focus on precision. 
                          We treat your brand as our own, acting as a true business partner to ensure your 
                          growth is sustained by high-quality human capital.
                      </p>
                      <div className="space-y-6">
                          <div className="flex gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                  <Users className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">Dedicated Account Partners</h4>
                                  <p className="text-slate-500 text-sm mt-1">Direct access to a recruitment specialist who understands your specific niche and culture.</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                  <TrendingUp className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">Performance-Based Models</h4>
                                  <p className="text-slate-500 text-sm mt-1">We win when you win. Our engagement models are structured to incentivize quality placements and long-term success.</p>
                              </div>
                          </div>
                      </div>
                      <Link 
                        to="/careers?tab=employers" 
                        className="mt-10 inline-flex items-center px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                      >
                          Schedule a Strategic Call
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Zap className="w-[800px] h-[800px]" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to hire your next superstar?</h2>
              <p className="text-xl text-blue-100 mb-10">Stop sifting through noise. Let our experts and technology find the talent you need to reach the next level.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/careers?tab=employers" className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl">Hire a Specialist</Link>
                  <Link to="/for-candidates" className="px-10 py-4 bg-blue-700 text-white border border-blue-500 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all">Submit Your CV</Link>
              </div>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default Website;
