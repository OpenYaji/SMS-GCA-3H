import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  ArrowLeft,
  Users,
  Loader,
  Calendar,
  ClipboardList,
} from "lucide-react";
import useSearch from "../../utils/useSearch";
import useSort from "../../utils/useSort";
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";
import teacherService from "../../../services/teacherService";
import SectionClassScheduleModal from "../../../components/managegradelevels/modals/SectionClassScheduleModal";
import SectionAttendanceModal from "../../../components/managegradelevels/modals/SectionAttendanceModal";

const getAvatarUrl = (name, type = "student") => {
  const colors = ["FFB4A2", "FFCDB2", "FFB4A2", "E5989B", "B5838D", "6D6875"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (type === "teacher") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=${color}&color=fff&size=128&bold=true&font-size=0.5`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=4F46E5&color=fff&size=128&bold=true&font-size=0.4`;
};

const formatTeacherName = (teacher) => {
  if (!teacher) return "Not Assigned";

  const firstName = teacher.FirstName || teacher.firstName || "";
  const middleName = teacher.MiddleName || teacher.middleName || "";
  const lastName = teacher.LastName || teacher.lastName || "";

  if (firstName && lastName) {
    if (middleName) {
      const middleInitial = middleName.charAt(0).toUpperCase() + ".";
      return `${firstName} ${middleInitial} ${lastName}`;
    }
    return `${firstName} ${lastName}`;
  }

  return firstName || lastName || "Not Assigned";
};

// Helper function to get combined archived badge color (same as StudentTable)
const getCombinedArchivedBadgeColor = (darkMode) => {
  return darkMode
    ? "bg-purple-900 text-purple-200"
    : "bg-purple-100 text-purple-800";
};

// Helper function to get status badge color (same as StudentTable)
const getStatusBadgeColor = (status, darkMode) => {
  const baseClasses = "text-xs px-2 py-1 rounded-full font-medium";

  switch (status) {
    case "Withdrawn":
      return `${baseClasses} ${
        darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
      }`;
    case "Graduated":
      return `${baseClasses} ${
        darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
      }`;
    case "On Leave":
      return `${baseClasses} ${
        darkMode
          ? "bg-yellow-900 text-yellow-200"
          : "bg-yellow-100 text-yellow-800"
      }`;
    case "Inactive":
      return `${baseClasses} ${
        darkMode
          ? "bg-orange-900 text-orange-200"
          : "bg-orange-100 text-orange-800"
      }`;
    case "Suspended":
      return `${baseClasses} ${
        darkMode
          ? "bg-purple-900 text-purple-200"
          : "bg-purple-100 text-purple-800"
      }`;
    default:
      return `${baseClasses} ${
        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"
      }`;
  }
};

const ViewSectionModal = ({ isOpen, onClose, section, gradeLevel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("All Students");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const sortDropdownRef = React.useRef(null);

  const sortOptions = ["All Students", "Alphabetical A-Z", "Alphabetical Z-A"];

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  const fetchTeacherDetails = async (teacherId) => {
    if (!teacherId) return;

    setIsLoadingTeacher(true);
    try {
      const teacherData = await teacherService.getTeacherById(teacherId);
      setTeacherDetails(teacherData);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      if (!section || !isOpen) return;

      setIsLoadingStudents(true);
      setStudentsError(null);

      try {
        if (section.rawData?.StudentsURL) {
          const studentsData = await manageGradeLevelsService.getStudentsByURL(
            section.rawData.StudentsURL
          );

          if (studentsData.data && Array.isArray(studentsData.data)) {
            setStudents(studentsData.data);
          } else if (Array.isArray(studentsData)) {
            setStudents(studentsData);
          } else {
            setStudents([]);
          }
        } else {
          const studentsData =
            await manageGradeLevelsService.getSectionStudents(section.id);

          if (studentsData.data && Array.isArray(studentsData.data)) {
            setStudents(studentsData.data);
          } else if (Array.isArray(studentsData)) {
            setStudents(studentsData);
          } else {
            setStudents([]);
          }
        }
      } catch (error) {
        setStudentsError(error.message || "Failed to load students");
        setStudents([]);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [section, isOpen]);

  const teacher = useMemo(() => {
    if (!section) return null;
    const adviser = section.rawData?.Adviser;
    if (adviser) {
      return {
        id: adviser.EmployeeNumber || section.AdviserID,
        name: formatTeacherName(adviser),
        firstName: adviser.FirstName,
        lastName: adviser.LastName,
        middleName: adviser.MiddleName,
        specialization: adviser.Specialization || "Not Specified",
        profilePictureURL: adviser.ProfilePictureURL,
      };
    }

    return {
      id: section.AdviserID,
      name: section.adviser || "Not Assigned",
      specialization: section.specialization || "Not Specified",
      profilePictureURL: section.profilePictureURL,
    };
  }, [section]);

  useEffect(() => {
    if (teacher?.id) {
      fetchTeacherDetails(teacher.id);
    }
  }, [teacher?.id]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setSelectedTeacher(null);
  };

  const handleTeacherClick = () => {
    setSelectedTeacher(teacher);
    setSelectedStudent(null);
  };

  const handleBackClick = () => {
    setSelectedStudent(null);
    setSelectedTeacher(null);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setSelectedTeacher(null);
    setStudents([]);
    setTeacherDetails(null);
    setStudentsError(null);
    setShowScheduleModal(false);
    setShowAttendanceModal(false);
    onClose();
  };

  const getStudentName = (student) => {
    if (student.Profile?.FirstName && student.Profile?.LastName) {
      const middleInitial = student.Profile.MiddleName
        ? ` ${student.Profile.MiddleName.charAt(0)}.`
        : "";
      return `${student.Profile.FirstName}${middleInitial} ${student.Profile.LastName}`;
    }

    if (student.FirstName && student.LastName) {
      const middleInitial = student.MiddleName
        ? ` ${student.MiddleName.charAt(0)}.`
        : "";
      return `${student.FirstName}${middleInitial} ${student.LastName}`;
    }

    return student.name || "Unknown Student";
  };

  const getStudentEmail = (student) => {
    if (student.User?.EmailAddress) {
      return student.User.EmailAddress;
    }

    return student.Email || student.email || student.EmailAddress || "No email";
  };

  const getStudentId = (student) => {
    return (
      student.StudentNumber ||
      student.StudentID ||
      student.studentId ||
      student.id ||
      "N/A"
    );
  };

  const mappedStudents = useMemo(() => {
    return students.map((student) => ({
      ...student,
      name: getStudentName(student),
      formattedName: getStudentName(student),
      email: getStudentEmail(student),
      studentId: getStudentId(student),
    }));
  }, [students]);

  const searchedData = useSearch(mappedStudents, searchTerm, [
    "name",
    "formattedName",
    "email",
    "studentId",
    "Profile.FirstName",
    "Profile.LastName",
    "FirstName",
    "LastName",
    "User.EmailAddress",
    "StudentNumber",
    "StudentID",
    "Email",
  ]);

  const mappedSortOption = useMemo(() => {
    switch (sortOption) {
      case "Alphabetical A-Z":
        return "Alphabetical (A-Z)";
      case "Alphabetical Z-A":
        return "Alphabetical (Z-A)";
      default:
        return "All Students";
    }
  }, [sortOption]);

  const sortedData = useSort(searchedData, mappedSortOption);

  const getStudentSex = (student) => {
    return (
      student.Gender ||
      student.Sex ||
      student.sex ||
      student.gender ||
      "Not specified"
    );
  };

  const getStudentProfilePicture = (student) => {
    if (student.Profile?.ProfilePictureURL) {
      return student.Profile.ProfilePictureURL;
    }
    if (student.ProfilePictureURL) {
      return student.ProfilePictureURL;
    }
    return getAvatarUrl(getStudentName(student), "student");
  };

  const getTeacherSubject = () => {
    return (
      teacher?.specialization || teacherDetails?.subject || "Not specified"
    );
  };

  const getTeacherProfilePicture = () => {
    return (
      teacher?.profilePictureURL ||
      getAvatarUrl(teacher?.name || "Teacher", "teacher")
    );
  };

  const getStudentArchiveStatus = (student) => {
    const isRecordArchived =
      student.IsRecordArchived || student.isRecordArchived || false;
    const isAccountArchived =
      student.User?.IsArchived || student.isAccountArchived || false;
    const studentStatus = student.StudentStatus || student.status;
    const accountStatus = student.User?.AccountStatus || student.accountStatus;

    return {
      isRecordArchived,
      isAccountArchived,
      studentStatus,
      accountStatus,
    };
  };

  const hasArchiveStatus = (student) => {
    const { isRecordArchived, isAccountArchived } =
      getStudentArchiveStatus(student);
    return isRecordArchived || isAccountArchived;
  };

  const truncateEmail = (email, maxLength = 20) => {
    if (!email || email === "No email") return email;
    if (email.length <= maxLength) return email;

    const parts = email.split("@");
    if (parts.length !== 2) return email;

    const username = parts[0];
    const domain = parts[1];

    if (username.length > maxLength - 8) {
      return `${username.substring(0, maxLength - 8)}...@${domain}`;
    }

    return email.length > maxLength
      ? `${email.substring(0, maxLength - 3)}...`
      : email;
  };

  if (!isOpen || !section) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col font-kumbh">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-kumbh">
                {gradeLevel}: {section?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1 font-kumbh">
                {" "}
                Total of {students.length} Students
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-kumbh">
                Adviser: {teacher?.name}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            <div className="py-5 px-1 flex-1 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors min-w-[160px] justify-between text-sm font-kumbh"
                    >
                      <span>{sortOption}</span>
                      <span
                        className={`transition-transform ${
                          isSortOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {isSortOpen && (
                      <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
                        {sortOptions.map((option) => (
                          <li
                            key={option}
                            onClick={() => handleSortOptionClick(option)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-kumbh ${
                              sortOption === option
                                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search for a student by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoadingStudents ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400 font-kumbh">
                      Loading students...
                    </span>
                  </div>
                ) : studentsError ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <div className="text-red-500 dark:text-red-400 text-lg font-kumbh mb-2">
                      Error loading students
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
                      {studentsError}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr className="text-left">
                          <th className="px-3 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-12 text-center">
                            #
                          </th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[180px]">
                            Name
                          </th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-24">
                            Student ID
                          </th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[140px]">
                            Email address
                          </th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-20">
                            Sex
                          </th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[120px]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedData.map((student, index) => {
                          const archiveStatus =
                            getStudentArchiveStatus(student);
                          const hasArchive = hasArchiveStatus(student);

                          return (
                            <tr
                              key={student.StudentID || student.id}
                              onClick={() => handleStudentClick(student)}
                              className={`cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedStudent?.StudentID === student.StudentID
                                  ? "bg-yellow-50 dark:bg-gray-700"
                                  : ""
                              }`}
                            >
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh text-center">
                                {index + 1}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white font-kumbh">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="truncate max-w-[120px]"
                                    title={getStudentName(student)}
                                  >
                                    {getStudentName(student)}
                                  </span>
                                  {hasArchive && (
                                    <span
                                      className={`text-xs text-center px-2 py-1 rounded-full font-medium flex-shrink-0 ${getCombinedArchivedBadgeColor(
                                        false // You can pass darkMode here if needed
                                      )}`}
                                    >
                                      {archiveStatus.isRecordArchived &&
                                      archiveStatus.isAccountArchived
                                        ? "Fully Archived"
                                        : archiveStatus.isRecordArchived
                                        ? "Records Archived"
                                        : "Account Archived"}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                                <span
                                  className="truncate block max-w-[80px]"
                                  title={getStudentId(student)}
                                >
                                  {getStudentId(student)}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                                <span
                                  className="truncate block max-w-[120px]"
                                  title={getStudentEmail(student)}
                                >
                                  {truncateEmail(getStudentEmail(student))}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                                {getStudentSex(student)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                                {hasArchive ? (
                                  <div className="flex flex-col gap-1">
                                    {archiveStatus.isRecordArchived && (
                                      <span
                                        className={getStatusBadgeColor(
                                          archiveStatus.studentStatus,
                                          false
                                        )}
                                      >
                                        Record:{" "}
                                        {archiveStatus.studentStatus ||
                                          "Unknown"}
                                      </span>
                                    )}
                                    {archiveStatus.isAccountArchived && (
                                      <span
                                        className={getStatusBadgeColor(
                                          archiveStatus.accountStatus,
                                          false
                                        )}
                                      >
                                        Account:{" "}
                                        {archiveStatus.accountStatus ||
                                          "Unknown"}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-green-600 dark:text-green-400">
                                    Active
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {!isLoadingStudents &&
                  !studentsError &&
                  sortedData.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <div className="text-gray-500 dark:text-gray-400 text-lg font-kumbh">
                        {students.length === 0
                          ? "No students found for this section."
                          : "No students found matching your search criteria."}
                      </div>
                      {students.length === 0 && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-kumbh">
                          This section currently has no enrolled students.
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className="w-96 bg-gray-50 dark:bg-gray-900 flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                {selectedStudent ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleBackClick}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors font-kumbh text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to advisor
                    </button>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-kumbh border-b pb-3 border-gray-200 dark:border-gray-700">
                      Student Information
                    </h3>

                    <div className="flex justify-center mb-6">
                      <img
                        src={getStudentProfilePicture(selectedStudent)}
                        alt={getStudentName(selectedStudent)}
                        className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover"
                        onError={(e) => {
                          e.target.src = getAvatarUrl(
                            getStudentName(selectedStudent),
                            "student"
                          );
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Name
                        </label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-kumbh">
                          {getStudentName(selectedStudent)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Student ID
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-kumbh">
                          {getStudentId(selectedStudent)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-kumbh break-all">
                          {getStudentEmail(selectedStudent)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Sex
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-kumbh">
                          {getStudentSex(selectedStudent)}
                        </p>
                      </div>
                      {hasArchiveStatus(selectedStudent) && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                            Archive Status
                          </label>
                          <div className="space-y-2">
                            {getStudentArchiveStatus(selectedStudent)
                              .isRecordArchived && (
                              <span
                                className={getStatusBadgeColor(
                                  getStudentArchiveStatus(selectedStudent)
                                    .studentStatus,
                                  false
                                )}
                              >
                                Record:{" "}
                                {getStudentArchiveStatus(selectedStudent)
                                  .studentStatus || "Unknown"}
                              </span>
                            )}
                            {getStudentArchiveStatus(selectedStudent)
                              .isAccountArchived && (
                              <span
                                className={getStatusBadgeColor(
                                  getStudentArchiveStatus(selectedStudent)
                                    .accountStatus,
                                  false
                                )}
                              >
                                Account:{" "}
                                {getStudentArchiveStatus(selectedStudent)
                                  .accountStatus || "Unknown"}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : //MINI PROFILE
                selectedTeacher ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleBackClick}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors font-kumbh text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to list
                    </button>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-kumbh border-b pb-3 border-gray-200 dark:border-gray-700">
                      Advisor Information
                    </h3>

                    <div className="flex justify-center mb-6">
                      <img
                        src={getTeacherProfilePicture()}
                        alt={teacher.name}
                        className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
                        onError={(e) => {
                          e.target.src = getAvatarUrl(teacher.name, "teacher");
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Name
                        </label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-kumbh">
                          {teacher.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Teacher ID
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-kumbh">
                          {teacher.id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-kumbh block mb-1 uppercase tracking-wide">
                          Subject Specialization
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-kumbh">
                          {getTeacherSubject()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-kumbh border-b pb-3 border-gray-200 dark:border-gray-700">
                      Advisor
                    </h3>
                    <div
                      onClick={handleTeacherClick}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-6 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 text-center group"
                    >
                      <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                        <img
                          src={getTeacherProfilePicture()}
                          alt={teacher.name}
                          className="w-20 h-20 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = getAvatarUrl(
                              teacher.name,
                              "teacher"
                            );
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white font-kumbh text-lg mb-2">
                        {teacher.name}
                      </h4>
                      {isLoadingTeacher ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Loading subject...
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-kumbh mb-4">
                          {getTeacherSubject()}
                        </p>
                      )}
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-kumbh bg-gray-100 dark:bg-gray-700 rounded-full py-1 px-3 inline-block group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                        Click to view details
                      </p>
                    </div>
                    <div className="mt-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-kumbh">
                        Click on a student to view their details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with View Class Schedule and View Attendance buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              View Class Schedule
            </button>
            <button
              onClick={() => setShowAttendanceModal(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              View Attendance
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <SectionClassScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          section={section}
          gradeLevel={gradeLevel}
        />
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <SectionAttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => setShowAttendanceModal(false)}
          section={section}
          gradeLevel={gradeLevel}
        />
      )}
    </>
  );
};

export default ViewSectionModal;
