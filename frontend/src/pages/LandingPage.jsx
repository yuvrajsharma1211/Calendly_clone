import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Check, Calendar, MessageSquare, Mail, Sparkles, Phone, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleStartFree = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setFormSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      // Reset success alert after 5s
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden font-sans">
      
      {/* 1. Header Navigation Bar */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 md:px-12 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-black text-sm relative">
            <span className="absolute -top-1 -left-1 w-4 h-4 bg-blue-300 rounded-full mix-blend-multiply opacity-70 animate-pulse"></span>
            C
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">Calendly</span>
        </div>

        {/* Desktop Mid Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-1 hover:text-slate-900 cursor-pointer group">
            Product <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div className="flex items-center gap-1 hover:text-slate-900 cursor-pointer group">
            Solutions <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div className="flex items-center gap-1 hover:text-slate-900 cursor-pointer group">
            Resources <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <a href="#" className="hover:text-slate-900">Pricing</a>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Talk to sales
          </span>
          <button 
            onClick={handleStartFree}
            className="text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl transition-all"
          >
            Log In
          </button>
          <button
            onClick={handleStartFree}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-brand-100 hover:shadow active:scale-[0.98]"
          >
            Get started for free
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 py-12 md:px-16 md:py-24 max-w-7xl mx-auto w-full gap-16 relative">
        
        {/* Left Column Content */}
        <div className="flex-1 space-y-8 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-600 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Join 20M+ scheduled users worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-[1.05]">
            Easy <br />
            <span className="text-brand-500 bg-gradient-to-r from-brand-500 to-blue-600 bg-clip-text text-transparent">scheduling</span> <br />
            ahead
          </h1>

          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium">
            Join 20 million professionals who easily book meetings with the #1 scheduling tool. Elevate scheduling and maximize client conversions.
          </p>

          {/* Simple Get Started Free Button */}
          <div className="space-y-4 pt-2">
            <button
              onClick={handleStartFree}
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-brand-100 hover:shadow-xl hover:shadow-brand-100/70 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Email alternative text */}
            <div className="space-y-1 text-xs">
              <span 
                onClick={handleStartFree}
                className="text-brand-500 hover:text-brand-600 font-bold underline cursor-pointer"
              >
                Sign up free with email.
              </span>
              <span className="text-slate-400 font-medium ml-1">No credit card required.</span>
            </div>
          </div>
        </div>

        {/* Right Column Illustration */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          
          {/* Background Abstract Geometric Shapes */}
          <div className="absolute top-12 right-0 w-[420px] h-[340px] bg-brand-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          {/* Blue Bubble Circle */}
          <div className="absolute -bottom-8 right-6 w-72 h-72 bg-blue-500 rounded-full -z-10 mix-blend-multiply opacity-90 hidden sm:block"></div>
          
          {/* Purple Diagonal Slant Panel */}
          <div className="absolute -top-4 right-1/4 w-32 h-64 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-3xl -rotate-12 -z-10 opacity-90 hidden sm:block"></div>

          {/* Core White Dashboard Workflow Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 w-full max-w-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            
            {/* Illustration Card Header */}
            <div className="border-b border-slate-50 pb-5 mb-6 text-left">
              <h3 className="font-extrabold text-slate-800 text-lg md:text-xl tracking-tight leading-snug">
                Reduce no-shows and stay on track
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Automatic reminder pipelines</p>
            </div>

            {/* Workflows Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              
              {/* Left Workflow Block */}
              <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl flex flex-col justify-start text-left space-y-4 hover:border-brand-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Workflow
                  </span>
                  <div className="h-6 w-6 bg-brand-50 rounded-full flex items-center justify-center text-brand-500">
                    <MessageSquare className="h-3 w-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-700 text-xs">Send text reminder</h4>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    24 hours before event starts
                  </span>
                </div>

                {/* Dotted connector */}
                <div className="flex justify-center py-1">
                  <div className="border-l-2 border-dashed border-slate-200 h-6"></div>
                </div>

                {/* Action status panel */}
                <div className="p-3 bg-brand-50 rounded-xl flex items-center gap-2 border border-brand-100">
                  <div className="h-4 w-4 bg-brand-500 rounded-full flex items-center justify-center text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-700">Send text to invitees</span>
                </div>
              </div>

              {/* Right Workflow Block */}
              <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl flex flex-col justify-start text-left space-y-4 hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Workflow
                  </span>
                  <div className="h-6 w-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <Mail className="h-3 w-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-700 text-xs">Send follow-up email</h4>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    2 hours after event ends
                  </span>
                </div>

                {/* Dotted connector */}
                <div className="flex justify-center py-1">
                  <div className="border-l-2 border-dashed border-slate-200 h-6"></div>
                </div>

                {/* Action status panel */}
                <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-2 border border-emerald-100">
                  <div className="h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">Send email to invitees</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* 2.2. Integration & Feature Cards Section */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              More than a scheduling link
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
              Calendly’s functionality goes way beyond just a scheduling link, with customizable, automated features to help you and your team achieve goals faster.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Suite Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between w-full">
                  {/* Google Logo */}
                  <div className="h-10 w-10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  {/* Arrow Link Icon */}
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                <h3 className="font-extrabold text-slate-800 text-lg md:text-xl tracking-tight leading-snug mt-6">
                  Google suite
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                  Get your job done faster by connecting Calendly to Google Calendar, Meet, Analytics, and more.
                </p>
              </div>
            </div>

            {/* Microsoft Suite Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between w-full">
                  {/* Microsoft Logo */}
                  <div className="h-10 w-10 flex items-center justify-center">
                    <svg viewBox="0 0 23 23" className="w-7 h-7">
                      <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
                      <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
                      <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
                      <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
                    </svg>
                  </div>
                  {/* Arrow Link Icon */}
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                <h3 className="font-extrabold text-slate-800 text-lg md:text-xl tracking-tight leading-snug mt-6">
                  Microsoft suite
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                  Make your day easier with Calendly integrations for Microsoft Teams, Outlook, Azure SSO, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. Basic Contact Section */}
      <section className="border-t border-slate-100 bg-slate-50/30 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Contact details */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Have questions about how EasySchedule can optimize your personal or team scheduling? Our customer success team is here to assist. Drop us a line and we'll reply as soon as possible!
            </p>

            <div className="space-y-4 pt-4">
              {/* Email details */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center shadow-inner">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Email Us</span>
                  <a href="mailto:support@easyschedule.com" className="text-sm font-semibold text-slate-700 hover:text-brand-500 transition-colors">
                    support@easyschedule.com
                  </a>
                </div>
              </div>

              {/* Phone details */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Call Us</span>
                  <span className="text-sm font-semibold text-slate-700">
                    +91 9876543210
                  </span>
                </div>
              </div>

              {/* Location details */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Office Headquarters</span>
                  <span className="text-sm font-semibold text-slate-700">
                    GT Road, NH-1, Punjab, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft text-left hover:shadow-md transition-shadow">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-scale-up">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">Message Sent!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for reaching out. A scheduling expert will contact you shortly via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Snow"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@example.com"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    How can we help?
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    required
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] mt-2"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3. Sleek Footer bar */}
      <footer className="w-full bg-slate-50 py-8 px-6 text-center text-slate-400 border-t border-slate-100 text-xs font-semibold">
        <p>© 2026 EasySchedule Platforms Inc. Inspired by Calendly.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
