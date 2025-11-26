import React, { useState } from 'react';
import { MessageSquare, List, Paperclip } from 'lucide-react';
import axios from 'axios';

const SupportForm = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    category: 'Technical Support',
    message: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.message.trim()) {
      setError('Please describe your issue');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('message', formData.message);

      if (file) {
        formDataToSend.append('attachment', file);
      }

      const response = await axios.post(
        '/backend/api/support/createTicket.php',
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Ticket submitted successfully!');
        setFormData({ category: 'Technical Support', message: '' });
        setFile(null);
        document.getElementById('attachment').value = '';

        if (onTicketCreated) {
          onTicketCreated();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Submit a Ticket</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative group">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <div className="relative">
            <List className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-amber-400 outline-none appearance-none"
            >
              <option>Technical Support</option>
              <option>Billing Question</option>
              <option>General Feedback</option>
              <option>Report an Issue</option>
            </select>
          </div>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
            Select the category of your issue
          </span>
        </div>

        <div className="relative group">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Please describe your issue or question in detail..."
            className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-amber-400 outline-none"
            required
          ></textarea>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
            Describe your issue in detail here
          </span>
        </div>

        <div className="relative group">
          <label htmlFor="attachment" className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
            <Paperclip className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {file ? file.name : 'Attach a file (Optional)'}
            </span>
          </label>
          <input
            type="file"
            id="attachment"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
            Attach a screenshot or document (Max 5MB)
          </span>
        </div>

        <div className="relative group">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 text-stone-900 font-bold py-2.5 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
            Send your ticket to the support team
          </span>
        </div>
      </form>
    </div>
  );
};

export default SupportForm;