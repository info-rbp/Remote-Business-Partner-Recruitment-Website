import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageSquare, Search, ShieldCheck, UserCheck, Users } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const ForCandidates: React.FC = () => {
  const benefits = [
    { icon: UserCheck, title: 'Human-led recruitment', text: 'Applications are reviewed by our recruitment team. We focus on your experience, circumstances and suitability for the role.' },
    { icon: MessageSquare, title: 'Clear communication', text: 'We aim to keep candidates informed about where they are in the process and what happens next.' },
    { icon: Search, title: 'Relevant opportunities', text: 'Our focus is on introducing candidates to roles where there is a genuine alignment between the person, position and employer.' },
    { icon: ShieldCheck, title: 'Respect and confidentiality', text: 'We treat candidate information with care and discuss opportunities with you before progressing your application with an employer.' },
  ];

  const steps = [
    ['1', 'Apply', 'Apply for a current vacancy or submit your details to our candidate network.'],
    ['2', 'Initial review', 'Our recruitment team reviews your experience against the requirements of the opportunity.'],
    ['3', 'Conversation', 'Where there appears to be a fit, we speak with you about the role, your experience and what you are looking for.'],
    ['4', 'Employer introduction', 'Suitable candidates are introduced to the employer once the opportunity and next steps have been discussed.'],
    ['5', 'Interview', 'We coordinate the interview process and help keep communication moving between you and the employer.'],
    ['6', 'Outcome', 'We communicate the outcome and, where appropriate, may consider you for other suitable opportunities.'],
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNav />
      <header className="bg-slate-900 px-4 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">For Candidates</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">A more straightforward recruitment experience</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">We believe candidates should understand the opportunity, know where they stand and deal with real people throughout the recruitment process.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/vacancies" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-500">View Current Vacancies <ArrowRight className="h-4 w-4" /></Link>
            <a href="#candidate-network" className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-7 py-3.5 font-bold text-white hover:bg-slate-800">Join Our Candidate Network</a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Why candidates work with us</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Recruitment should feel personal, not transactional</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Our role is to help candidates understand the opportunity and help employers make informed hiring decisions. That works best when communication is clear and the process is handled properly.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Our Process</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">What happens when you apply</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">A simple process, with a human being involved at every meaningful stage.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {steps.map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{number}</div>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="candidate-network" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl bg-blue-600 p-8 text-white md:grid-cols-[1fr_auto] md:items-center sm:p-10">
            <div>
              <div className="flex items-center gap-3"><Users className="h-7 w-7" /><h2 className="text-2xl font-bold sm:text-3xl">Not seeing the right role today?</h2></div>
              <p className="mt-3 max-w-2xl text-blue-100">Keep an eye on our Current Vacancies page. A dedicated candidate-network submission form can be added as the next release without holding up the initial launch.</p>
            </div>
            <Link to="/vacancies" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700">Browse Vacancies <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForCandidates;
