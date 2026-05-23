import React, { useState, useEffect } from 'react';
import { meetingsApi } from '../api/meetingsApi';
import { Calendar, User, Mail, Clock, ShieldAlert, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const Meetings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState({ upcoming: [], past: [] });
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await meetingsApi.getAll();
      setMeetings(res.data || { upcoming: [], past: [] });
      setError(null);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Could not retrieve meetings list. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCancelMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled meeting? This action cannot be undone.')) {
      return;
    }

    try {
      await meetingsApi.cancel(id);
      fetchMeetings(); // reload meetings
    } catch (err) {
      console.error('Cancel meeting error:', err);
      alert('Failed to cancel the meeting.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const currentMeetingsList = activeTab === 'upcoming' ? meetings.upcoming : meetings.past;

  return (
    <div className="space-y-5 sm:space-y-6 flex-1 flex flex-col min-w-0">
      {/* Header section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Scheduled Meetings</h2>
        <p className="text-slate-500 text-sm mt-1">Track and cancel upcoming or review past meetings.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Tabs selector */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'upcoming'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Upcoming ({meetings.upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'past'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Past & Cancelled ({meetings.past.length})
        </button>
      </div>

      {/* Content list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {currentMeetingsList.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-soft rounded-2xl p-16 text-center flex-1 flex flex-col justify-center items-center">
              <Calendar className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-800 text-lg">No meetings found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                {activeTab === 'upcoming'
                  ? 'No scheduled upcoming bookings. Share your event links to get scheduled!'
                  : 'No past or cancelled meetings found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMeetingsList.map((meeting) => {
                const isCancelled = meeting.status === 'cancelled';
                return (
                  <div
                    key={meeting.id}
                    className={`bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden`}
                  >
                    {/* Status side bar Indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        isCancelled
                          ? 'bg-slate-300'
                          : activeTab === 'upcoming'
                          ? 'bg-brand-500'
                          : 'bg-slate-400'
                      }`}
                    ></div>

                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Event details tag */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isCancelled 
                            ? 'bg-slate-100 text-slate-500' 
                            : 'bg-brand-50 text-brand-600'
                        }`}>
                          {meeting.event_title} ({meeting.event_duration}m)
                        </span>

                        {isCancelled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Cancelled
                          </span>
                        )}
                      </div>

                      {/* Invitee Contact grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold">{meeting.invitee_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{meeting.invitee_email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time details & Cancellation Action */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <div className="md:text-right space-y-1">
                        <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-brand-500" />
                          {formatDate(meeting.meeting_date)}
                        </div>
                        <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-500 font-semibold">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                        </div>
                      </div>

                      {activeTab === 'upcoming' && !isCancelled && (
                        <button
                          onClick={() => handleCancelMeeting(meeting.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50/50 px-3.5 py-2 rounded-xl transition-all"
                        >
                          Cancel Meeting
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Meetings;
