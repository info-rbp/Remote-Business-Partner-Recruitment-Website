import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Search, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';
import { JobStatus } from '../types';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const CurrentVacancies: React.FC = () => {
  const { jobs } = useAppStore();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const openJobs = useMemo(() => jobs.filter(job => job.status === JobStatus.OPEN), [jobs]);
  const locations = Array.from(new Set(openJobs.map(job => job.location))).sort();
  const types = Array.from(new Set(openJobs.map(job => job.type))).sort();

  const filteredJobs = openJobs.filter(job => {
    const haystack = `${job.title} ${job.department} ${job.location}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (!location || job.location === location) && (!type || job.type === type);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNav />
      <header className="bg-blue-600 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Current Vacancies</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">Explore the roles Remote Business Partner is currently recruiting for and apply directly online.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search roles" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" />
          </div>
          <select value={location} onChange={e => setLocation(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500">
            <option value="">All locations</option>
            {locations.map(item => <option key={item}>{item}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500">
            <option value="">All employment types</option>
            {types.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Open roles</p>
            <h2 className="mt-1 text-2xl font-bold">Opportunities currently available</h2>
          </div>
          <span className="text-sm text-slate-500">{filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}</span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-xl font-bold">No matching vacancies</h3>
            <p className="mt-2 text-slate-500">Adjust your search, or visit For Candidates to join our candidate network.</p>
            <Link to="/for-candidates" className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-bold text-white">For Candidates</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(job => (
              <Link key={job.id} to={`/vacancies/${job.id}`} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Briefcase className="h-6 w-6" /></div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Open</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">{job.title}</h3>
                <p className="mt-2 text-sm font-medium text-slate-500">{job.department}</p>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{job.type}</p>
                  <p className="flex items-center gap-2"><DollarSign className="h-4 w-4" />{job.salaryRange || 'Salary by negotiation'}</p>
                </div>
                <p className="mt-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{job.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 font-bold text-blue-600">
                  <span>View role</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CurrentVacancies;
