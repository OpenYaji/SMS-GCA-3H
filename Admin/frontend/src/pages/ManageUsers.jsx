import { useOutletContext } from "react-router-dom";
import { useState, useRef } from "react";
import Tabs from "../components/manageusers/Tabs";
import StudentTable from "../components/manageusers/StudentTable";
import StudentProfile from "../components/manageusers/StudentProfile";
import ParentTable from "../components/manageusers/ParentTable";
import ParentProfile from "../components/manageusers/ParentProfile";
import TeacherProfile from "../components/manageusers/TeacherProfile";
import TeacherTable from "../components/manageusers/TeacherTable";
import GuardProfile from "../components/manageusers/GuardProfile";
import GuardTable from "../components/manageusers/GuardTable";
import RegistrarProfile from "../components/manageusers/RegistrarProfile";
import RegistrarTable from "../components/manageusers/RegistrarTable";
import AdminProfile from "../components/manageusers/AdminProfile";
import AdminTable from "../components/manageusers/AdminTable";

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState("Students");
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [selectedRegistrar, setSelectedRegistrar] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Track multiple selected students for bulk actions
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Track current sort option for each table
  const [studentSortOption, setStudentSortOption] = useState("All Students");

  // Refs to trigger table refreshes
  const studentTableRef = useRef(null);
  const parentTableRef = useRef(null);
  const teacherTableRef = useRef(null);
  const guardTableRef = useRef(null);
  const registrarTableRef = useRef(null);
  const adminTableRef = useRef(null);

  const handleTeacherArchived = (teacherId) => {
    console.log("Teacher archived in ManageUsers:", teacherId);

    if (selectedTeacher && selectedTeacher.id === teacherId) {
      setSelectedTeacher(null);
    }

    if (teacherTableRef.current?.refreshTeachers) {
      console.log("Triggering teacher table refresh from ManageUsers");
      teacherTableRef.current.refreshTeachers();
    }
  };

  const handleTeacherInfoUpdated = (updatedTeacher) => {
    console.log("Teacher information updated in ManageUsers:", updatedTeacher);

    // Refresh the teacher table data
    if (teacherTableRef.current?.refreshTeachers) {
      console.log("Triggering teacher table refresh after info update");
      teacherTableRef.current.refreshTeachers();
    }

    if (selectedTeacher && selectedTeacher.id === updatedTeacher.id) {
      setSelectedTeacher(updatedTeacher);
    }
  };

  const handleStudentArchived = (archivedStudentId) => {
    if (selectedStudent && selectedStudent.id === archivedStudentId) {
      setSelectedStudent(null);
    }

    if (studentTableRef.current?.refreshStudents) {
      console.log("Triggering student table refresh from ManageUsers");
      studentTableRef.current.refreshStudents();
    }
  };

  const handleStudentRestored = (restoredStudentId) => {
    if (selectedStudent && selectedStudent.id === restoredStudentId) {
      setSelectedStudent(null);
    }

    if (studentTableRef.current?.refreshStudents) {
      console.log("Triggering student table refresh from ManageUsers");
      studentTableRef.current.refreshStudents();
    }
  };

  const handleParentArchived = (archivedParentId) => {
    console.log("Parent archived in ManageUsers:", archivedParentId);
    if (selectedParent && selectedParent.id === archivedParentId) {
      setSelectedParent(null);
    }
    if (parentTableRef.current?.refreshParents) {
      parentTableRef.current.refreshParents();
    }
  };

  const handleParentTableRefresh = () => {
    if (parentTableRef.current?.refreshParents) {
      parentTableRef.current.refreshParents();
    }
  };

  // Handler for when parent information is updated (including status changes)
  const handleParentInfoUpdated = (updatedParent) => {
    console.log("Parent information updated in ManageUsers:", updatedParent);

    if (parentTableRef.current?.refreshParents) {
      console.log("Triggering parent table refresh after info update");
      parentTableRef.current.refreshParents();
    }

    if (selectedParent && selectedParent.id === updatedParent.id) {
      setSelectedParent(updatedParent);
    }
  };

  const handleSelectGuard = (guard) => {
    setSelectedGuard(guard);
  };

  const handleGuardArchived = (archivedGuardId) => {
    console.log("Guard archived in ManageUsers:", archivedGuardId);

    // Clear selection if the archived guard was selected
    if (selectedGuard && selectedGuard.id === archivedGuardId) {
      setSelectedGuard(null);
    }

    if (guardTableRef.current?.refreshGuards) {
      console.log("Triggering guard table refresh from ManageUsers");
      guardTableRef.current.refreshGuards();
    }
  };

  const handleGuardRestored = (restoredGuardId) => {
    console.log("Guard restored in ManageUsers:", restoredGuardId);

    if (selectedGuard && selectedGuard.id === restoredGuardId) {
      setSelectedGuard(null);
    }
    if (guardTableRef.current?.refreshGuards) {
      console.log("Triggering guard table refresh from ManageUsers");
      guardTableRef.current.refreshGuards();
    }
  };

  const handleGuardInfoUpdated = (updatedGuard) => {
    console.log("Guard information updated in ManageUsers:", updatedGuard);

    if (guardTableRef.current?.refreshGuards) {
      console.log("Triggering guard table refresh after info update");
      guardTableRef.current.refreshGuards();
    }

    if (selectedGuard && selectedGuard.id === updatedGuard.id) {
      setSelectedGuard(updatedGuard);
    }
  };

  const handleSelectRegistrar = (registrar) => {
    setSelectedRegistrar(registrar);
  };

  const handleRegistrarArchived = (archivedRegistrarId) => {
    console.log("Registrar archived in ManageUsers:", archivedRegistrarId);

    if (selectedRegistrar && selectedRegistrar.id === archivedRegistrarId) {
      setSelectedRegistrar(null);
    }

    if (registrarTableRef.current?.refreshRegistrars) {
      console.log("Triggering registrar table refresh from ManageUsers");
      registrarTableRef.current.refreshRegistrars();
    }
  };

  const handleRegistrarRestored = (restoredRegistrarId) => {
    console.log("Registrar restored in ManageUsers:", restoredRegistrarId);

    if (selectedRegistrar && selectedRegistrar.id === restoredRegistrarId) {
      setSelectedRegistrar(null);
    }

    if (registrarTableRef.current?.refreshRegistrars) {
      console.log("Triggering registrar table refresh from ManageUsers");
      registrarTableRef.current.refreshRegistrars();
    }
  };

  const handleRegistrarInfoUpdated = (updatedRegistrar) => {
    console.log(
      "Registrar information updated in ManageUsers:",
      updatedRegistrar
    );

    if (registrarTableRef.current?.refreshRegistrars) {
      console.log("Triggering registrar table refresh after info update");
      registrarTableRef.current.refreshRegistrars();
    }

    if (selectedRegistrar && selectedRegistrar.id === updatedRegistrar.id) {
      setSelectedRegistrar(updatedRegistrar);
    }
  };

  const handleSelectAdmin = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleAdminArchived = (archivedAdminId) => {
    console.log("Admin archived in ManageUsers:", archivedAdminId);

    if (selectedAdmin && selectedAdmin.id === archivedAdminId) {
      setSelectedAdmin(null);
    }

    if (adminTableRef.current?.refreshAdmins) {
      console.log("Triggering admin table refresh from ManageUsers");
      adminTableRef.current.refreshAdmins();
    }
  };

  const handleAdminRestored = (restoredAdminId) => {
    console.log("Admin restored in ManageUsers:", restoredAdminId);

    if (selectedAdmin && selectedAdmin.id === restoredAdminId) {
      setSelectedAdmin(null);
    }

    if (adminTableRef.current?.refreshAdmins) {
      console.log("Triggering admin table refresh from ManageUsers");
      adminTableRef.current.refreshAdmins();
    }
  };

  // Handler if student information is updated
  const handleStudentInfoUpdated = (updatedStudent) => {
    console.log("Student information updated in ManageUsers:", updatedStudent);

    // Refresh the student table data
    if (studentTableRef.current?.refreshStudents) {
      studentTableRef.current.refreshStudents();
    }
    if (
      selectedStudent &&
      updatedStudent &&
      selectedStudent.id === updatedStudent.id
    ) {
      console.log("Updating selected student with new data");
      setSelectedStudent(updatedStudent);
    }
  };

  const handleAdminInfoUpdated = (updatedAdmin) => {
    console.log("Admin information updated in ManageUsers:", updatedAdmin);

    // Refresh the admin table data
    if (adminTableRef.current?.refreshAdmins) {
      console.log("Triggering admin table refresh after info update");
      adminTableRef.current.refreshAdmins();
    }

    // Update the selected admin if it's the same one
    if (selectedAdmin && selectedAdmin.id === updatedAdmin.id) {
      setSelectedAdmin(updatedAdmin);
    }
  };

  // Handler for student sort option change
  const handleStudentSortChange = (sortOption) => {
    setStudentSortOption(sortOption);
  };

  // Handler for multiple student selection change
  const handleMultipleSelectionChange = (studentIds) => {
    console.log("Multiple students selected:", studentIds);
    setSelectedStudents(studentIds);
  };

  // Handler for bulk account creation completion
  const handleBulkAccountCreation = (results, errors) => {
    console.log("Bulk account creation completed:", { results, errors });

    // Clear selections after bulk creation
    setSelectedStudents([]);

    // Refresh the table
    if (studentTableRef.current?.refreshStudents) {
      studentTableRef.current.refreshStudents();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Students":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <StudentTable
              ref={studentTableRef}
              onSelectStudent={setSelectedStudent}
              onStudentArchived={handleStudentArchived}
              onStudentRestored={handleStudentRestored}
              onSortChange={handleStudentSortChange}
              onMultipleSelectionChange={handleMultipleSelectionChange}
              darkMode={isDarkMode}
            />
            <StudentProfile
              student={selectedStudent}
              selectedStudents={selectedStudents}
              onStudentArchived={handleStudentArchived}
              onStudentRestored={handleStudentRestored}
              onStudentInfoUpdated={handleStudentInfoUpdated}
              onBulkAccountCreation={handleBulkAccountCreation}
              darkMode={isDarkMode}
              currentView={studentSortOption}
            />
          </div>
        );

      case "Parents/Escorts":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <ParentTable
              ref={parentTableRef}
              onSelectParent={setSelectedParent}
              onParentArchived={handleParentArchived}
              onParentTableRefresh={handleParentTableRefresh}
              darkMode={isDarkMode}
            />
            <ParentProfile
              parent={selectedParent}
              onParentArchived={handleParentArchived}
              onParentInfoUpdated={handleParentInfoUpdated}
              onParentTableRefresh={handleParentTableRefresh}
              darkMode={isDarkMode}
            />
          </div>
        );

      case "Teachers":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <TeacherTable
              ref={teacherTableRef}
              onSelectTeacher={setSelectedTeacher}
              onTeacherArchived={handleTeacherArchived}
              darkMode={isDarkMode}
            />
            <TeacherProfile
              teacher={selectedTeacher}
              onTeacherArchived={handleTeacherArchived}
              onTeacherInfoUpdated={handleTeacherInfoUpdated}
              darkMode={isDarkMode}
            />
          </div>
        );

      case "Guards":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <GuardTable
              ref={guardTableRef}
              onSelectGuard={handleSelectGuard}
              onGuardArchived={handleGuardArchived}
              onGuardRestored={handleGuardRestored}
              onGuardInfoUpdated={handleGuardInfoUpdated}
              darkMode={isDarkMode}
            />
            <GuardProfile
              guard={selectedGuard}
              onGuardArchived={handleGuardArchived}
              onGuardRestored={handleGuardRestored}
              onGuardInfoUpdated={handleGuardInfoUpdated}
              darkMode={isDarkMode}
            />
          </div>
        );

      case "Registrars":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <RegistrarTable
              ref={registrarTableRef}
              onSelectRegistrar={handleSelectRegistrar}
              onRegistrarArchived={handleRegistrarArchived}
              onRegistrarRestored={handleRegistrarRestored}
              darkMode={isDarkMode}
            />
            <RegistrarProfile
              registrar={selectedRegistrar}
              onRegistrarArchived={handleRegistrarArchived}
              onRegistrarRestored={handleRegistrarRestored}
              onRegistrarInfoUpdated={handleRegistrarInfoUpdated}
              darkMode={isDarkMode}
            />
          </div>
        );

      case "Admins":
        return (
          <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
            <AdminTable
              ref={adminTableRef}
              onSelectAdmin={handleSelectAdmin}
              onAdminArchived={handleAdminArchived}
              onAdminRestored={handleAdminRestored}
              darkMode={isDarkMode}
            />
            <AdminProfile
              admin={selectedAdmin}
              onAdminArchived={handleAdminArchived}
              onAdminRestored={handleAdminRestored}
              onAdminInfoUpdated={handleAdminInfoUpdated}
              darkMode={isDarkMode}
            />
          </div>
        );

      default:
        return (
          <div className="text-gray-600 mt-10 text-center">
            Content for <span className="font-semibold">{activeTab}</span> tab
            will go here.
          </div>
        );
    }
  };

  return (
    <div
      className={`space-y-6 min-h-screen pl-6 ${
        isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
      }`}
    >
      <div className="mb-4">
        <h1
          className={`font-spartan text-[3em] font-bold mb-3 mt-5 ${
            isDarkMode ? "text-white" : "text-[#404040]"
          }`}
        >
          Manage Users
        </h1>
      </div>
      <Tabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        darkMode={isDarkMode}
      />
      {renderContent()}
    </div>
  );
}
