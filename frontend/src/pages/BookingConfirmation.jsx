import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, Mail, Globe, ArrowRight } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the meeting details from navigation state
  const meeting = location.state?.meeting;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft w-full max-w-lg p-8 md:p-10 text-center space-y-8 animate-scale-up">
        
        {/* Animated Checkmark Circle */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner mb-4 animate-scale">
            <CheckCircle2 className="h-10 w-10 stroke-[2]" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Confirmed!</h2>
          <p className="text-slate-400 text-xs mt-1">You are scheduled with John Doe.</p>
        </div>

        {meeting ? (
          /* Meeting summary block */
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 text-left space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Event Title</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">{meeting.event_title}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-100/50 py-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-500" />
                  Date
                </span>
                <span className="text-xs font-bold text-slate-700 block">{formatDate(meeting.meeting_date)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-500" />
                  Time
                </span>
                <span className="text-xs font-bold text-slate-700 block">
                  {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Invitee Name
                </span>
                <span className="text-xs font-semibold text-slate-700 block">{meeting.invitee_name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Invitee Email
                </span>
                <span className="text-xs font-semibold text-slate-700 block truncate">{meeting.invitee_email}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold italic">
              <Globe className="h-3.5 w-3.5 text-slate-300" />
              Calendar invitation sent to your email.
            </div>
          </div>
        ) : (
          <div className="py-4 text-sm font-semibold text-slate-500 italic">
            Meeting booking summary is unavailable.
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Go to Portal Dashboard
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
