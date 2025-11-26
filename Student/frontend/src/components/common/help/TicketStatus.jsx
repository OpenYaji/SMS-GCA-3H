import React, { useState, useEffect } from 'react';
import { Ticket, RefreshCw } from 'lucide-react';
import axios from 'axios';

const TicketStatus = ({ refreshTrigger }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusColors = {
    'Open': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'On Hold': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Closed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        '/backend/api/support/getTickets.php',
        { withCredentials: true }
      );

      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (err) {
      setError('Failed to load tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Support Tickets</h2>
        <p className="text-gray-500 dark:text-gray-400">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Support Tickets</h2>
        <button
          onClick={fetchTickets}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Refresh tickets"
        >
          <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No tickets yet. Submit a ticket above to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div key={ticket.TicketID} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{ticket.Subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    #{ticket.TicketID} &bull; {ticket.TicketPriority} Priority &bull; Last updated: {ticket.FormattedDate}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[ticket.TicketStatus] || statusColors['Open']}`}>
                {ticket.TicketStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketStatus;