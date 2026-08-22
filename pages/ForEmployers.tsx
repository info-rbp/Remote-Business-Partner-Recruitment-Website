import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Handshake, MessageSquare, ShieldCheck, Users } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const ForEmployers: React.FC = () => {
  const [form, setForm] = useState({ company: '', contact: '', email: '', phone: '', role: '', type: 'Full-Time', location: '', salary: '', startDate: '', requirements: '' });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Recruitment appointment request - ${form.company} - ${form.role}`);
    const body = encodeURIComponent([
      `Company: ${form.company}`,
      `Contact: ${form.contact}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Position: ${form.role}`,
      `Employment type: ${form.type}`,
      `Location: ${form.location}`,
      `Salary / hourly rate: ${form.salary}`,
      `Desired start date: ${form.startDate}`,
      '',
      'Role requirements:',
      form.requirements,
    ].join('\n'));
    window.location.href = `mailto:recruitment@remotebusinesspartner.com.au?subject=${subject}&body=${body}`;
  };

  const inclusions = ['Initial role briefing', 'Job advertisement preparation', 'Candidate application management', 'Candidate screening', 'Suitable candidate shortlist', 'Interview coordination', 'Candidate communications', 'Appointment support'];
  const steps = [
    ['1', 'Appoint RBP', 'Tell us about the position you need filled and the type of person you are looking for.'],
    ['2', 'Role brief', 'We work with you to understand the role, your business, the requirements and the practical realities of the appointment.'],
    ['3', 'Recruit', 'We advertise and recruit for the vacancy using the agreed role brief.'],
    ['4', 'Screen', 'Applications are reviewed and suitable candidates are identified before being progressed.'],
    ['5', 'Interview', 'We coordinate shortlisted candidates and support the interview process with your business.'],
    ['6', 'Appoint', 'You make the final hiring decision and we assist with completing the recruitment process.'],
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNav />
      <header className="bg-slate-900 px-4 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">For Employers</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">Straightforward recruitment. Fixed fees.</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">Work with Remote Business Partner to recruit the people your business needs without percentage-based recruitment fees. We work with you through the process, from understanding the vacancy to coordinating the appointment.</p>
          <a href="#appoint" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500">Appoint Remote Business Partner <ArrowRight className="h-4 w-4" /></a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Fixed-fee recruitment</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Know the recruitment cost from the outset</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">Clear pricing for straightforward employee recruitment. More specialised or executive assignments can be scoped separately where required.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              ['Casual Employee', '$750 + GST'],
              ['Part-Time Employee', '$750 + GST'],
              ['Full-Time Employee', '$1,500 + GST'],
            ].map(([title, price]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                <h3 className="font-bold text-slate-700">{title}</h3>
                <p className="mt-4 text-3xl font-extrabold text-slate-900">{price}</p>
                <a href="#appoint" className="mt-6 inline-flex font-bold text-blue-600">Appoint us <ArrowRight className="ml-2 h-4 w-4" /></a>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Why RBP</p>
                <h2 className="mt-3 text-3xl font-bold">We work with the employer, not just the vacancy</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">Good recruitment starts with understanding what the business actually needs. We work with you to define the role, review applicants and keep the process moving so you can make the final hiring decision with better information.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    [Handshake, 'Fixed pricing', 'A clear fee agreed before recruitment begins.'],
                    [Users, 'Employer partnership', 'We take time to understand the role and the business behind it.'],
                    [ShieldCheck, 'Human screening', 'Applications are reviewed by people before suitable candidates are progressed.'],
                    [MessageSquare, 'End-to-end support', 'We coordinate candidate communication and the recruitment process with you.'],
                  ].map(([Icon, title, text]: any) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <Icon className="h-6 w-6 text-blue-600" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-bold">What your recruitment engagement can include</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {inclusions.map(item => <div key={item} className="flex gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="h-5 w-5 flex-none text-emerald-500" />{item}</div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Our process</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From vacancy to appointment</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-slate-200 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">{number}</div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="appoint" className="bg-blue-600 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 text-white sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">Appoint us</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Tell us about the role you need filled</h2>
              <p className="mt-4 leading-7 text-blue-100">Complete the details and your email application will open with the recruitment brief pre-filled, ready to send to our recruitment team.</p>
            </div>
            <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-white p-6 text-slate-900 shadow-xl sm:grid-cols-2 sm:p-8">
              <input required placeholder="Company name *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input required placeholder="Contact name *" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input required type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input type="tel" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input required placeholder="Position title *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3"><option>Full-Time</option><option>Part-Time</option><option>Casual</option><option>Contract</option></select>
              <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input placeholder="Salary / hourly rate" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3" />
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3 sm:col-span-2" />
              <textarea required rows={5} placeholder="Brief description and requirements *" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} className="resize-none rounded-xl border border-slate-200 px-3 py-3 sm:col-span-2" />
              <button className="rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white hover:bg-slate-800 sm:col-span-2">Prepare Appointment Request</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForEmployers;
