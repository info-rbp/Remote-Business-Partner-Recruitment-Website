
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { CandidateStatus, Candidate, Job } from '../types';
import { CheckCircle2, Mail, Calendar, FileText, Sparkles, Loader2, ArrowRight, Download, Printer } from 'lucide-react';
import { generateOnboardingPlan } from '../services/geminiService';

const Onboarding: React.FC = () => {
    const { candidates, jobs, updateCandidate } = useAppStore();
    const [generating, setGenerating] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<{candidate: Candidate, job: Job} | null>(null);

    const hired = candidates.filter(c => c.status === CandidateStatus.HIRED || c.status === CandidateStatus.OFFER);

    const handleGeneratePlan = async (candidate: Candidate, job: Job) => {
        setGenerating(candidate.id);
        try {
            const plan = await generateOnboardingPlan(job, candidate.name);
            updateCandidate({ ...candidate, onboardingPlan: plan });
            // Automatically open the plan view
            setSelectedPlan({ candidate: { ...candidate, onboardingPlan: plan }, job });
        } catch (error) {
            console.error(error);
            alert("Failed to generate plan");
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="relative min-h-full">
             <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Onboarding & Success</h1>
                    <p className="text-slate-500">Manage pending offers and generate success roadmaps for new hires.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {hired.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                             <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800">No placements yet</h3>
                        <p className="text-slate-500">Move candidates to "Offer" or "Hired" to unlock onboarding tools.</p>
                    </div>
                ) : (
                    hired.map(candidate => {
                         const job = jobs.find(j => j.id === candidate.jobId);
                         if (!job) return null;
                         
                         return (
                            <div key={candidate.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-bold text-xl shadow-inner border border-white">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${candidate.status === CandidateStatus.HIRED ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {candidate.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 font-medium">{job.title}</p>
                                            <p className="text-xs text-slate-400 mt-1">Start Date: TBD</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {candidate.onboardingPlan ? (
                                            <button 
                                                onClick={() => setSelectedPlan({ candidate, job })}
                                                className="px-5 py-2.5 bg-white border-2 border-green-100 text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <FileText className="w-4 h-4" />
                                                View 30-60-90 Plan
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleGeneratePlan(candidate, job)}
                                                disabled={generating === candidate.id}
                                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                                            >
                                                {generating === candidate.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />}
                                                {generating === candidate.id ? 'Designing Roadmap...' : 'Generate Success Plan'}
                                            </button>
                                        )}
                                        
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm text-slate-500 border border-slate-200">
                                            <Mail className="w-4 h-4" />
                                            <span>Docs Sent</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status Steps */}
                                <div className="mt-8 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                                    <div className="relative z-10 flex justify-between">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white shadow-sm"><CheckCircle2 className="w-4 h-4" /></div>
                                            <span className="text-xs font-semibold text-slate-600">Offer Signed</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white shadow-sm"><CheckCircle2 className="w-4 h-4" /></div>
                                            <span className="text-xs font-semibold text-slate-600">Background Check</span>
                                        </div>
                                         <div className="flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${candidate.onboardingPlan ? 'bg-green-500 text-white' : 'bg-white border-indigo-200 text-indigo-600'}`}>
                                                {candidate.onboardingPlan ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-xs font-semibold ${candidate.onboardingPlan ? 'text-slate-600' : 'text-indigo-600'}`}>Success Plan</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center border-4 border-white"><Calendar className="w-4 h-4" /></div>
                                            <span className="text-xs font-semibold text-slate-400">Day 1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         )
                    })
                )}
            </div>

            {/* Plan Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-3xl bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Success Roadmap</h2>
                                <p className="text-sm text-slate-500">30-60-90 Day Plan for {selectedPlan.candidate.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"><Printer className="w-5 h-5"/></button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"><Download className="w-5 h-5"/></button>
                                <button 
                                    onClick={() => setSelectedPlan(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors ml-2"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
                                        R
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">New Hire Onboarding Plan</h1>
                                        <p className="text-slate-500 font-medium">Remote Business Partner &bull; {selectedPlan.job.title}</p>
                                    </div>
                                </div>
                                
                                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-indigo-700 prose-li:text-slate-600 prose-p:text-slate-600">
                                    <div className="whitespace-pre-wrap">
                                        {selectedPlan.candidate.onboardingPlan}
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                                    <p>Generated by RBP Intelligence Engine</p>
                                    <p>Confidential Document</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Onboarding;
