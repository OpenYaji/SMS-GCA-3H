import React, { useState } from 'react';
import { useAllStudents } from './components/useAllStudents';
import StudentsFilters from './components/StudentsFilters';
import StudentsTable from '../as/components/StudentsTable';
import ExportButtons from '../as/components/ExportButtons';
import ConfirmationModal from '../as/components/ConfirmationModal';
import ViewStudentModal from '../as/components/ViewStudentModal';

const AS = () => {  
    const {
        loading,
        students,
        gradeLevels,
        sections,
        statuses,
        startIndex,
        endIndex,
        handleExportCSV,
        handleExportPDF,
        showConfirmModal,
        setShowConfirmModal,
        confirmAction,
        handleConfirmAction,
        toast,
        hideToast,
    } = useAllStudents();

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({ gradeLevel: "", section: "", status: "" });

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    if (loading) return <p>Loading...</p>;

    // Apply search + filters
    const filteredStudents = students.filter(student => {
        const lowerSearch = search.toLowerCase();
        const matchesSearch = student.fullName.toLowerCase().includes(lowerSearch) || student.studentNumber.toLowerCase().includes(lowerSearch);
        const matchesGrade = selectedFilters.gradeLevel ? student.gradeLevel === selectedFilters.gradeLevel : true;
        const matchesSection = selectedFilters.section ? student.section === selectedFilters.section : true;
        const matchesStatus = selectedFilters.status ? student.status === selectedFilters.status : true;

        return matchesSearch && matchesGrade && matchesSection && matchesStatus;
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">All Students</h1>
                    <p className="text-sm text-gray-500">
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
    />
</div>


            {/* Confirmation Modal */}
            <ConfirmationModal
                isVisible={showConfirmModal}
                action={confirmAction}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
            />

            {/* View Student Modal */}
            <ViewStudentModal
                isVisible={showViewModal}
                student={selectedStudent}
                onClose={() => setShowViewModal(false)}
            />
    
            {/* Toast */}
            {toast.isVisible && (
                <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg">
                    {toast.message}
                    <button onClick={hideToast}>×</button>
                </div>
                
            )}
        </div>
    );
};

export default AS;
