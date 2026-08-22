import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CheckCircle2, Search, Users } from 'lucide-react';
import { useAppStore } from '../store';
import { JobStatus } from '../types';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const Website: React.FC = () => {
  const { jobs } = useAppStore();
  const featuredJobs = jobs.filter(job => job.status === JobStatus.OPEN).slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNav />

      <header className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.28),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_28%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Remote Business Partner Recruitment</p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">Recruitment made straightforward</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">We help employers recruit the people they need and help candidates access genuine opportunities through a clear, human-led recruitment process.</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/vacancies" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500"><Search className="h-5 w-5" /> View Current Vacancies</Link>
            <Link to="/for-employers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-slate-900 hover:bg-slate-100"><Briefcase className="h-5 w-5" /> Recruit Staff</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Users className="h-6 w-6" /></div>
              <h2 className="mt-6 text-3xl font-bold">Looking for your next role?</h2>
              <p className="mt-4 leading-7 text-slate-600">Browse the positions we are currently recruiting for, learn more about how we work with candidates and apply directly online.</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link to="/vacancies" className="inline-flex items-center gap-2 font-bold text-blue-600">Current Vacancies <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/for-candidates" className="inline-flex items-center gap-2 font-bold text-slate-700">For Candidates <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Briefcase className="h-6 w-6" /></div>
              <h2 className="mt-6 text-3xl font-bold">Looking for staff?</h2>
              <p className="mt-4 leading-7 text-slate-600">Work with RBP through a straightforward fixed-fee recruitment model, from <strong>$750 + GST</strong> for casual and part-time employees and <strong>$1,500 + GST</strong> for full-time employees.</p>
              <Link to="/for-employers" className="mt-7 inline-flex items-center gap-2 font-bold text-blue-700">For Employers <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Current Vacancies</p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Roles we are recruiting for now</h2>
              </div>
              <Link to="/vacancies" className="inline-flex items-center gap-2 font-bold text-blue-600">View all vacancies <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {featuredJobs.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featuredJobs.map(job => (
                  <Link key={job.id} to={`/vacancies/${job.id}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{job.type}</p>
                    <h3 className="mt-3 text-xl font-bold group-hover:text-blue-600">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{job.location} · {job.department}</p>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-bold text-blue-600">View role <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">There are no published vacancies at the moment. New opportunities will appear here as they are opened.</div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">How we work</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Human-led recruitment with a clear process</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">RBP focuses on understanding the role, reviewing the people behind the applications and keeping employers and candidates informed throughout the process.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {['Understand the role', 'Review candidates properly', 'Coordinate the appointment'].map(item => (
                <div key={item} className="rounded-2xl border border-slate-200 p-6"><CheckCircle2 className="h-6 w-6 text-emerald-500" /><p className="mt-4 font-bold">{item}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-blue-600 px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Need help filling a role?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100">See our fixed-fee recruitment approach, what is included and how to appoint Remote Business Partner.</p>
            <Link to="/for-employers" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700">View Employer Recruitment <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Website;
