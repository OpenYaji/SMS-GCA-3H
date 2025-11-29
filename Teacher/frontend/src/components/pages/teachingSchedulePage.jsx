import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../common/Breadcrumb';
import MySchedule from '../schedules/MySchedule';
import TeacherSchedules from '../schedules/TeacherSchedules';
import EditScheduleModal from '../schedules/EditScheduleModal';
import CreateScheduleModal from '../schedules/CreateScheduleModal';
import AddClassModal from '../schedules/AddClassModal';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { canManageAllSchedules } from '../../utils/permissions';

const TeachingSchedulePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userCanManageAllSchedules = canManageAllSchedules(user);

  const [activeTab, setActiveTab] = useState('my-schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sectionsData, setSectionsData] = useState([]);
  const [activeSchoolYear, setActiveSchoolYear] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [editFormData, setEditFormData] = useState({
    teacher: '',
    subject: '',
    day: '',
    time: '',
    room: ''
  });

  const [addClassFormData, setAddClassFormData] = useState({
    teacherId: '',
    gradeLevelId: '',
    sectionId: '',
    roomNumber: '',
    classShift: 'Morning',
    teachers: []
  });

  const [teacherSections, setTeacherSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    teacher: '',
    gradeSection: '',
    day: 'Monday to Friday',
    schedule: []
  });

  // initial fetch
  useEffect(() => {
    fetchOptions();
  }, []);

  // fetch schedules when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // keep addClassFormData teachers updated
  useEffect(() => {
    setAddClassFormData(prev => ({ ...prev, teachers }));
  }, [teachers]);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-options.php',
        { withCredentials: true }
      );

      if (response.data?.success) {
        setGradeLevels(response.data.data.gradeLevels || []);
        setSubjects(response.data.data.subjects || []);
        setActiveSchoolYear(response.data.data.activeSchoolYear || null);
        setTeachers(response.data.data.teachers || []);
      } else {
        toast.error('Failed to load form options');
      }
    } catch (err) {
      console.error('Error fetching options:', err?.response || err);
      toast.error('Error loading grade levels and subjects');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'my-schedule') {
        const response = await axios.get(
          'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-my-schedule.php',
          { withCredentials: true }
        );
        if (response.data?.success) {
          setSchedules(response.data.data || []);
        } else {
          setError(response.data?.message || 'Failed to load schedules');
          toast.error(response.data?.message || 'Failed to load schedules');
        }
      } else {
        const response = await axios.get(
          'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-all-schedules.php',
          { withCredentials: true }
        );
        if (response.data?.success) {
          setTeacherSchedules(response.data.data || []);
        } else {
          setError(response.data?.message || 'Failed to load schedules');
          toast.error(response.data?.message || 'Failed to load schedules');
        }
      }
    } catch (err) {
      console.error('Error fetching schedules:', err?.response || err);
      const errorMessage = err?.response?.data?.message || 'Failed to load schedules. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      setSectionsData([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-sections-with-students.php?gradeLevelId=${gradeLevelId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        const sections = response.data.data[0]?.sections || [];
        setSectionsData(sections);
      } else {
        setSectionsData([]);
        toast.error(response.data?.message || 'Failed to load sections');
      }
    } catch (err) {
      console.error('Error fetching sections:', err?.response || err);
      setSectionsData([]);
      toast.error(err?.response?.data?.message || 'Failed to load sections');
    }
  };

  const fetchTeacherSections = async (teacherId) => {
    if (!teacherId) {
      setTeacherSections([]);
      setSelectedSection(null);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-teacher-sections.php?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setTeacherSections(response.data.data || []);
        if ((response.data.data || []).length > 0) {
          setSelectedSection(response.data.data[0]);
        }
      } else {
        setTeacherSections([]);
        toast.error(response.data?.message || 'Failed to load teacher sections');
      }
    } catch (err) {
      console.error('Error fetching teacher sections:', err?.response || err);
      toast.error('Failed to load teacher sections');
      setTeacherSections([]);
    }
  };

  const toggleFavorite = (scheduleId, sectionId) => {
    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? {
            ...schedule,
            sections: schedule.sections.map(section =>
              section.id === sectionId ? { ...section, isFavorite: !section.isFavorite } : section
            )
          }
          : schedule
      )
    );
  };

  const handleSectionClick = (grade, section, action = 'schedule') => {
    if (action === 'emergency') {
      navigate('/teacher-dashboard/emergency-dismissal', {
        state: {
          schedule: {
            scheduleId: section.id,
            sectionId: section.id,
            gradeLevel: grade.grade.replace('Grade ', ''),
            section: section.name.replace('Section ', ''),
            subject: 'All Classes',
            teacher: user?.firstName + ' ' + user?.lastName,
            day: 'Monday',
            startTime: '8:00 AM',
            endTime: '5:00 PM',
            room: section.room
          }
        }
      });
      return;
    }

    setSelectedSection(section);
    setCreateFormData({
      teacher: user?.teacherProfileId || '',
      gradeSection: section.id,
      sectionName: section.name,
      gradeName: grade.grade,
      day: 'Monday to Friday',
      schedule: []
    });
    setIsCreateModalOpen(true);
  };

  const breadcrumbItems = [{ label: 'Teaching Schedule', path: '/teacher-dashboard/teaching-schedule' }];

  const filteredSchedules = schedules.filter(schedule =>
    (schedule.grade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.adviser || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.sections || []).some(section =>
      (section.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (section.room || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredTeacherSchedules = teacherSchedules.filter(schedule =>
    (schedule.teacher || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.day || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.room || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setEditFormData({
      teacher: schedule.teacher || '',
      subject: schedule.subject || '',
      day: schedule.day || '',
      time: schedule.time || '',
      room: schedule.room || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.teacher || !editFormData.subject || !editFormData.day || !editFormData.time || !editFormData.room) {
      alert('Please fill in all fields');
      return;
    }

    setTeacherSchedules(prev => prev.map(s => (s.id === editingSchedule.id ? { ...s, ...editFormData } : s)));
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    setEditFormData({ teacher: '', subject: '', day: '', time: '', room: '' });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    setEditFormData({ teacher: '', subject: '', day: '', time: '', room: '' });
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/delete-schedule.php',
        { scheduleId },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success('Schedule deleted successfully!');
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error deleting schedule. Please try again.');
    }
  };

  const handleAddClass = () => {
    setAddClassFormData(prev => ({ ...prev, teachers: teachers || [] }));
    setIsAddClassModalOpen(true);
  };

  const handleCancelAddClass = () => {
    setIsAddClassModalOpen(false);
    setAddClassFormData({ teacherId: '', gradeLevelId: '', sectionId: '', roomNumber: '', classShift: 'Morning', teachers: teachers || [] });
    setSectionsData([]);
  };

  const handleSubmitAddClass = async (e) => {
    e.preventDefault();

    if (!addClassFormData.teacherId) {
      toast.error('Please select a teacher');
      return;
    }

    if (!addClassFormData.sectionId) {
      toast.error('Please select a section');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/assign-teacher-to-section.php',
        {
          teacherId: addClassFormData.teacherId,
          sectionId: addClassFormData.sectionId,
          roomNumber: addClassFormData.roomNumber || 'TBD',
          classShift: addClassFormData.classShift || 'Morning'
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Assigned successfully');
        handleCancelAddClass();
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to assign section');
      }
    } catch (err) {
      console.error('Error assigning section:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error assigning section. Please try again.');
    }
  };

  const handleCreateSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      toast.error('Please select a grade level first');
      return;
    }

    if (!activeSchoolYear?.id) {
      toast.error('No active school year found. Please contact administrator.');
      return;
    }

    const theme = getSectionTheme(parseInt(gradeLevelId, 10));
    const themeText = `${theme.name} (${theme.sections})`;

    if (!window.confirm(`This will create 5 sections with theme: ${themeText}. Continue?`)) return;

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/create-sections.php',
        { gradeLevelId, schoolYearId: activeSchoolYear.id },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Sections created');
        fetchSectionsForGrade(gradeLevelId);
      } else {
        toast.error(response.data?.message || 'Failed to create sections');
      }
    } catch (err) {
      console.error('Error creating sections:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error creating sections. Please try again.');
    }
  };

  const getSectionTheme = (gradeLevelId) => {
    const themes = {
      1: { name: 'Flowers', sections: 'Rose, Lily, Tulip, Daisy, Sunflower' },
      2: { name: 'Philippine Animals', sections: 'Tarsier, Carabao, Tamaraw, Philippine Eagle, Pawikan' },
      3: { name: 'Philippine National Heroes', sections: 'Rizal, Bonifacio, Mabini, Del Pilar, Luna' },
      4: { name: 'Rocks and Stones', sections: 'Granite, Marble, Limestone, Sandstone, Basalt' },
      5: { name: 'Different Clouds', sections: 'Cumulus, Stratus, Cirrus, Nimbus, Altostratus' },
      6: { name: 'Elements in Periodic Table', sections: 'Oxygen, Hydrogen, Carbon, Nitrogen, Helium' }
    };
    return themes[gradeLevelId] || themes[1];
  };

  const handleCreateSchedule = () => setIsCreateModalOpen(true);

  const handleTeacherChange = async (teacherId) => {
    setCreateFormData(prev => ({ ...prev, teacher: teacherId, gradeSection: '', sectionId: '', schedule: [] }));
    await fetchTeacherSections(teacherId);
  };

  const handleSectionChange = async (sectionId) => {
    const selectedSectionData = teacherSections.find(s => s.id === parseInt(sectionId, 10));

    if (!selectedSectionData) {
      setCreateFormData(prev => ({ ...prev, sectionId: '', gradeSection: '', schedule: [] }));
      return;
    }

    setCreateFormData(prev => ({ ...prev, sectionId: sectionId, gradeSection: `${selectedSectionData.gradeLevel} - Section ${selectedSectionData.sectionName}` }));

    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-section-schedule.php?sectionId=${sectionId}`,
        { withCredentials: true }
      );

      if (response.data?.success && (response.data.data?.schedule || []).length > 0) {
        setCreateFormData(prev => ({ ...prev, schedule: response.data.data.schedule }));
      } else {
        setCreateFormData(prev => ({ ...prev, schedule: [] }));
      }
    } catch (err) {
      console.error('Error fetching section schedule:', err?.response || err);
      setCreateFormData(prev => ({ ...prev, schedule: [] }));
    }
  };

  const fetchTeacherScheduleDetail = async (teacherId) => {
    if (!teacherId) return;
    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/get-teacher-schedule-detail.php?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        const scheduleData = response.data.data;
        setCreateFormData(prev => ({
          ...prev,
          gradeSection: scheduleData.gradeSection,
          day: scheduleData.day,
          schedule: scheduleData.schedule,
          teacherProfileId: scheduleData.teacherProfileId,
          sectionId: scheduleData.sectionId
        }));
      }
    } catch (err) {
      console.error('Error fetching teacher schedule detail:', err?.response || err);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ teacher: '', gradeSection: '', day: 'Monday to Friday', schedule: [] });
    setTeacherSections([]);
    setSelectedSection(null);
  };

  const handleSubjectChange = (index, subjectId) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], subject: subjectId };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleAddTimeSlot = () => {
    setCreateFormData(prev => ({ ...prev, schedule: [...prev.schedule, { startTime: '', endTime: '', subject: '' }] }));
  };

  const handleRemoveTimeSlot = (index) => {
    const newSchedule = createFormData.schedule.filter((_, i) => i !== index);
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleTimeChange = (index, field, time) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: time };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleGradeLevelChange = async (gradeLevelId) => {
    setCreateFormData(prev => ({ ...prev, gradeLevelId, sectionId: '', gradeSection: '', schedule: [] }));
    await fetchSectionsForGrade(gradeLevelId);
  };

  const handleSlotTeacherChange = (index, teacherId) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], teacherId };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();

    if (!createFormData.teacher) {
      toast.error('Please select a teacher');
      return;
    }

    if (!createFormData.teacherProfileId || !createFormData.sectionId) {
      toast.error('Teacher has no assigned section. Please assign a section first.');
      return;
    }

    if (createFormData.schedule.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    const incompleteSlot = createFormData.schedule.find(slot => !slot.startTime || !slot.endTime || !slot.subject);
    if (incompleteSlot) {
      toast.error('Please fill in start time, end time, and subject for all time slots');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Teacher/backend/api/schedules/submit-schedule.php',
        {
          teacherProfileId: createFormData.teacherProfileId,
          sectionId: createFormData.sectionId,
          day: createFormData.day,
          schedule: createFormData.schedule
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Schedule saved');
        handleCancelCreate();
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to save schedule');
      }
    } catch (err) {
      console.error('Error submitting schedule:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error saving schedule. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 w-full">
      <Toaster position="top-right" />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {activeTab === 'my-schedule' ? 'Teaching Schedule' : 'Teacher Schedules'}
        </h1>
        {activeTab === 'my-schedule' && <p className="text-lg text-orange-600">Overview</p>}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab('my-schedule');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'my-schedule' ? 'bg-amber-300 text-gray-900' : 'bg-transparent text-gray-900 dark:text-white border'
              }`}
          >
            My Class Schedule
          </button>

          {userCanManageAllSchedules && (
            <button
              onClick={() => {
                setActiveTab('teacher-schedules');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'teacher-schedules' ? 'bg-amber-300 text-gray-900' : 'bg-transparent text-gray-900 dark:text-white border'
                }`}
            >
              Teacher Schedules
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row items-center">
          <div className="flex items-center gap-2">
            {activeTab === 'my-schedule' && (
              <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
                <span className="text-xs md:text-sm font-medium">Add filter</span>
                <Filter className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === 'my-schedule' ? 'Search...' : 'Search teacher, subject...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} title="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {activeTab === 'my-schedule' && userCanManageAllSchedules && (
              <button onClick={handleAddClass} className="px-4 py-2 bg-amber-300 rounded-xl font-medium">
                + Add New Class
              </button>
            )}

            {activeTab === 'teacher-schedules' && userCanManageAllSchedules && (
              <button onClick={handleCreateSchedule} className="px-4 py-2 bg-amber-300 rounded-xl font-medium">
                Create Schedule
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {activeTab === 'my-schedule'
              ? `Found ${filteredSchedules.length} schedule(s) matching "${searchQuery}"`
              : `Found ${filteredTeacherSchedules.length} schedule(s) matching "${searchQuery}"`}
          </div>
        )}
      </div>

      <div>
        {activeTab === 'my-schedule' ? (
          <MySchedule
            schedules={filteredSchedules}
            loading={loading}
            onToggleFavorite={toggleFavorite}
            onSectionClick={handleSectionClick}
          />
        ) : (
          <TeacherSchedules
            schedules={filteredTeacherSchedules}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <EditScheduleModal
        isOpen={isEditModalOpen}
        schedule={editingSchedule}
        formData={editFormData}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        onChange={setEditFormData}
      />

      <AddClassModal
        isOpen={isAddClassModalOpen}
        formData={addClassFormData}
        gradeLevels={gradeLevels}
        sectionsData={sectionsData}
        activeSchoolYear={activeSchoolYear}
        onClose={handleCancelAddClass}
        onSubmit={handleSubmitAddClass}
        onChange={setAddClassFormData}
        onGradeLevelChange={(gradeLevelId) => {
          setAddClassFormData(prev => ({ ...prev, gradeLevelId }));
          fetchSectionsForGrade(gradeLevelId);
        }}
        onCreateSections={handleCreateSectionsForGrade}
        getSectionTheme={getSectionTheme}
      />

      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        formData={createFormData}
        teachers={teachers}
        subjects={subjects}
        teacherSections={teacherSections}
        onClose={handleCancelCreate}
        onSubmit={handleSubmitSchedule}
        onTeacherChange={handleTeacherChange}
        onSectionChange={handleSectionChange}
        onSubjectChange={handleSubjectChange}
        onAddTimeSlot={handleAddTimeSlot}
        onRemoveTimeSlot={handleRemoveTimeSlot}
        onTimeChange={handleTimeChange}
        onGradeLevelChange={handleGradeLevelChange}
        onSlotTeacherChange={handleSlotTeacherChange}
      />
    </div>
  );
};

export default TeachingSchedulePage;
