import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Target, Users, ShieldCheck, Zap, Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

const Services: React.FC = () => {
    const { isGmailConnected, connectGmail, disconnectGmail } = useAppStore();
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            await connectGmail();
        } finally {
            setConnecting(false);
        }
    };

    return (
        <div>
             <div className="mb-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Services & Integrations</h1>
                <p className="text-slate-500">Manage client offerings and connect external tools.</p>
            </div>

            {/* Integrations Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Connected Apps
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                             {/* Gmail Icon SVG */}
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 5.99994V18.9999C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7892 19.5304 20.9999 19 20.9999H5C4.46957 20.9999 3.96086 20.7892 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 18.9999V5.99994L12 12.7499L21 5.99994Z" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 6.00006L12 12.7501L21 6.00006V5.00006C21 4.46963 20.7893 3.96092 20.4142 3.58585C20.0391 3.21077 19.5304 3.00006 19 3.00006H5C4.46957 3.00006 3.96086 3.21077 3.58579 3.58585C3.21071 3.96092 3 4.46963 3 5.00006V6.00006Z" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Gmail Integration</h3>
                            <p className="text-slate-500 text-sm">Automatically send status update emails to candidates from your account.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {isGmailConnected ? (
                            <div className="flex items-center gap-4">
                                <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    <Check className="w-4 h-4 mr-1.5" />
                                    Connected as hr@remotepartner.com
                                </span>
                                <button 
                                    onClick={disconnectGmail}
                                    className="text-slate-400 hover:text-red-500 font-medium text-sm transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleConnect}
                                disabled={connecting}
                                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                {connecting ? 'Linking Account...' : 'Connect Gmail Account'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Headhunting & Sourcing</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        We use advanced AI algorithms to identify passive candidates that match your exact technical and cultural requirements.
                    </p>
                    <button className="text-blue-600 font-medium hover:underline text-sm">Manage Offering &rarr;</button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                     <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Vetting & Compliance</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Comprehensive background checks, skill assessments, and AI-driven interview analysis to ensure candidate quality.
                    </p>
                    <button className="text-indigo-600 font-medium hover:underline text-sm">Manage Offering &rarr;</button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Rapid Deployment</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Contract staffing solutions for urgent project needs. Onboard pre-vetted talent in less than 48 hours.
                    </p>
                    <button className="text-purple-600 font-medium hover:underline text-sm">Manage Offering &rarr;</button>
                </div>
            </div>
        </div>
    )
}

export default Services;
