import React from 'react';
import { useAppStore } from '../store';
import { JobStatus, CandidateStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, UserCheck } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { jobs, candidates } = useAppStore();

  const activeJobs = jobs.filter(j => j.status === JobStatus.OPEN).length;
  const totalCandidates = candidates.length;
  const hiredCandidates = candidates.filter(c => c.status === CandidateStatus.HIRED).length;
  const pendingReviews = candidates.filter(c => c.status === CandidateStatus.APPLIED).length;

  const data = [
    { name: 'Applied', value: candidates.filter(c => c.status === CandidateStatus.APPLIED).length },
    { name: 'Screening', value: candidates.filter(c => c.status === CandidateStatus.SCREENING).length },
    { name: 'Interview', value: candidates.filter(c => c.status === CandidateStatus.INTERVIEW).length },
    { name: 'Offer', value: candidates.filter(c => c.status === CandidateStatus.OFFER).length },
    { name: 'Hired', value: candidates.filter(c => c.status === CandidateStatus.HIRED).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Jobs" value={activeJobs} icon={Briefcase} color="bg-blue-500" />
        <StatCard title="Total Candidates" value={totalCandidates} icon={Users} color="bg-indigo-500" />
        <StatCard title="Pending Review" value={pendingReviews} icon={TrendingUp} color="bg-amber-500" />
        <StatCard title="Hired This Month" value={hiredCandidates} icon={UserCheck} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Pipeline Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {candidates.slice(0, 5).map((candidate) => {
                    const job = jobs.find(j => j.id === candidate.jobId);
                    return (
                        <div key={candidate.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate">{candidate.name}</p>
                                <p className="text-xs text-slate-500 truncate">Applied for {job?.title || 'Unknown Role'}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
