import { useState, useEffect } from 'react';
import { User, CheckCircle, Clock, XCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AuthorizedEscorts = () => {
    const [escorts, setEscorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEscorts();
    }, []);

    const fetchEscorts = async () => {
        try {
            const response = await axios.get('/backend/api/textsundo/getEscorts.php', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                setEscorts(response.data.escorts || []);
            }
        } catch (err) {
            console.error('Error fetching escorts:', err);
            // Sample data for demonstration
            setEscorts([
                { id: 1, fullName: 'Maria Santos', relationship: 'Mother', contactNumber: '09123456789', status: 'approved' },
                { id: 2, fullName: 'Juan dela Cruz', relationship: 'Father', contactNumber: '09987654321', status: 'pending' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500">
                        <CheckCircle size={12} />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500">
                        <Clock size={12} />
                        Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500">
                        <XCircle size={12} />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4D77D]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="text-[#F4D77D]" size={20} />
                    Authorized Escorts
                </h2>
                <Link
                    to="/student-dashboard/text-sundo"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F4D77D] hover:bg-[#f0cd5e] text-gray-800 text-sm font-semibold rounded-lg transition duration-300"
                >
                    <UserPlus size={16} />
                    Manage
                </Link>
            </div>

            {escorts.length === 0 ? (
                <div className="text-center py-8">
                    <User size={40} className="mx-auto mb-3 text-gray-400 opacity-50" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No authorized escorts yet</p>
                    <Link
                        to="/student-dashboard/text-sundo"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4D77D] hover:bg-[#f0cd5e] text-gray-800 text-sm font-semibold rounded-lg transition duration-300"
                    >
                        <UserPlus size={16} />
                        Add Escort
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {escorts.map((escort) => (
                        <div
                            key={escort.id}
                            className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#F4D77D] rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={18} className="text-gray-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">{escort.fullName}</h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{escort.relationship}</p>
                                    </div>
                                </div>
                                {getStatusBadge(escort.status)}
                            </div>
                            <div className="ml-12 text-xs text-gray-600 dark:text-gray-400">
                                <p>📱 {escort.contactNumber}</p>
                            </div>
                        </div>
                    ))}

                    {escorts.length > 0 && (
                        <Link
                            to="/student-dashboard/text-sundo"
                            className="block text-center text-sm text-[#F4D77D] hover:text-[#f0cd5e] font-medium mt-3 transition-colors"
                        >
                            View All Escorts
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthorizedEscorts;
