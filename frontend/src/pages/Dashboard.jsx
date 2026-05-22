import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api/eventsApi';
import { meetingsApi } from '../api/meetingsApi';
import { Clock, Calendar, CalendarDays, Users, ArrowRight, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventTypesCount: 0,
    upcomingMeetingsCount: 0,
    pastMeetingsCount: 0
  });
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Run fetches in parallel
        const [eventsRes, meetingsRes] = await Promise.all([
          eventsApi.getAll(),
          meetingsApi.getAll()
        ]);

        const events = eventsRes.data || [];
        const upcoming = meetingsRes.data?.upcoming || [];
        const past = meetingsRes.data?.past || [];

        setStats({
          eventTypesCount: events.length,
          upcomingMeetingsCount: upcoming.length,
          pastMeetingsCount: past.length
        });
        
        // Show first 3 upcoming meetings
        setUpcomingMeetings(upcoming.slice(0, 3));
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Failed to load dashboard data. Make sure the database is seeded and the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back, User!</h2>
        <p className="text-slate-500 text-sm mt-1">Here is a quick overview of your scheduling links and scheduled meetings.</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-5">
              <div className="h-12 w-12 bg-blue-50 text-brand-500 rounded-xl flex items-center justify-center shadow-inner">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Event Types</span>
                <span className="text-2xl font-bold text-slate-800 block mt-0.5">{stats.eventTypesCount}</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-5">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Upcoming Meetings</span>
                <span className="text-2xl font-bold text-slate-800 block mt-0.5">{stats.upcomingMeetingsCount}</span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-5">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Past Meetings</span>
                <span className="text-2xl font-bold text-slate-800 block mt-0.5">{stats.pastMeetingsCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 items-start">
            {/* Upcoming Meetings List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-base">Next 3 Scheduled Meetings</h3>
                <Link to="/meetings" className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  View all meetings <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {upcomingMeetings.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-500">No upcoming meetings booked yet</p>
                  <p className="text-xs text-slate-400 mt-1">Share your event type links to get scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 border border-slate-100 rounded-xl hover:border-brand-100 hover:bg-slate-50/30 transition-all duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="text-xs font-semibold text-brand-500 bg-brand-50 px-2 py-0.5 rounded">
                          {meeting.event_title} ({meeting.event_duration} min)
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">{meeting.invitee_name}</h4>
                        <span className="text-xs text-slate-400 block">{meeting.invitee_email}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs font-bold text-slate-700 block">{formatDate(meeting.meeting_date)}</span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/events" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-100 hover:bg-brand-50/10 text-sm font-semibold text-slate-700 transition-all group">
                  Manage Event Types
                  <Clock className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </Link>

                <Link to="/availability" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-100 hover:bg-brand-50/10 text-sm font-semibold text-slate-700 transition-all group">
                  Set Weekly Availability
                  <CalendarDays className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </Link>

                <Link to="/meetings" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-100 hover:bg-brand-50/10 text-sm font-semibold text-slate-700 transition-all group">
                  Review Meeting History
                  <Calendar className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>

              {/* Developer Tip Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5 text-brand-500" />
                  Testing Booking flow
                </h4>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  To test scheduling, navigate to <strong>Event Types</strong> and click the <strong>Booking Link</strong> on any card to open the public booking interface.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
