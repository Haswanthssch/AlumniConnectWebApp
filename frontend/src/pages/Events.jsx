import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  MapPinIcon,
  LinkIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/auth';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  registrationLink: '',
};

const formatEventDate = (date) => new Date(date).toLocaleString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      setEvents(await eventService.getAllEvents());
    } catch (error) {
      toast.error(error.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      registrationLink: event.registrationLink || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await eventService.updateEvent(editingId, form);
        toast.success('Event updated');
      } else {
        await eventService.createEvent(form);
        toast.success('Event created');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Unable to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventService.deleteEvent(eventId);
      setEvents((current) => current.filter((event) => event._id !== eventId));
      toast.success('Event deleted');
    } catch (error) {
      toast.error(error.message || 'Unable to delete event');
    }
  };

  const ownsEvent = (event) => event.owner?._id === user?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Community calendar</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Upcoming Events</h1>
          <p className="text-gray-600 mt-2">Discover meetups, talks, and alumni gatherings shared by the community.</p>
        </div>
        {user?.role === 'alumni' && (
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5" /> Create an event
          </button>
        )}
      </motion.div>

      {showForm && (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit event' : 'Create an event'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-900">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="md:col-span-2 text-sm font-medium text-gray-700">Event title<input required name="title" value={form.title} onChange={handleChange} maxLength="120" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
            <label className="md:col-span-2 text-sm font-medium text-gray-700">Description<textarea required name="description" value={form.description} onChange={handleChange} rows="4" maxLength="2000" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
            <label className="text-sm font-medium text-gray-700">Date and time<input required type="datetime-local" name="date" value={form.date} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
            <label className="text-sm font-medium text-gray-700">Location<input required name="location" value={form.location} onChange={handleChange} maxLength="160" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
            <label className="md:col-span-2 text-sm font-medium text-gray-700">Registration link <span className="font-normal text-gray-400">(optional)</span><input type="url" name="registrationLink" value={form.registrationLink} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
          </div>
          <button disabled={saving} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Publish event'}</button>
        </motion.form>
      )}

      {loading ? <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div> : events.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center"><CalendarDaysIcon className="h-12 w-12 mx-auto text-gray-300" /><h2 className="mt-4 text-lg font-semibold text-gray-900">No events yet</h2><p className="mt-1 text-gray-500">Alumni can be the first to publish an event.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event, index) => (
            <motion.article key={event._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{formatEventDate(event.date)}</p><h2 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h2></div><CalendarDaysIcon className="h-7 w-7 text-blue-500 flex-shrink-0" /></div>
              <p className="mt-4 text-gray-600 whitespace-pre-line flex-1">{event.description}</p>
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500"><p className="flex items-center gap-2"><MapPinIcon className="h-5 w-5 text-gray-400" />{event.location}</p><p className="flex items-center gap-2"><UserCircleIcon className="h-5 w-5 text-gray-400" />Hosted by {event.owner?.name || 'Alumni'}</p>{event.registrationLink && <a href={event.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"><LinkIcon className="h-5 w-5" />Registration details</a>}</div>
              {user?.role === 'alumni' && ownsEvent(event) && <div className="mt-5 flex gap-2"><button onClick={() => openEdit(event)} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"><PencilSquareIcon className="h-4 w-4" />Edit</button><button onClick={() => handleDelete(event._id)} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><TrashIcon className="h-4 w-4" />Delete</button></div>}
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
