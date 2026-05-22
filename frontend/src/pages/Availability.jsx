import React, { useState, useEffect } from 'react';
import { availabilityApi } from '../api/availabilityApi';
import { CalendarDays, Save, Check } from 'lucide-react';

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Weekly structure
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Weekly availability state
  const [schedule, setSchedule] = useState(
    DAYS_OF_WEEK.map((day) => ({
      day_of_week: day,
      start_time: '09:00:00',
      end_time: '17:00:00',
      timezone: 'America/New_York',
      active: false
    }))
  );

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res = await availabilityApi.get();
        const dbData = res.data || [];

        // Map database records into weekly state
        const updatedSchedule = DAYS_OF_WEEK.map((day) => {
          const dbDay = dbData.find((item) => item.day_of_week === day);
          if (dbDay) {
            return {
              day_of_week: day,
              start_time: dbDay.start_time,
              end_time: dbDay.end_time,
              timezone: dbDay.timezone,
              active: true
            };
          } else {
            return {
              day_of_week: day,
              start_time: '09:00:00',
              end_time: '17:00:00',
              timezone: 'America/New_York',
              active: false
            };
          }
        });

        setSchedule(updatedSchedule);
        setError(null);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError('Failed to load availability. Please make sure the database is up and backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleActiveToggle = (dayName) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayName ? { ...day, active: !day.active } : day
      )
    );
  };

  const handleTimeChange = (dayName, field, value) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayName ? { ...day, [field]: value } : day
      )
    );
  };

  const handleTimezoneChange = (value) => {
    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        timezone: value
      }))
    );
  };

  const handleSave = async () => {
    setSuccessMessage('');
    setError(null);
    try {
      setLoading(true);
      const res = await availabilityApi.update(schedule);
      
      // Map return values back to sync active status correctly
      const dbData = res.data || [];
      const updatedSchedule = DAYS_OF_WEEK.map((day) => {
        const dbDay = dbData.find((item) => item.day_of_week === day);
        if (dbDay) {
          return {
            day_of_week: day,
            start_time: dbDay.start_time,
            end_time: dbDay.end_time,
            timezone: dbDay.timezone,
            active: true
          };
        } else {
          return {
            day_of_week: day,
            start_time: '09:00:00',
            end_time: '17:00:00',
            timezone: 'America/New_York',
            active: false
          };
        }
      });
      
      setSchedule(updatedSchedule);
      setSuccessMessage('Availability schedule saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Save availability error:', err);
      setError('Failed to save weekly availability.');
    } finally {
      setLoading(false);
    }
  };

  // Time options array for dropdowns (every 30 minutes from 00:00 to 23:30)
  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (const m of ['00', '30']) {
        const hr = String(h).padStart(2, '0');
        const displayHr = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        times.push({
          value: `${hr}:${m}:00`,
          label: `${displayHr}:${m} ${ampm}`
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  
  // Timezone options (standard)
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET) - America/New_York' },
    { value: 'America/Chicago', label: 'Central Time (CT) - America/Chicago' },
    { value: 'America/Denver', label: 'Mountain Time (MT) - America/Denver' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - America/Los_Angeles' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - Asia/Kolkata' },
    { value: 'Europe/London', label: 'British Summer Time (BST) - Europe/London' }
  ];

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Availability</h2>
          <p className="text-slate-500 text-sm mt-1">Configure the weekly hours when you are open to book meetings.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-semibold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="h-4.5 w-4.5" />
          )}
          Save Availability
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm font-medium flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading && schedule.every(d => !d.active) ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 items-start">
          {/* Main Availability Grid */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft lg:col-span-2 p-6">
            <h3 className="font-bold text-slate-800 text-base mb-6">Weekly Hours</h3>
            
            <div className="space-y-4">
              {schedule.map((day) => (
                <div
                  key={day.day_of_week}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    day.active 
                      ? 'border-slate-100 bg-white shadow-sm' 
                      : 'border-slate-100/50 bg-slate-50/50 opacity-60'
                  }`}
                >
                  {/* Day Toggling Checkbox */}
                  <div className="flex items-center gap-4 min-w-[140px] mb-3 sm:mb-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.active}
                        onChange={() => handleActiveToggle(day.day_of_week)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                    <span className={`text-sm font-bold ${day.active ? 'text-slate-800' : 'text-slate-400'}`}>
                      {day.day_of_week}
                    </span>
                  </div>

                  {/* Hour Selection Selectors */}
                  {day.active ? (
                    <div className="flex items-center gap-2 flex-1 sm:justify-end">
                      <select
                        value={day.start_time}
                        onChange={(e) => handleTimeChange(day.day_of_week, 'start_time', e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50/50"
                      >
                        {timeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs font-bold text-slate-400">to</span>
                      <select
                        value={day.end_time}
                        onChange={(e) => handleTimeChange(day.day_of_week, 'end_time', e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50/50"
                      >
                        {timeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic flex-1 sm:text-right">
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timezone Configuration Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <h3 className="font-bold text-slate-800 text-base mb-4">Timezone</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Choose the primary timezone you will use to generate availability slots. Your booking page will display slots matching this timezone.
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Timezone</label>
                <select
                  value={schedule[0]?.timezone || 'America/New_York'}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50/50"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-500" />
                Working Hours
              </h4>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                By toggling a day off, clients will not be able to select any slots on that weekday. If all days are turned off, no booking slots will generate at all.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
