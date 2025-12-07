import React, { useState, useMemo } from 'react';
import { useAllStudents } from './components/useAllStudents';
import StudentsFilters from './components/StudentsFilters';
import StudentsTable from './components/StudentsTable';
import ExportButtons from './components/ExportButtons';
import ConfirmationModal from './components/ConfirmationModal';
import ViewStudentModal from './components/ViewStudentModal';
import EditStudentModal from './components/EditStudentModal';

const AS = () => {  
    const {
        loading,
        students,
        gradeLevels,
        sections,
        statuses,
        selectedStudent,
        showViewModal,
        showEditModal,
        setShowViewModal,
        setShowEditModal,
        handleViewStudent,
        handleEditStudent,
        handleSaveStudent,
        handleExportCSV,
        handleExportPDF,
        showConfirmModal,
        setShowConfirmModal,
        confirmAction,
        handleConfirmAction,
        toast,
        hideToast,
    } = useAllStudents();

    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({ 
        gradeLevel: "", 
        section: "", 
        status: "" 
    });

    // FIXED: Use useMemo to prevent re-filtering on every render
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const lowerSearch = search.toLowerCase();
            const matchesSearch = 
                student.fullName.toLowerCase().includes(lowerSearch) || 
                student.studentNumber.toLowerCase().includes(lowerSearch);
            
            const matchesGrade = selectedFilters.gradeLevel 
                ? student.gradeLevel === selectedFilters.gradeLevel 
                : true;
            
            const matchesSection = selectedFilters.section 
                ? student.section === selectedFilters.section 
                : true;
            
            const matchesStatus = selectedFilters.status 
                ? student.status === selectedFilters.status 
                : true;

            return matchesSearch && matchesGrade && matchesSection && matchesStatus;
        });
    }, [students, search, selectedFilters]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Students
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Showing {filteredStudents.length} of {students.length} students
                    </p>
                </div>

                <ExportButtons
                    handleExportCSV={handleExportCSV}
                    handleExportPDF={handleExportPDF}
                />
            </div>

            {/* Filters */}
            <StudentsFilters
                search={search}
                setSearch={setSearch}
                gradeLevels={gradeLevels}
                sections={sections}
                statuses={statuses}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />

            {/* Table */}
            <div id="students-table">
                <StudentsTable 
                    paginatedStudents={filteredStudents}
                    handleViewStudent={handleViewStudent}
                    handleEditStudent={handleEditStudent}
                />
            </div>

            {/* Modals */}
            <ConfirmationModal
                isVisible={showConfirmModal}
                action={confirmAction}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
            />

            <ViewStudentModal
                isVisible={showViewModal}
                student={selectedStudent}
                onClose={() => setShowViewModal(false)}
            />

            <EditStudentModal
                isVisible={showEditModal}
                student={selectedStudent}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveStudent}
            />
    
            {/* Toast Notification */}
            {toast.isVisible && (
                <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
                        toast.type === 'success' ? 'bg-green-600 text-white' :
                        toast.type === 'error' ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            {toast.type === 'success' && (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            )}
                            {toast.type === 'error' && (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                        </svg>
                        <span className="font-medium">{toast.message}</span>
                        <button 
                            onClick={hideToast}
                            className="ml-4 text-white hover:text-gray-200 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes slide-up {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-slide-up {
                        animation: slide-up 0.3s ease;
                    }
                `}
            </style>
        </div>
    );
};

export default AS;