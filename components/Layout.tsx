
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { LayoutDashboard, Briefcase, Users, LogOut, CheckSquare, BookText } from 'lucide-react';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppStore();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/platform', icon: LayoutDashboard, exact: true },
    { name: 'Recruitment', path: '/platform/jobs', icon: Briefcase },
    { name: 'Candidates', path: '/platform/candidates', icon: Users },
    { name: 'Onboarding', path: '/platform/onboarding', icon: CheckSquare },
    { name: 'Blog Admin', path: '/platform/blog', icon: BookText },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800 cursor-pointer text-left" onClick={() => navigate('/')}>
          <h1 className="text-xl font-bold tracking-tight text-blue-400">Remote Business Partner</h1>
          <p className="text-xs text-slate-400 mt-1">Recruitment OS</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(i => location.pathname.startsWith(i.path) && (i.exact ? location.pathname === i.path : true))?.name || 'Platform'}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                JD
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
