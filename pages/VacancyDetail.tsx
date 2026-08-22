import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle2, Clock, DollarSign, MapPin } from 'lucide-react';
import { useAppStore } from '../store';
import { CandidateStatus, JobStatus } from '../types';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const VacancyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, addCandidate } = useAppStore();
  const job = jobs.find(item => item.id === id && item.status === JobStatus.OPEN);
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', coverNote: '', resumeText: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!job) return <Navigate to="/vacancies" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await addCandidate({
      id: Date.now().toString(),
      jobId: job.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: CandidateStatus.APPLIED,
      appliedDate: new Date().toISOString().split('T')[0],
      resumeText: [form.resumeText, form.coverNote, form.linkedin ? `LinkedIn: ${form.linkedin}` : ''].filter(Boolean).join('\n\n')
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNav />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/vacancies" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Back to vacancies</Link>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Briefcase className="h-7 w-7" /></div>
            <h1 className="text-4xl font-extrabold tracking-tight">{job.title}</h1>
            <p className="mt-2 text-lg font-medium text-slate-500">{job.department}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><MapPin className="h-4 w-4" />{job.location}</span>
              <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><Clock className="h-4 w-4" />{job.type}</span>
              <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><DollarSign className="h-4 w-4" />{job.salaryRange || 'Salary by negotiation'}</span>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">About the opportunity</h2>
              <div className="mt-4 whitespace-pre-line leading-7 text-slate-600">{job.description}</div>
            </section>

            {job.requirements && (
              <section className="mt-10 border-t border-slate-100 pt-8">
                <h2 className="text-2xl font-bold">What we are looking for</h2>
                <div className="mt-4 whitespace-pre-line leading-7 text-slate-600">{job.requirements}</div>
              </section>
            )}

            <section className="mt-10 border-t border-slate-100 pt-8">
              <h2 className="text-2xl font-bold">What happens next</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {['We review your application', 'We contact suitable candidates', 'We coordinate the employer interview process'].map(item => (
                  <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-blue-600" />{item}</div>
                ))}
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h2 className="mt-4 text-2xl font-bold">Application received</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Thank you for applying. Our recruitment team will review your application and contact you if your experience aligns with the role.</p>
                <Link to="/vacancies" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">View other vacancies</Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Apply for this role</h2>
                <p className="mt-2 text-sm text-slate-500">Submit your details directly to the RBP recruitment team.</p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <input required placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <input required type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <input type="tel" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <input type="url" placeholder="LinkedIn URL (optional)" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <textarea required rows={6} placeholder="Resume / experience summary *" value={form.resumeText} onChange={e => setForm({ ...form, resumeText: e.target.value })} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <textarea rows={4} placeholder="Cover note (optional)" value={form.coverNote} onChange={e => setForm({ ...form, coverNote: e.target.value })} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" />
                  <button disabled={submitting} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit application'}</button>
                </form>
              </>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VacancyDetail;
