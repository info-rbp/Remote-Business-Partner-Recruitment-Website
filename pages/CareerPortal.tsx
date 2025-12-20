
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Job, JobStatus, CandidateStatus } from '../types';
import { 
  Search, MapPin, Briefcase, DollarSign, Clock, CheckCircle2, ArrowRight, 
  Building2, Globe, ChevronLeft, X, Loader2, Sparkles, UploadCloud, 
  ChevronDown, Target, Zap, ShieldCheck, TrendingUp, BarChart3, 
  FileText, UserPlus, Fingerprint, Microscope, Layers, MessageSquare, ShieldAlert
} from 'lucide-react';
import Footer from '../components/Footer';

const CareerPortal: React.FC = () => {
  const { jobs, addCandidate } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'employers' ? 'employers' : 'candidates';
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showGeneralApp, setShowGeneralApp] = useState(false);
  
  const searchTerm = searchParams.get('q') || '';
  const filters = {
      location: searchParams.get('location') || '',
      department: searchParams.get('department') || '',
      type: searchParams.get('type') || ''
  };
  
  const [application, setApplication] = useState({
      name: '',
      email: '',
      phone: '',
      resumeText: '',
      linkedin: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [clientForm, setClientForm] = useState({
      company: '',
      contactName: '',
      email: '',
      needs: ''
  });
  const [clientSubmitted, setClientSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetApplication();
  }, [activeTab]);

  const availableJobs = jobs.filter(j => j.status === JobStatus.OPEN);
  const locations = Array.from(new Set(availableJobs.map(j => j.location))).sort();
  const departments = Array.from(new Set(availableJobs.map(j => j.department))).sort();
  const types = Array.from(new Set(availableJobs.map(j => j.type))).sort();

  const openJobs = availableJobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filters.location ? j.location === filters.location : true;
    const matchesDepartment = filters.department ? j.department === filters.department : true;
    const matchesType = filters.type ? j.type === filters.type : true;
    
    return matchesSearch && matchesLocation && matchesDepartment && matchesType;
  });

  const handleSearchChange = (term: string) => {
    setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (term) next.set('q', term);
        else next.delete('q');
        return next;
    }, { replace: true });
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
    });
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, '');
  };

  const handleApply = async (e: React.FormEvent) => {
      e.preventDefault();
      const jobId = selectedJob ? selectedJob.id : 'general';
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      addCandidate({
          id: Date.now().toString(),
          jobId: jobId,
          name: application.name,
          email: application.email,
          phone: application.phone,
          status: CandidateStatus.APPLIED,
          appliedDate: new Date().toISOString().split('T')[0],
          resumeText: application.resumeText + (application.linkedin ? `\n\nLinkedIn: ${application.linkedin}` : '')
      });
      setSubmitting(false);
      setSuccess(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setApplication({
              ...application,
              resumeText: `[Simulated Content of ${file.name}]\n\nSenior Developer with 5 years of experience in React and Node.js...`
          });
      }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitting(false);
      setClientSubmitted(true);
  }

  const resetApplication = () => {
      setSuccess(false);
      setApplication({ name: '', email: '', phone: '', resumeText: '', linkedin: '' });
      setSelectedJob(null);
      setShowGeneralApp(false);
  };

  const renderApplicationForm = (title: string, subtitle?: string) => (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg text-left">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        {subtitle && <p className="text-slate-500 mb-6 text-sm">{subtitle}</p>}
        <form onSubmit={handleApply} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" value={application.name} onChange={e => setApplication({...application, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input required type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" value={application.email} onChange={e => setApplication({...application, email: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" value={application.phone} onChange={e => setApplication({...application, phone: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                <input type="url" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400" placeholder="https://linkedin.com/in/..." value={application.linkedin} onChange={e => setApplication({...application, linkedin: e.target.value})} />
            </div>
            <div>
                <div className="flex justify-between items-center mb-1 text-left">
                    <label className="block text-sm font-medium text-slate-700">Resume / Cover Letter *</label>
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-blue-600 font-medium hover:underline flex items-center"
                    >
                        <UploadCloud className="w-3 h-3 mr-1" />
                        Upload File
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
                </div>
                <textarea required rows={5} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-slate-800" placeholder="Paste your resume text here..." value={application.resumeText} onChange={e => setApplication({...application, resumeText: e.target.value})} />
                <p className="text-xs text-slate-400 mt-1">Our AI will analyze this text to match your skills.</p>
            </div>
            <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center"
            >
                {submitting ? <Loader2 className="animate-spin w-5 h-5"/> : 'Submit Application'}
            </button>
        </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">R</div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Remote Business Partner</span>
            </Link>
            <div className="hidden md:flex space-x-8 items-center text-left">
              <Link to="/careers" className={`text-sm font-medium transition-colors ${activeTab === 'candidates' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Current Vacancies</Link>
              <Link to="/for-candidates" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Candidates</Link>
              <Link to="/careers?tab=employers" className={`text-sm font-medium transition-colors ${activeTab === 'employers' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Employers</Link>
              <Link to="/platform-product" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Platform</Link>
              <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {activeTab === 'candidates' ? (
             !selectedJob ? (
                <>
                    <div className="bg-blue-600 py-20 px-4 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center text-left"></div>
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Next Remote Challenge</h1>
                            <p className="text-blue-100 text-lg mb-8">We connect world-class talent with forward-thinking companies. Explore opportunities that fit your lifestyle.</p>
                            
                            <div className="bg-white p-2 rounded-xl shadow-lg max-w-2xl mx-auto flex text-left">
                                <Search className="w-6 h-6 text-slate-400 m-3" />
                                <input 
                                    type="text" 
                                    placeholder="Search by job title or keyword..." 
                                    className="flex-1 outline-none text-slate-800 placeholder:text-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Search</button>
                            </div>

                            <div className="max-w-5xl mx-auto mt-8 flex flex-wrap justify-center gap-4 text-left">
                                <div className={`relative group flex items-center rounded-xl transition-all duration-200 ${filters.location ? 'bg-white shadow-lg ring-2 ring-blue-400' : 'bg-blue-800/40 border border-blue-400/30 hover:bg-blue-800/60'}`}>
                                    <div className="pointer-events-none absolute left-3.5 flex items-center">
                                        <MapPin className={`w-4 h-4 ${filters.location ? 'text-blue-600' : 'text-blue-200'}`} />
                                    </div>
                                    <select className={`appearance-none bg-transparent pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none cursor-pointer min-w-[180px] rounded-xl transition-colors ${filters.location ? 'text-blue-900' : 'text-white'}`} value={filters.location} onChange={e => handleFilterChange('location', e.target.value)}>
                                        <option value="" className="text-slate-900 bg-white">All Locations</option>
                                        {locations.map(l => <option key={l} value={l} className="text-slate-900 bg-white">{l}</option>)}
                                    </select>
                                    {filters.location ? (
                                         <button onClick={(e) => { e.stopPropagation(); clearFilter('location'); }} className="absolute right-2 p-1.5 hover:bg-slate-100 rounded-full text-blue-500 z-10 transition-colors">
                                             <X className="w-3.5 h-3.5" />
                                         </button>
                                    ) : <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />}
                                </div>
                                <div className={`relative group flex items-center rounded-xl transition-all duration-200 ${filters.department ? 'bg-white shadow-lg ring-2 ring-blue-400' : 'bg-blue-800/40 border border-blue-400/30 hover:bg-blue-800/60'}`}>
                                    <div className="pointer-events-none absolute left-3.5 flex items-center">
                                        <Building2 className={`w-4 h-4 ${filters.department ? 'text-blue-600' : 'text-blue-200'}`} />
                                    </div>
                                    <select className={`appearance-none bg-transparent pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none cursor-pointer min-w-[180px] rounded-xl transition-colors ${filters.department ? 'text-blue-900' : 'text-white'}`} value={filters.department} onChange={e => handleFilterChange('department', e.target.value)}>
                                        <option value="" className="text-slate-900 bg-white">All Departments</option>
                                        {departments.map(d => <option key={d} value={d} className="text-slate-900 bg-white">{d}</option>)}
                                    </select>
                                    {filters.department ? (
                                         <button onClick={(e) => { e.stopPropagation(); clearFilter('department'); }} className="absolute right-2 p-1.5 hover:bg-slate-100 rounded-full text-blue-500 z-10 transition-colors">
                                             <X className="w-3.5 h-3.5" />
                                         </button>
                                    ) : <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />}
                                </div>
                                <div className={`relative group flex items-center rounded-xl transition-all duration-200 ${filters.type ? 'bg-white shadow-lg ring-2 ring-blue-400' : 'bg-blue-800/40 border border-blue-400/30 hover:bg-blue-800/60'}`}>
                                    <div className="pointer-events-none absolute left-3.5 flex items-center">
                                        <Clock className={`w-4 h-4 ${filters.type ? 'text-blue-600' : 'text-blue-200'}`} />
                                    </div>
                                    <select className={`appearance-none bg-transparent pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none cursor-pointer min-w-[180px] rounded-xl transition-colors ${filters.type ? 'text-blue-900' : 'text-white'}`} value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
                                        <option value="" className="text-slate-900 bg-white">All Job Types</option>
                                        {types.map(t => <option key={t} value={t} className="text-slate-900 bg-white">{t}</option>)}
                                    </select>
                                    {filters.type ? (
                                         <button onClick={(e) => { e.stopPropagation(); clearFilter('type'); }} className="absolute right-2 p-1.5 hover:bg-slate-100 rounded-full text-blue-500 z-10 transition-colors">
                                             <X className="w-3.5 h-3.5" />
                                         </button>
                                    ) : <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-16 text-left">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Open Positions</h2>
                            <span className="text-slate-500">{openJobs.length} roles available</span>
                        </div>

                        {openJobs.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {openJobs.map(job => (
                                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden text-left" onClick={() => setSelectedJob(job)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm"><Briefcase className="w-6 h-6" /></div>
                                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                                            <span className="flex items-center"><Building2 className="w-4 h-4 mr-1 text-slate-400"/> {job.department}</span>
                                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {job.location}</span>
                                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1 text-slate-400"/> {job.salaryRange || 'Competitive'}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                            <span className="group-hover:font-bold transition-all">View Details</span>
                                            <span className="bg-blue-50 group-hover:bg-blue-600 group-hover:text-white p-1.5 rounded-full transition-all"><ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" /></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 px-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-50/50 mb-12 relative overflow-hidden animate-fade-in-up">
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">No matching roles found</h3>
                                <button onClick={() => setShowGeneralApp(true)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mx-auto">Join Network <ArrowRight className="w-5 h-5" /></button>
                            </div>
                        )}
                    </div>
                </>
             ) : (
                <div className="max-w-4xl mx-auto px-4 py-8 text-left">
                    <button onClick={() => setSelectedJob(null)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium text-left">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to jobs
                    </button>
                    {success ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-green-100 animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-left">Application Received!</h2>
                            <button onClick={resetApplication} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all text-left">Browse More Jobs</button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8 text-left">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedJob.title}</h1>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{selectedJob.description}</p>
                                </div>
                            </div>
                            <div className="lg:col-span-1">{renderApplicationForm("Apply Now", "Please fill out the form below.")}</div>
                        </div>
                    )}
                </div>
             )
        ) : (
            /* --- EMPLOYERS TAB CONTENT (OVERHAULED) --- */
            <div className="min-h-screen bg-slate-50 text-left">
                {/* Hero Section */}
                <div className="bg-indigo-900 py-24 px-4 text-white relative overflow-hidden border-b border-indigo-800">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" /> From ATS to Strategic Recruitment OS
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                            Build High-Performance <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Global Organizations</span>
                        </h1>
                        <p className="max-w-3xl text-xl text-indigo-100/80 mb-10 leading-relaxed">
                            Remote Business Partner is the strategic talent acquisition engine for scaling companies. 
                            We blend human headhunting expertise with proprietary AI intelligence to replace 
                            spreadsheets with a full-cycle decision support system.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#contact" className="px-10 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/50 flex items-center justify-center gap-2">
                                Request a Consultation
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link to="/platform-product" className="px-10 py-4 bg-indigo-800/40 text-white border border-indigo-500/50 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-300" />
                                View Platform Tech
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Core Recruitment Clusters */}
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Talent OS</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">We provide the spine for your growth, turning recruitment from a filing cabinet into a strategic advantage.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* 1. Core Recruitment Engine */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Recruitment Engine</h3>
                            <p className="text-slate-600 mb-6">Advanced ATS for end-to-end pipeline management with role-based workflows and smart candidate dossiers.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Pipeline Health Indicators</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Explainable Shortlist Rationale</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Automated Communication Logs</li>
                            </ul>
                        </div>

                        {/* 2. Job Distribution & Reach */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Talent Distribution</h3>
                            <p className="text-slate-600 mb-6">One-click distribution to global boards and social media amplification with conversion analytics.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Spend Optimization Insights</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Branded Conversion Analytics</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Role-Specific Recommendations</li>
                            </ul>
                        </div>

                        {/* 3. Proactive Sourcing */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                                <Microscope className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Talent Intelligence</h3>
                            <p className="text-slate-600 mb-6">Proactive headhunting using AI-powered sourcing across public profiles and engagement scoring.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Passive Candidate Discovery</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Skills Adjacency Detection</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Outreach Personalization Engine</li>
                            </ul>
                        </div>

                        {/* 4. Interviewing & Evaluation */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Evaluation Stack</h3>
                            <p className="text-slate-600 mb-6">Structured competency-based interviews and skills assessments mapped to role requirements.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Native Video Interview Response</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Interviewer Calibration Logs</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Cognitive & Problem-Solving Tests</li>
                            </ul>
                        </div>

                        {/* 5. Background & Risk */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-8">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Risk Management</h3>
                            <p className="text-slate-600 mb-6">Trust but verify quietly. Automated credential verification and sentiment-based reference analysis.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500"/> Jurisdictional Compliance Checks</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500"/> Automated Reference Sentiment</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500"/> Data Governance Controls</li>
                            </ul>
                        </div>

                        {/* 6. Onboarding & Analytics */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Hiring Analytics</h3>
                            <p className="text-slate-600 mb-6">Move from intuition to probability with market benchmarking and time-to-quality hire tracking.</p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Salary Benchmarking Engine</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Offer Acceptance Modeling</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Unfillable Role Early Alerts</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Recruitment Documentation Layer (RDL) */}
                <div className="bg-slate-900 py-24 text-white overflow-hidden text-left">
                    <div className="max-w-7xl mx-auto px-4 relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <FileText className="w-64 h-64" />
                        </div>
                        <div className="mb-16">
                            <h2 className="text-4xl font-bold mb-4">The Documentation Layer (RDL)</h2>
                            <p className="text-slate-400 text-xl max-w-3xl">We treat every recruitment document as structured data, not formatted prose. Your entire pipeline stays synchronized from JD to Onboarding.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Intent-Based JD Builder</h4>
                                        <p className="text-slate-400 text-sm">Automated templates that separate outcomes from responsibilities, with built-in bias checks and skill-to-assessment mapping.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Omni-Channel Ad Creator</h4>
                                        <p className="text-slate-400 text-sm">Generate variant-based ads for LinkedIn, niche boards, and social media. The JD stays stable; the ad adapts to the channel audience.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                                        <Fingerprint className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Interviewer Enablement Suite</h4>
                                        <p className="text-slate-400 text-sm">Question banks tied to role competencies, interviewer-specific guides, and embedded scoring rubrics to reduce noise.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-3xl p-10 border border-slate-700 shadow-2xl">
                                <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-6">Platform Intelligence</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-300">Single Source of Truth</span>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-300">Auto-Propagation of Changes</span>
                                        <Zap className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-300">Inconsistency Detection</span>
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                        <span className="text-slate-300">Jurisdictional Compliance</span>
                                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                    </div>
                                </div>
                                <p className="mt-8 text-xs text-slate-500 italic">"Documents should talk to each other. Humans shouldn't have to."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Outcomes Section */}
                <div className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <h4 className="text-3xl font-bold text-slate-900 mb-2">Efficiency</h4>
                                <p className="text-sm text-slate-500">Reduced recruiter hours per hire by 40%</p>
                            </div>
                            <div className="text-center">
                                <h4 className="text-3xl font-bold text-slate-900 mb-2">Decision Quality</h4>
                                <p className="text-sm text-slate-500">Measurable improvement in post-hire performance</p>
                            </div>
                            <div className="text-center">
                                <h4 className="text-3xl font-bold text-slate-900 mb-2">Experience</h4>
                                <p className="text-sm text-slate-500">Higher offer acceptance and lower candidate drop-off</p>
                            </div>
                            <div className="text-center">
                                <h4 className="text-3xl font-bold text-slate-900 mb-2">Scalability</h4>
                                <p className="text-sm text-slate-500">Hiring capability without linear HR headcount growth</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div id="contact" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-200">
                     <div className="grid md:grid-cols-2 gap-20 items-center">
                         <div className="text-left">
                             <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Transform Your Hiring?</h2>
                             <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                 Partner with Remote Business Partner to unlock a global talent pool and 
                                 an intelligence-led hiring process. Our specialists are ready to design your 
                                 custom Recruitment OS.
                             </p>
                             <div className="space-y-4">
                                 <div className="flex items-center gap-3 text-slate-700 font-medium">
                                     <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600"><CheckCircle2 className="w-4 h-4"/></div>
                                     Dedicated Account Managers
                                 </div>
                                 <div className="flex items-center gap-3 text-slate-700 font-medium">
                                     <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600"><CheckCircle2 className="w-4 h-4"/></div>
                                     Flexible Volume-Based Pricing
                                 </div>
                                 <div className="flex items-center gap-3 text-slate-700 font-medium">
                                     <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600"><CheckCircle2 className="w-4 h-4"/></div>
                                     Global Compliance Frameworks
                                 </div>
                             </div>
                         </div>
                         <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-left">
                             {clientSubmitted ? (
                                 <div className="text-center py-10 animate-fade-in-up">
                                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                                         <CheckCircle2 className="w-10 h-10" />
                                     </div>
                                     <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h3>
                                     <p className="text-slate-500">A partner specialist will contact you within 24 hours.</p>
                                     <button onClick={() => setClientSubmitted(false)} className="mt-8 text-indigo-600 font-bold hover:underline">Send another request</button>
                                 </div>
                             ) : (
                                 <form onSubmit={handleClientSubmit} className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Strategic Consultation</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Company Name</label>
                                        <input required className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Acme Global Tech" value={clientForm.company} onChange={e => setClientForm({...clientForm, company: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Work Email</label>
                                        <input required type="email" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. alex@acme.com" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Hiring Needs</label>
                                        <textarea rows={4} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="Briefly describe your current hiring goals..." value={clientForm.needs} onChange={e => setClientForm({...clientForm, needs: e.target.value})} />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center"
                                    >
                                        {submitting ? <Loader2 className="animate-spin w-6 h-6"/> : 'Partner With Us'}
                                    </button>
                                 </form>
                             )}
                         </div>
                     </div>
                </div>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CareerPortal;
