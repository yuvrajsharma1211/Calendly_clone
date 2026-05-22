import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api/eventsApi';
import { Clock, Plus, Trash2, Edit2, Copy, Check, ExternalLink } from 'lucide-react';

const EventTypes = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null when creating
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration: 30
  });
  const [formError, setFormError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getAll();
      setEventTypes(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching event types:', err);
      setError('Could not load scheduling links. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      duration: 30
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      duration: event.duration
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.duration) {
      setFormError('Title and duration are required.');
      return;
    }

    try {
      if (editingEvent) {
        // Update call
        await eventsApi.update(editingEvent.id, formData);
      } else {
        // Create call
        await eventsApi.create(formData);
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      console.error('Form submission error:', err);
      setFormError(err.response?.data?.message || 'Error processing request.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event type? All associated meetings will be cancelled.')) {
      return;
    }

    try {
      await eventsApi.delete(id);
      fetchEvents();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete the event type.');
    }
  };

  const copyToClipboard = (slug, id) => {
    const publicUrl = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Event Types</h2>
          <p className="text-slate-500 text-sm mt-1">Create and manage your standard availability templates.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Event Type
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <>
          {eventTypes.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-soft rounded-2xl p-12 text-center flex-1 flex flex-col justify-center items-center">
              <Clock className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-800 text-lg">No event types yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Create scheduling links with different durations so clients can pick the best time for them.
              </p>
              <button
                onClick={openCreateModal}
                className="mt-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                Create your first event type
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map((event) => {
                const publicUrl = `/book/${event.slug}`;
                return (
                  <div
                    key={event.id}
                    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col relative group overflow-hidden"
                  >
                    {/* Event color tag stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500"></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-3 mt-1">
                      <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-brand-500 transition-colors">
                        {event.title}
                      </h3>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-3">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{event.duration} mins</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1">
                      {event.description || 'No description provided.'}
                    </p>

                    {/* Public link copy option */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                      <span className="text-[11px] text-slate-400 font-medium font-mono truncate max-w-[140px]">
                        /{event.slug}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(event.slug, event.id)}
                          className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
                          title="Copy Booking Link"
                        >
                          {copiedId === event.id ? (
                            <Check className="h-4 w-4 text-emerald-600 animate-scale" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          to={publicUrl}
                          target="_blank"
                          className="p-2 text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors flex items-center justify-center"
                          title="View Booking Page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Actions Hover Layer */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => openEditModal(event)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-up">
            {/* Modal Title bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">
                {editingEvent ? 'Edit Event Type' : 'Create Event Type'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Title input */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. 1-on-1 Coffee Chat"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                />
              </div>

              {/* Custom Slug input */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  URL Slug (Optional)
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:border-brand-500 transition-colors">
                  <span className="bg-slate-100 border-r border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-400 flex items-center">
                    /book/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. coffee-chat"
                    className="w-full px-4 py-2.5 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Leave blank to automatically generate slug from title.
                </span>
              </div>

              {/* Duration selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. CASUAL meet to explore business collaborations."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors bg-slate-50/50 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTypes;
