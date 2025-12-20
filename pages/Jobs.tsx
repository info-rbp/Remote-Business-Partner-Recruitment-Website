import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { Job, JobStatus, CandidateStatus } from '../types';
import { Plus, Search, MapPin, DollarSign, Calendar, Wand2, Loader2, ChevronRight, X, Trash2, Archive, Users, CheckCircle2, Briefcase, FileEdit, Sparkles, Copy, Megaphone, Globe, Code, Clock, Eye } from 'lucide-react';
import { generateInterviewProcess, generateJobDescription, generateJobAd, generateSourcingStrategy } from '../services/geminiService';

const Jobs: React.FC = () => {
  const { jobs, candidates, addJob, updateJob, deleteJob } = useAppStore();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  // Sourcing State
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [sourcingStrategy, setSourcingStrategy] = useState<{linkedin: string, googleXray: string, github?: string, tips: string[]} | null>(null);
  const [loadingSourcing, setLoadingSourcing] = useState(false);

  // Ad Gen State
  const [adForm, setAdForm] = useState({ title: '', department: '', description: '' });
  const [generatedAd, setGeneratedAd] = useState('');
  const [generatingAd, setGeneratingAd] = useState(false);

  // Form State
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salaryRange: '',
  });

  const submitJob = async (status: JobStatus) => {
    if (!newJob.title || !newJob.description) {
        alert("Please provide at least a Job Title and Description.");
        return;
    }

    setLoadingAI(true);
    let process: string[] = [];
    
    try {
        // We always try to generate a custom process using AI if description exists
        if (newJob.description.length > 20) {
            const dummyJob = { ...newJob } as Job;
            process = await generateInterviewProcess(dummyJob);
        }
    } catch (error) {
        console.error("AI Process generation failed, using fallback.", error);
    } finally {
        const job: Job = {
            id: Date.now().toString(),
            title: newJob.title!,
            department: newJob.department || 'General',
            location: newJob.location || 'Remote',
            type: newJob.type || 'Full-time',
            status: status,
            description: newJob.description!,
            requirements: newJob.requirements || '',
            salaryRange: newJob.salaryRange,
            postedDate: new Date().toISOString().split('T')[0],
            interviewProcess: process.length > 0 ? process : ["Resume Screen", "Hiring Manager Interview", "Final Decision"],
            viewers: []
          };
      
          addJob(job);
          setLoadingAI(false);
          setShowModal(false);
          setNewJob({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', salaryRange: '' });
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitJob(JobStatus.OPEN);
  };

  const handleSaveDraft = async () => {
    await submitJob(JobStatus.DRAFT);
  };

  const handleGenerateDescription = async () => {
    if (!newJob.title) {
        alert("Please enter a job title first.");
        return;
    }
    setGeneratingDesc(true);
    try {
        const desc = await generateJobDescription(
            newJob.title, 
            newJob.department || 'General', 
            newJob.requirements || ''
        );
        setNewJob(prev => ({ ...prev, description: desc }));
    } catch (error) {
        console.error(error);
        alert("Failed to generate description. Please try again.");
    } finally {
        setGeneratingDesc(false);
    }
  };

  const handleGenerateAd = async () => {
    if (!adForm.title || !adForm.description) {
        alert("Please enter a job title and description.");
        return;
    }
    setGeneratingAd(true);
    try {
        const ad = await generateJobAd(adForm.title, adForm.department, adForm.description);
        setGeneratedAd(ad);
    } catch (error) {
        console.error(error);
        alert("Failed to generate ad. Please try again.");
    } finally {
        setGeneratingAd(false);
    }
  };

  const handleGenerateSourcing = async () => {
      if(!selectedJob) return;
      setLoadingSourcing(true);
      try {
          const strategy = await generateSourcingStrategy(selectedJob);
          setSourcingStrategy(strategy);
      } catch (error) {
          console.error(error);
          alert("Failed to generate sourcing strategy");
      } finally {
          setLoadingSourcing(false);
      }
  };

  const handleLoadJobForAd = (jobId: string) => {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
          setAdForm({
              title: job.title,
              department: job.department,
              description: job.description
          });
      } else {
          setAdForm({ title: '', department: '', description: '' });
      }
  };

  const handleDeleteJob = (id: string) => {
      if(window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
          deleteJob(id);
          setSelectedJob(null);
      }
  };

  const handleToggleStatus = (job: Job) => {
      let newStatus = JobStatus.OPEN;
      if (job.status === JobStatus.OPEN) newStatus = JobStatus.CLOSED;
      else if (job.status === JobStatus.CLOSED) newStatus = JobStatus.OPEN;
      else if (job.status === JobStatus.DRAFT) newStatus = JobStatus.OPEN;

      const updatedJob = { ...job, status: newStatus };
      updateJob(updatedJob);
      setSelectedJob(updatedJob);
  };

  const getJobCandidates = (jobId: string) => candidates.filter(c => c.jobId === jobId);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: JobStatus) => {
      switch (status) {
          case JobStatus.OPEN: return 'bg-green-100 text-green-700';
          case JobStatus.DRAFT: return 'bg-amber-100 text-amber-700';
          case JobStatus.CLOSED: return 'bg-slate-100 text-slate-600';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Recruitment</h1>
            <p className="text-slate-500">Manage your positions and AI-powered vetting workflows.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => {
                    setGeneratedAd('');
                    setAdForm({title: '', department: '', description: ''});
                    setShowAdModal(true);
                }}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
                <Megaphone className="w-5 h-5 mr-2" />
                Generate Ad Copy
            </button>
            <button 
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center">
        <Search className="w-5 h-5 text-slate-400 mr-3" />
        <input 
            type="text" 
            placeholder="Search jobs by title or department..." 
            className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                No jobs found. Create your first position to start recruiting.
            </div>
        ) : (
            filteredJobs.map(job => (
                <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-blue-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location}</span>
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {job.type}</span>
                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1"/> {job.salaryRange || 'Competitive'}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Posted {job.postedDate}</span>
                            <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {getJobCandidates(job.id).length} Candidates</span>
                            {job.viewers && job.viewers.length > 0 && (
                              <span className="flex items-center text-blue-500 font-medium"><Eye className="w-4 h-4 mr-1"/> {job.viewers.length} Views</span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                         <span className="font-medium text-sm mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">View Details</span>
                         <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-full max-w-4xl bg-white h-full shadow-2xl p-0 flex flex-col animate-slide-in-right overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedJob.status)}`}>
                                {selectedJob.status}
                            </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-2">
                            <Briefcase className="w-4 h-4"/> {selectedJob.department} &bull; {selectedJob.type}
                        </p>
                    </div>
                    <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Total Candidates</p>
                            <p className="text-2xl font-bold text-blue-900">{getJobCandidates(selectedJob.id).length}</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Total Views</p>
                            <p className="text-2xl font-bold text-indigo-900">{selectedJob.viewers?.length || 0}</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Salary Range</p>
                            <p className="text-lg font-semibold text-slate-800">{selectedJob.salaryRange || 'Not specified'}</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Location</p>
                            <p className="text-lg font-semibold text-slate-800">{selectedJob.location}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Description</h3>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                                    {selectedJob.description}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Requirements</h3>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    {selectedJob.requirements}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* New: Recent Views Section */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        Recent Views
                                    </h4>
                                    <div className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Live</span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {selectedJob.viewers && selectedJob.viewers.length > 0 ? (
                                        selectedJob.viewers.map((viewer, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                                                    {viewer.name === 'Anonymous' ? '?' : viewer.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{viewer.name}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{viewer.location}</p>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium">
                                                    {formatRelativeTime(viewer.viewedAt)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400">
                                            <Eye className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No recent views recorded.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 shadow-lg text-white">
                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Headhunter Assistant
                                </h4>
                                <p className="text-indigo-100 text-xs mb-4">
                                    Generate advanced Boolean search strings to find passive candidates on LinkedIn and Google.
                                </p>
                                <button 
                                    onClick={() => {
                                        setShowSourcingModal(true);
                                        setSourcingStrategy(null);
                                    }}
                                    className="w-full bg-white text-indigo-700 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Source Candidates
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Wand2 className="w-4 h-4 text-purple-500" />
                                    Interview Process
                                </h4>
                                <div className="space-y-4">
                                    {selectedJob.interviewProcess?.map((step, index) => (
                                        <div key={index} className="flex gap-3 relative">
                                            {index !== (selectedJob.interviewProcess?.length || 0) - 1 && (
                                                <div className="absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-slate-100"></div>
                                            )}
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm z-10">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium pt-0.5">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <button 
                        onClick={() => handleDeleteJob(selectedJob.id)}
                        className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Job
                    </button>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => handleToggleStatus(selectedJob)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 font-medium"
                        >
                            <Archive className="w-4 h-4" />
                            {selectedJob.status === JobStatus.OPEN ? 'Close Job' : selectedJob.status === JobStatus.DRAFT ? 'Publish Job' : 'Reopen Job'}
                        </button>
                        <button 
                            onClick={() => setSelectedJob(null)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* Sourcing Strategy Modal */}
      {showSourcingModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold flex items-center gap-2">
                              <Globe className="w-5 h-5 text-blue-400" />
                              Active Sourcing Strategy
                          </h2>
                          <p className="text-slate-400 text-sm mt-1">AI-generated Boolean strings to find passive candidates.</p>
                      </div>
                      <button onClick={() => setShowSourcingModal(false)} className="text-slate-400 hover:text-white">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1">
                      {!sourcingStrategy ? (
                           <div className="text-center py-12">
                               {loadingSourcing ? (
                                   <div className="flex flex-col items-center">
                                       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                       <h3 className="text-lg font-bold text-slate-800">Analyzing Job Requirements...</h3>
                                       <p className="text-slate-500">Constructing complex Boolean logic for LinkedIn & Google.</p>
                                   </div>
                               ) : (
                                   <div className="flex flex-col items-center">
                                       <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                           <Sparkles className="w-8 h-8 text-indigo-600" />
                                       </div>
                                       <h3 className="text-lg font-bold text-slate-800 mb-2">Ready to Source?</h3>
                                       <p className="text-slate-500 max-w-md mb-6">
                                           We will generate optimized search strings to help you find candidates who haven't applied yet.
                                       </p>
                                       <button 
                                            onClick={handleGenerateSourcing}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                        >
                                           Generate Strategy
                                       </button>
                                   </div>
                               )}
                           </div>
                      ) : (
                          <div className="space-y-8 animate-fade-in-up">
                              <div>
                                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                      <div className="w-6 h-6 bg-[#0077b5] text-white rounded flex items-center justify-center text-xs font-bold">in</div>
                                      LinkedIn Recruiter String
                                  </h3>
                                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-700 break-words relative group">
                                      {sourcingStrategy.linkedin}
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(sourcingStrategy.linkedin)}
                                        className="absolute top-2 right-2 bg-white border border-slate-200 p-1.5 rounded-md text-slate-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <Copy className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                      <Search className="w-5 h-5 text-red-500" />
                                      Google X-Ray (Free LinkedIn Search)
                                  </h3>
                                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-700 break-words relative group">
                                      {sourcingStrategy.googleXray}
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(sourcingStrategy.googleXray)}
                                        className="absolute top-2 right-2 bg-white border border-slate-200 p-1.5 rounded-md text-slate-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <Copy className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                                  <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                                      <Megaphone className="w-4 h-4" />
                                      Sourcing Tips & Keywords
                                  </h4>
                                  <ul className="space-y-2">
                                      {sourcingStrategy.tips.map((tip, i) => (
                                          <li key={i} className="text-sm text-yellow-800/80 flex items-start gap-2">
                                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                              {tip}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Post New Position</h2>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Manual Entry & AI Assisted</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleCreateJob} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title *</label>
                            <input 
                                required
                                type="text" 
                                placeholder="e.g. Lead Frontend Engineer"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                value={newJob.title}
                                onChange={e => setNewJob({...newJob, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Engineering"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                value={newJob.department}
                                onChange={e => setNewJob({...newJob, department: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location *</label>
                            <input 
                                required
                                type="text" 
                                placeholder="e.g. Remote / Sydney"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                value={newJob.location}
                                onChange={e => setNewJob({...newJob, location: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Type</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-white"
                                value={newJob.type}
                                onChange={e => setNewJob({...newJob, type: e.target.value})}
                            >
                                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Salary Range (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. $140k - $180k"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                            value={newJob.salaryRange}
                            onChange={e => setNewJob({...newJob, salaryRange: e.target.value})}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Description *</label>
                            <button 
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={generatingDesc || !newJob.title}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold disabled:opacity-50 transition-colors"
                            >
                                {generatingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                {generatingDesc ? 'Writing Description...' : 'Auto-Write with AI'}
                            </button>
                        </div>
                        <textarea 
                            required
                            rows={6}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                            value={newJob.description}
                            onChange={e => setNewJob({...newJob, description: e.target.value})}
                            placeholder="Detail the role, culture, and team structure..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Requirements</label>
                        <textarea 
                            rows={3}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                            value={newJob.requirements}
                            onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                            placeholder="Core skills, years of experience, specific tech stack..."
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                        <Wand2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Workflow Intelligence</h4>
                            <p className="text-xs text-blue-700 mt-1">Our AI will automatically generate a tailored 5-7 step vetting process and interview guide based on these details when you publish.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => setShowModal(false)}
                            className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSaveDraft}
                            disabled={loadingAI}
                            className="px-6 py-2.5 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            <FileEdit className="w-4 h-4" />
                            Save as Draft
                        </button>
                        <button 
                            type="submit"
                            disabled={loadingAI}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center font-bold"
                        >
                            {loadingAI ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {loadingAI ? 'Publishing...' : 'Publish Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Generate Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">AI Ad Copy Generator</h2>
                        <p className="text-sm text-purple-700">Create engaging social media posts for your roles.</p>
                    </div>
                    <button onClick={() => setShowAdModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Load From Existing Job (Optional)</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                            onChange={(e) => handleLoadJobForAd(e.target.value)}
                            defaultValue=""
                        >
                            <option value="">-- Select a Job to Auto-fill --</option>
                            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                            <input 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={adForm.title}
                                onChange={e => setAdForm({...adForm, title: e.target.value})}
                                placeholder="e.g. Senior Product Designer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                            <input 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={adForm.department}
                                onChange={e => setAdForm({...adForm, department: e.target.value})}
                                placeholder="e.g. Design"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Key Details / Description</label>
                        <textarea 
                            rows={4}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            value={adForm.description}
                            onChange={e => setAdForm({...adForm, description: e.target.value})}
                            placeholder="Paste the job description or key points here..."
                        />
                    </div>

                    <button 
                        onClick={handleGenerateAd}
                        disabled={generatingAd || !adForm.title}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                    >
                        {generatingAd ? <Loader2 className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5" />}
                        {generatingAd ? 'Writing Magic...' : 'Generate Compelling Ad Copy'}
                    </button>

                    {generatedAd && (
                        <div className="mt-6 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700">Generated Ad Copy</label>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(generatedAd)}
                                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    <Copy className="w-3 h-3" />
                                    Copy to Clipboard
                                </button>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
                                {generatedAd}
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;