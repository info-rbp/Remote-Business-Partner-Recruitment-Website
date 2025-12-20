
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Candidate, CandidateStatus, Job } from '../types';
import { useNavigate } from 'react-router-dom';
import { reviewCandidateApplication, generateScreeningQuestions, generateStatusEmail, generateCandidateEmail, generateReferralEmail } from '../services/geminiService';
import { MoreHorizontal, FileText, BrainCircuit, Star, X, Check, Loader2, MessageSquare, ChevronDown, ChevronUp, Mail, Sparkles, Zap, Calendar, CheckCircle2, Send, Share2, ExternalLink, AlertCircle } from 'lucide-react';

const Candidates: React.FC = () => {
  const { candidates, jobs, updateCandidate, addCandidate, isGmailConnected } = useAppStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const navigate = useNavigate();

  // Loading States
  const [processingEmailId, setProcessingEmailId] = useState<string | null>(null);

  // Referral Modal State
  const [showReferModal, setShowReferModal] = useState(false);
  const [referralJobId, setReferralJobId] = useState('');

  // Email Template State
  const [emailDraft, setEmailDraft] = useState<{subject: string, body: string} | null>(null);
  const [generatingEmail, setGeneratingEmail] = useState<string | null>(null);

  // Add Candidate Form
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
      name: '', email: '', phone: '', jobId: jobs[0]?.id || '', resumeText: ''
  });

  const getJobTitle = (jobId: string) => {
      if (jobId === 'general') return 'General Talent Pool';
      return jobs.find(j => j.id === jobId)?.title || 'Unknown Job';
  };
  
  const getJob = (jobId: string) => {
      if (jobId === 'general') {
          // Return a dummy job for AI context if it's a general application
          return {
              id: 'general',
              title: 'General Application',
              description: 'General application for any suitable role.',
              requirements: 'General skills and experience.',
              department: 'General',
              location: 'Remote',
              type: 'Any',
              status: 'Open',
              postedDate: new Date().toISOString()
          } as unknown as Job;
      }
      return jobs.find(j => j.id === jobId);
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'info') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusChange = async (candidate: Candidate, newStatus: CandidateStatus) => {
    // Optimistic update
    updateCandidate({ ...candidate, status: newStatus });
    if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }

    // Email Notification Logic
    if (isGmailConnected) {
        const job = getJob(candidate.jobId);
        if (job) {
            setProcessingEmailId(candidate.id);
            showNotification(`AI is drafting ${newStatus} email...`, 'info');
            try {
                // AI generates email content
                const emailContent = await generateStatusEmail(job, candidate, newStatus);
                console.log("Sending Email:", emailContent);
                
                // Simulate sending email via Gmail API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showNotification(`Email sent to ${candidate.email}`, 'success');
            } catch (error) {
                console.error("Failed to send email", error);
                showNotification("Failed to send status email.", 'info');
            } finally {
                setProcessingEmailId(null);
            }
        }
    }
  };

  const handleAiReview = async (candidate: Candidate) => {
    const job = getJob(candidate.jobId);
    if (!job) return;

    setIsReviewing(true);
    try {
      const review = await reviewCandidateApplication(job, candidate);
      updateCandidate({ ...candidate, aiReview: review });
      setSelectedCandidate({ ...candidate, aiReview: review }); // update local view
    } catch (error) {
      console.error("AI Review failed", error);
      alert("AI Review failed. Check console or API Key.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleGenerateQuestions = async (candidate: Candidate) => {
    const job = getJob(candidate.jobId);
    if(!job) return;
    setLoadingQuestions(true);
    try {
        const qs = await generateScreeningQuestions(job, candidate);
        setGeneratedQuestions(qs);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingQuestions(false);
    }
  }

  const handleGenerateEmail = async (type: 'interview' | 'rejection' | 'offer') => {
      const job = getJob(selectedCandidate?.jobId || '');
      if (!job || !selectedCandidate) return;

      setGeneratingEmail(type);
      try {
          const draft = await generateCandidateEmail(job, selectedCandidate, type);
          setEmailDraft(draft);
      } catch (error) {
          console.error(error);
          showNotification("Failed to generate email template", 'info');
      } finally {
          setGeneratingEmail(null);
      }
  };

  const handleReferralDraft = async () => {
    const currentJob = getJob(selectedCandidate?.jobId || '');
    const targetJob = jobs.find(j => j.id === referralJobId);

    if (!currentJob || !targetJob || !selectedCandidate) return;

    // Do NOT close modal yet, we want to show the draft in the modal
    setGeneratingEmail('referral');

    try {
        const draft = await generateReferralEmail(selectedCandidate, targetJob, currentJob);
        setEmailDraft(draft);
    } catch (error) {
        console.error(error);
        showNotification("Failed to generate referral email", 'info');
    } finally {
        setGeneratingEmail(null);
    }
  };

  const handleSendReferralEmail = () => {
      showNotification(`Referral email sent successfully to ${selectedCandidate?.name}`, 'success');
      setEmailDraft(null);
      setShowReferModal(false);
      setReferralJobId('');
  }

  const handleCloseReferralModal = () => {
      setShowReferModal(false);
      setEmailDraft(null);
      setReferralJobId('');
  }

  const handleAddCandidate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCandidate.name || !newCandidate.jobId) return;

      addCandidate({
          id: Date.now().toString(),
          name: newCandidate.name!,
          email: newCandidate.email!,
          phone: newCandidate.phone || '',
          jobId: newCandidate.jobId!,
          status: CandidateStatus.APPLIED,
          appliedDate: new Date().toISOString().split('T')[0],
          resumeText: newCandidate.resumeText || '',
      });
      setShowAddModal(false);
      setNewCandidate({ name: '', email: '', phone: '', jobId: jobs[0]?.id || '', resumeText: '' });
  };

  const columns = [
    CandidateStatus.APPLIED,
    CandidateStatus.SCREENING,
    CandidateStatus.INTERVIEW,
    CandidateStatus.OFFER,
    CandidateStatus.HIRED,
  ];

  return (
    <div className="h-full flex flex-col relative">
       {/* Notification Toast */}
       {notification && (
           <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-lg border flex items-center gap-2 transition-all animate-fade-in-down ${notification.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-slate-800 text-white border-slate-700'}`}>
               {notification.type === 'success' ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
               <span className="text-sm font-medium">{notification.message}</span>
           </div>
       )}

       <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
            <p className="text-slate-500 flex items-center gap-2">
                Drag and drop candidates to move them through the pipeline.
                {isGmailConnected && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center"><Mail className="w-3 h-3 mr-1"/> Auto-Email Active</span>}
            </p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FileText className="w-5 h-5 mr-2" />
          Add Candidate
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-max">
          {columns.map(status => (
            <div key={status} className="w-80 flex flex-col bg-slate-100 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-4 px-2 pt-2">
                <h3 className="font-semibold text-slate-700">{status}</h3>
                <span className="bg-white text-slate-500 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                  {candidates.filter(c => c.status === status).length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {candidates.filter(c => c.status === status).map(candidate => (
                  <div 
                    key={candidate.id}
                    onClick={() => {
                        setSelectedCandidate(candidate);
                        setGeneratedQuestions([]);
                        setEmailDraft(null);
                    }}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-blue-200 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{candidate.name}</h4>
                      <div className="flex items-center gap-2">
                          {processingEmailId === candidate.id && (
                             <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide animate-pulse border border-blue-100">
                                 <Loader2 className="w-3 h-3 animate-spin" />
                                 Drafting
                             </div>
                          )}
                          {candidate.aiReview && (
                            <div className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center ${candidate.aiReview.score >= 80 ? 'bg-green-100 text-green-700' : candidate.aiReview.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {candidate.aiReview.score}%
                            </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 truncate">{getJobTitle(candidate.jobId)}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-50">
                        <span>{candidate.appliedDate}</span>
                        {status !== CandidateStatus.HIRED && status !== CandidateStatus.OFFER && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const nextStatus = columns[columns.indexOf(status) + 1];
                                    if(nextStatus) handleStatusChange(candidate, nextStatus);
                                }}
                                className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Move &rarr;
                            </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-0 flex flex-col animate-slide-in-right relative">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedCandidate.name}</h2>
                    <div className="flex items-center gap-2 text-slate-500">
                        <p>{getJobTitle(selectedCandidate.jobId)}</p>
                        {selectedCandidate.jobId !== 'general' && (
                            <button 
                                onClick={() => {
                                    const job = jobs.find(j => j.id === selectedCandidate.jobId);
                                    if (job) navigate(`/platform/jobs?q=${encodeURIComponent(job.title)}`);
                                }} 
                                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                                title="View Job Details"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-500" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Actions */}
                <div className="flex gap-3">
                     <button 
                        onClick={() => handleGenerateQuestions(selectedCandidate)}
                        disabled={loadingQuestions}
                        className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                         {loadingQuestions ? <Loader2 className="animate-spin w-5 h-5"/> : <MessageSquare className="w-5 h-5" />}
                         Generate Interview Guide
                     </button>
                     <button 
                        onClick={() => {
                            setEmailDraft(null); // Clear any old draft
                            setShowReferModal(true);
                        }}
                        className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                         <Share2 className="w-5 h-5" />
                         Refer to another Job
                     </button>
                </div>

                {/* AI Analysis Section */}
                <div>
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-600" />
                            AI Suitability Analysis
                        </h4>
                    </div>

                    {!selectedCandidate.aiReview ? (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h5 className="font-medium text-slate-900 mb-1">No Analysis Available</h5>
                            <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto">Run our AI engine to analyze this candidate's fit against the job requirements, identifying strengths and gaps.</p>
                            <button 
                                onClick={() => handleAiReview(selectedCandidate)}
                                disabled={isReviewing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                            >
                                {isReviewing ? <Loader2 className="animate-spin w-4 h-4"/> : <Zap className="w-4 h-4" />}
                                {isReviewing ? 'Analyzing...' : 'Generate AI Report'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <BrainCircuit className="w-32 h-32 text-indigo-900" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 ${selectedCandidate.aiReview.score >= 80 ? 'border-green-500 bg-green-50 text-green-700' : selectedCandidate.aiReview.score >= 60 ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-red-500 bg-red-50 text-red-700'}`}>
                                        <span className="text-xl font-bold">{selectedCandidate.aiReview.score}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-indigo-900 font-bold text-lg">AI Match Analysis</h4>
                                        <p className="text-sm text-indigo-600/80">Based on job requirements</p>
                                    </div>
                                </div>
                                
                                <div className="mb-6 bg-white/60 p-4 rounded-lg border border-indigo-50">
                                    <p className="text-slate-700 italic text-sm leading-relaxed">
                                        "{selectedCandidate.aiReview.summary}"
                                    </p>
                                </div>

                                {selectedCandidate.aiReview.matchAnalysis && (
                                    <div className="mb-6">
                                        <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Detailed Analysis</h5>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            {selectedCandidate.aiReview.matchAnalysis}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="font-semibold text-green-700 mb-3 flex items-center text-sm uppercase tracking-wide">
                                            <div className="p-1 bg-green-100 rounded mr-2"><Check className="w-3 h-3"/></div>
                                            Strengths
                                        </h5>
                                        <ul className="space-y-2">
                                            {selectedCandidate.aiReview.pros.map((pro, i) => (
                                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-red-700 mb-3 flex items-center text-sm uppercase tracking-wide">
                                            <div className="p-1 bg-red-100 rounded mr-2"><X className="w-3 h-3"/></div>
                                            Gaps / Risks
                                        </h5>
                                        <ul className="space-y-2">
                                            {selectedCandidate.aiReview.cons.map((con, i) => (
                                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Communication Assistant */}
                <div>
                    <h4 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        Communication Assistant
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button 
                                onClick={() => handleGenerateEmail('interview')}
                                disabled={!!generatingEmail}
                                className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4"/>
                                Interview Invite
                            </button>
                             <button 
                                onClick={() => handleGenerateEmail('offer')}
                                disabled={!!generatingEmail}
                                className="px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4"/>
                                Offer Letter
                            </button>
                            <button 
                                onClick={() => handleGenerateEmail('rejection')}
                                disabled={!!generatingEmail}
                                className="px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4"/>
                                Rejection
                            </button>
                        </div>

                        {generatingEmail && generatingEmail !== 'referral' ? (
                            <div className="py-12 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-20"></div>
                                    <div className="relative bg-white p-4 rounded-full shadow-sm border border-blue-100">
                                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                                    </div>
                                </div>
                                <h5 className="text-slate-900 font-semibold mb-1">AI is crafting your message</h5>
                                <p className="text-slate-500 text-sm max-w-xs">Analyzing candidate profile, job context, and tone settings...</p>
                            </div>
                        ) : emailDraft ? (
                            <div className="animate-fade-in-up">
                                <div className="mb-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={emailDraft.subject}
                                        onChange={e => setEmailDraft({...emailDraft, subject: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                     <label className="text-xs font-bold text-slate-500 uppercase">Message Body</label>
                                    <textarea 
                                        rows={8}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 resize-none whitespace-pre-line"
                                        value={emailDraft.body}
                                        onChange={e => setEmailDraft({...emailDraft, body: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                     <button 
                                        onClick={() => setEmailDraft(null)}
                                        className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        onClick={() => {
                                            showNotification("Email sent successfully", 'success');
                                            setEmailDraft(null);
                                        }}
                                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Email
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                Select a template above to generate a draft
                            </div>
                        )}
                    </div>
                </div>

                {/* Generated Questions */}
                {generatedQuestions.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            Suggested Interview Questions
                        </h4>
                        <ul className="space-y-3">
                            {generatedQuestions.map((q, i) => (
                                <li key={i} className="flex gap-3 text-slate-700">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{i+1}</span>
                                    <span>{q}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Resume / Profile */}
                <div>
                    <h4 className="font-bold text-slate-800 mb-3 text-lg">Application Details</h4>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Email</label>
                                <p className="text-slate-800">{selectedCandidate.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Phone</label>
                                <p className="text-slate-800">{selectedCandidate.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Applied On</label>
                                <p className="text-slate-800">{selectedCandidate.appliedDate}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Status</label>
                                <p className="text-slate-800">{selectedCandidate.status}</p>
                            </div>
                         </div>
                         <div>
                             <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Resume / Cover Letter</label>
                             <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                                {selectedCandidate.resumeText}
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Actions */}
             <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between">
                <button 
                    onClick={() => handleStatusChange(selectedCandidate, CandidateStatus.REJECTED)}
                    className="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    Reject Candidate
                </button>
                <button 
                    onClick={() => {
                        handleStatusChange(selectedCandidate, CandidateStatus.OFFER);
                        setSelectedCandidate(prev => prev ? {...prev, status: CandidateStatus.OFFER} : null);
                    }}
                    className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    Move to Offer
                </button>
             </div>
            
            {/* Job Referral Modal */}
            {showReferModal && (
                <div className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center p-6 animate-fade-in-up">
                    <div className="w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-xl p-6 flex flex-col max-h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">
                                {emailDraft ? 'Confirm Referral' : 'Refer to another Job'}
                            </h3>
                            <button onClick={handleCloseReferralModal}><X className="w-5 h-5 text-slate-400"/></button>
                        </div>
                        
                        {generatingEmail === 'referral' ? (
                             <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                                 <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative bg-white p-3 rounded-full border border-blue-50 shadow-sm">
                                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                                    </div>
                                 </div>
                                 <h4 className="text-slate-900 font-semibold mb-1">Generating Referral</h4>
                                 <p className="text-slate-500 font-medium text-sm">Personalizing approach for {selectedCandidate.name}...</p>
                             </div>
                        ) : emailDraft ? (
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold mb-1">Review Draft</p>
                                        <p>Please review the generated email before sending. This will be sent to <strong>{selectedCandidate.email}</strong>.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                        <input 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailDraft.subject}
                                            onChange={e => setEmailDraft({...emailDraft, subject: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                                        <textarea 
                                            rows={8}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 resize-none whitespace-pre-line"
                                            value={emailDraft.body}
                                            onChange={e => setEmailDraft({...emailDraft, body: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={() => setEmailDraft(null)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleSendReferralEmail}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Confirm & Send
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-slate-500 mb-6">Select a job opening to refer <strong>{selectedCandidate.name}</strong> to. We will draft an email for you.</p>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Target Position</label>
                                    <select 
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        value={referralJobId}
                                        onChange={e => setReferralJobId(e.target.value)}
                                    >
                                        <option value="">Select a job...</option>
                                        {jobs.filter(j => j.id !== selectedCandidate.jobId).map(j => (
                                            <option key={j.id} value={j.id}>{j.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 mt-auto">
                                    <button 
                                        onClick={handleCloseReferralModal}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleReferralDraft}
                                        disabled={!referralJobId}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Draft Referral Email
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Add Candidate</h2>
                    <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={handleAddCandidate} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={newCandidate.name} onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input required type="email" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={newCandidate.email} onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={newCandidate.phone} onChange={e => setNewCandidate({...newCandidate, phone: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Applying For</label>
                        <select className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={newCandidate.jobId} onChange={e => setNewCandidate({...newCandidate, jobId: e.target.value})}>
                            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Resume Text (Paste)</label>
                        <textarea required rows={5} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Paste candidate resume content here for AI analysis..." value={newCandidate.resumeText} onChange={e => setNewCandidate({...newCandidate, resumeText: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">Add Candidate</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default Candidates;
