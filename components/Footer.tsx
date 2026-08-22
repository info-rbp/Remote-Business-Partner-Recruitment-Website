import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">R</div>
              <span className="text-lg font-bold text-white">Remote Business Partner</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6">Straightforward, human-led recruitment for employers and candidates.</p>
          </div>

          <div>
            <h4 className="font-bold text-white">Recruitment</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/vacancies" className="transition-colors hover:text-white">Current Vacancies</Link></li>
              <li><Link to="/for-candidates" className="transition-colors hover:text-white">For Candidates</Link></li>
              <li><Link to="/for-employers" className="transition-colors hover:text-white">For Employers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white">Access</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/login" className="transition-colors hover:text-white">Staff Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Remote Business Partner. All rights reserved.</p>
          <p className="text-slate-500">Recruitment services for employers and candidates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
