import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/vacancies', label: 'Current Vacancies' },
    { to: '/for-candidates', label: 'For Candidates' },
    { to: '/for-employers', label: 'For Employers' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">R</div>
            <span className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Remote Business Partner</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map(link => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800">
              Staff Login
            </Link>
          </div>

          <button className="rounded-lg p-2 text-slate-700 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="space-y-2 border-t border-slate-100 py-4 md:hidden">
            {links.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="block rounded-lg bg-slate-900 px-3 py-3 text-center font-bold text-white">
              Staff Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNav;
