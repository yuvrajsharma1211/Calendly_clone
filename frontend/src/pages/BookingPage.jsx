import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api/bookingsApi';
import { Clock, Calendar, ArrowLeft, ArrowRight, User, Mail, Globe, Check } from 'lucide-react';

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD format
  const [slots, setSlots] = useState([]);
  
  // Navigation & selection
  const [selectedSlot, setSelectedSlot] = useState(null); // { start_time, end_time }
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form
  
  // Booking Form State
  const [formData, setFormData] = useState({
    invitee_name: '',
    invitee_email: ''
  });
  const [bookingError, setBookingError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Event details on load
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // We can fetch slots for today to fetch event type details
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await bookingsApi.getSlots(slug, todayStr);
        setEventDetails(res.data.event);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking page details:', err);
        setError('Scheduling page not found. Please verify the URL.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug]);

  // Fetch Slots when date is changed
  const fetchAvailableSlots = async (dateStr) => {
    try {
      setFetchingSlots(true);
      setSelectedSlot(null);
      const res = await bookingsApi.getSlots(slug, dateStr);
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    fetchAvailableSlots(dateStr);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleNextStep = () => {
    if (selectedDate && selectedSlot) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setBookingError(null);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);
    setSubmitting(true);

    if (!formData.invitee_name || !formData.invitee_email) {
      setBookingError('Name and Email are required.');
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        event_type_id: eventDetails.id,
        invitee_name: formData.invitee_name,
        invitee_email: formData.invitee_email,
        meeting_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time
      };

      const res = await bookingsApi.create(bookingData);
      
      // Redirect to confirmation screen passing meeting data
      navigate('/booking-confirmation', {
        state: {
          meeting: res.data
        }
      });
    } catch (err) {
      console.error('Booking creation error:', err);
      setBookingError(err.response?.data?.message || 'Double booking error: this timeslot is no longer available.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pure-JS mini calendar helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Empty paddings for previous month's ending days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Disable past dates
      const isPast = dayDate < today;
      const isSelected = selectedDate === dayDateStr;

      days.push(
        <button
          key={day}
          type="button"
          disabled={isPast}
          onClick={() => handleDateSelect(dayDateStr)}
          className={`h-10 w-10 mx-auto rounded-full text-xs font-bold transition-all flex items-center justify-center ${
            isPast 
              ? 'text-slate-200 cursor-not-allowed' 
              : isSelected 
              ? 'bg-brand-500 text-white shadow-sm shadow-brand-200' 
              : 'text-slate-700 hover:bg-slate-100 hover:text-brand-500'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatDateLabel = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-soft text-center max-w-sm">
          <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">Event link not found</h3>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 md:py-24">
      {/* Scheduling Card Wrapper */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-scale-up">
        
        {/* Left Column: Event details */}
        <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 p-8 md:p-10 space-y-6 bg-slate-50/50 flex flex-col justify-start">
          <div className="space-y-4">
            {step === 2 && (
              <button
                onClick={handlePrevStep}
                className="p-2 -ml-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-100 rounded-lg hover:shadow-sm transition-all flex items-center gap-1 text-xs font-semibold mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Host: John</span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{eventDetails.title}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Clock className="h-4.5 w-4.5 text-brand-500" />
              <span>{eventDetails.duration} Minutes</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Globe className="h-4.5 w-4.5 text-brand-500" />
              <span>Web Conferencing</span>
            </div>

            {step === 2 && selectedSlot && (
              <div className="p-3 bg-brand-50 border border-brand-100 text-brand-700 rounded-xl space-y-1 mt-6">
                <span className="text-[10px] uppercase font-bold text-brand-500 block">Scheduled Time</span>
                <span className="text-xs font-bold block">{formatDateLabel(selectedDate)}</span>
                <span className="text-xs block">
                  {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-4 border-t border-slate-100">
            {eventDetails.description || 'Welcome! Please select a convenient slot from the schedule list.'}
          </p>
        </div>

        {/* Right Column: Steps (Date-Time Picker OR Booking Form) */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
          {step === 1 ? (
            /* Step 1: Select Date & Time Slots */
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Select a Date & Time</h3>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Mini JS Calendar */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Days Header */}
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                    <div>SU</div>
                    <div>MO</div>
                    <div>TU</div>
                    <div>WE</div>
                    <div>TH</div>
                    <div>FR</div>
                    <div>SA</div>
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-y-2 mt-2">
                    {renderCalendarDays()}
                  </div>
                </div>

                {/* Time Slots Area */}
                <div className="w-full lg:w-60 space-y-4 flex flex-col justify-start">
                  <span className="text-xs font-bold text-slate-700 block">
                    {selectedDate ? formatDateLabel(selectedDate) : 'Select a date above'}
                  </span>

                  {selectedDate ? (
                    fetchingSlots ? (
                      <div className="py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="py-12 text-center text-xs font-medium text-slate-400 italic">
                        No availability on this day.
                      </div>
                    ) : (
                      <div className="space-y-2 overflow-y-auto max-h-[250px] pr-2">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot?.start_time === slot.start_time;
                          return (
                            <button
                              key={slot.start_time}
                              type="button"
                              onClick={() => handleSlotSelect(slot)}
                              className={`w-full py-3 text-xs font-bold border rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                isSelected 
                                  ? 'border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-100' 
                                  : 'border-brand-100 text-brand-500 hover:border-brand-500 bg-brand-50/20 hover:bg-brand-50/50'
                              }`}
                            >
                              {formatTime(slot.start_time)}
                              {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-400 font-semibold italic">
                      Please pick a calendar date to load slots.
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Step 1 button */}
              <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleNextStep}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Confirm Slot & Next
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Fill Details Form */
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Enter Details</h3>
                <p className="text-slate-400 text-xs mt-1">Please provide your contact information to finalise scheduling.</p>
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {bookingError}
                </div>
              )}

              <div className="space-y-4">
                {/* Invitee Name */}
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      name="invitee_name"
                      value={formData.invitee_name}
                      onChange={handleFormInputChange}
                      placeholder="e.g. Alice Smith"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Invitee Email */}
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Your Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      name="invitee_email"
                      value={formData.invitee_email}
                      onChange={handleFormInputChange}
                      placeholder="e.g. alice@example.com"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  Change Date/Time
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {submitting ? 'Scheduling...' : 'Schedule Event'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
