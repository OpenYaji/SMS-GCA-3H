import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import AnnouncementForm from "../components/announcements/AnnouncementForm";
import AnnouncementCard from "../components/announcements/AnnouncementCard";
import AnnouncementModal from "../components/announcements/AnnouncementModal";
import Tabs from "../components/announcements/Tabs";
import ErrorModal from "../components/ErrorModal";
import { Calendar, Filter } from "lucide-react";
import announcementService from "../services/announcementService";
import DefaultBanner from "../assets/images/DefaultBanner.jpg";

const Announcements = () => {
  const { isDarkMode } = useOutletContext();

  const [announcements, setAnnouncements] = useState([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    error: null,
  });
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormData, setCurrentFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    type: null,
    id: null,
  });

  const categoryDropdownRef = React.useRef(null);

  // Tab configuration
  const tabs = [
    { id: "active", label: "Active Announcements" },
    { id: "archived", label: "Archived Announcements" },
  ];

  // Category options
  const categoryOptions = [
    { value: "All", label: "All Categories" },
    { value: "Academic", label: "Academic" },
    { value: "Events", label: "Events" },
    { value: "General", label: "General" },
  ];

  const currentCategory =
    categoryOptions.find((opt) => opt.value === selectedCategory) ||
    categoryOptions[0];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch both active and archived announcements
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const activeResponse = await announcementService.getAnnouncements();
      const archivedResponse =
        await announcementService.getArchivedAnnouncements();

      const activeDataArray = activeResponse.data || activeResponse;
      const normalizedActiveData = (
        Array.isArray(activeDataArray) ? activeDataArray : []
      ).map((announcement) => {
        const id =
          announcement.AnnouncementID || announcement.id || announcement.Id;

        if (!id) {
          console.warn("Announcement without ID found:", announcement);
        }

        const normalizedAnnouncement = {
          ...announcement,
          id: id,
          Id: id,
          AnnouncementID: id,
        };

        if (!normalizedAnnouncement.BannerURL) {
          normalizedAnnouncement.defaultBannerPreview = DefaultBanner;
        }

        return normalizedAnnouncement;
      });

      const archivedDataArray = archivedResponse.data || archivedResponse;
      const normalizedArchivedData = (
        Array.isArray(archivedDataArray) ? archivedDataArray : []
      ).map((announcement) => {
        const id =
          announcement.AnnouncementID || announcement.id || announcement.Id;

        if (!id) {
          console.warn("Announcement without ID found:", announcement);
        }

        const normalizedAnnouncement = {
          ...announcement,
          id: id,
          Id: id,
          AnnouncementID: id,
        };

        if (!normalizedAnnouncement.BannerURL) {
          normalizedAnnouncement.defaultBannerPreview = DefaultBanner;
        }

        return normalizedAnnouncement;
      });

      console.log("Normalized active announcements:", normalizedActiveData);
      console.log("Normalized archived announcements:", normalizedArchivedData);

      setAnnouncements(normalizedActiveData);
      setArchivedAnnouncements(normalizedArchivedData);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort announcements: pinned first, then by recency
  const getSortedAnnouncements = (announcementsList) => {
    return [...announcementsList].sort((a, b) => {
      if (a.IsPinned && !b.IsPinned) return -1;
      if (!a.IsPinned && b.IsPinned) return 1;
      const dateA = new Date(a.PublishDate || a.createdAt || a.date);
      const dateB = new Date(b.PublishDate || b.createdAt || b.date);
      return dateB - dateA;
    });
  };

  // Filter announcements by category
  const getFilteredAnnouncements = (announcementsList) => {
    if (selectedCategory === "All") {
      return announcementsList;
    }
    return announcementsList.filter(
      (announcement) => announcement.Category === selectedCategory
    );
  };

  const openModal = (type, data = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
    setActionLoading({ type: null, id: null });
  };

  const handleError = (error) => {
    console.error("API Error:", error);
    setErrorModal({
      isOpen: true,
      error: error,
    });
    setActionLoading({ type: null, id: null });
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, error: null });
  };

  const handleOpenConfirm = (formData) => {
    setCurrentFormData(formData);
    openModal("confirm");
  };

  const handlePostAnnouncement = async (announcementData) => {
    setIsSubmitting(true);
    setActionLoading({ type: "post", id: null });

    try {
      const hasBannerImage =
        announcementData.banner && announcementData.banner instanceof File;
      const { useDefaultBanner, ...apiData } = announcementData;
      const result = await announcementService.createAnnouncement(apiData);

      const postedAnnouncement = result.data || result;
      const announcementId =
        postedAnnouncement.AnnouncementID || postedAnnouncement.id;
      if (!hasBannerImage && announcementId) {
        try {
          const freshData = await announcementService.getAnnouncementById(
            announcementId
          );
          const fullAnnouncement = freshData.data || freshData;
          const announcementWithDefaultBanner = {
            ...fullAnnouncement,
            id: announcementId,
            Id: announcementId,
            AnnouncementID: announcementId,
            defaultBannerPreview: DefaultBanner,
          };

          setAnnouncements((prev) => {
            const filtered = prev.filter((ann) => ann.id !== announcementId);
            return [announcementWithDefaultBanner, ...filtered];
          });
        } catch (fetchError) {
          console.error("Error fetching posted announcement:", fetchError);
          await fetchAnnouncements();
        }
      } else {
        await fetchAnnouncements();
      }

      // Reset form
      setShouldResetForm(true);
      closeModal();
      openModal("success", { action: "posted" });
    } catch (error) {
      console.error("Failed to post announcement:", error);
      handleError(error);
    } finally {
      setIsSubmitting(false);
      setActionLoading({ type: null, id: null });
    }
  };

  const handleEditAnnouncement = async (updatedData) => {
    setActionLoading({ type: "edit", id: updatedData.id });

    try {
      console.log("📝 Updating announcement...", updatedData);

      const announcementId = updatedData.id;
      if (!announcementId) {
        throw new Error("No announcement ID provided for update");
      }
      const { id, ...updatePayload } = updatedData;

      console.log("Sending update to API:", updatePayload);
      const result = await announcementService.updateAnnouncement(
        announcementId,
        updatePayload
      );

      console.log("Announcement updated successfully:", result);

      const freshData = await announcementService.getAnnouncementById(
        announcementId
      );
      const updatedAnnouncement = freshData.data || freshData;

      const normalizedUpdate = {
        ...updatedAnnouncement,
        id: announcementId,
        Id: announcementId,
        AnnouncementID: announcementId,
      };

      // Add default banner if no BannerURL
      if (!normalizedUpdate.BannerURL) {
        normalizedUpdate.defaultBannerPreview = DefaultBanner;
      }

      if (activeTab === "active") {
        setAnnouncements((prev) =>
          prev.map((ann) =>
            ann.id === announcementId ? normalizedUpdate : ann
          )
        );
      } else {
        setArchivedAnnouncements((prev) =>
          prev.map((ann) =>
            ann.id === announcementId ? normalizedUpdate : ann
          )
        );
      }

      closeModal();
      openModal("success", { action: "updated" });
    } catch (error) {
      console.error("Failed to update announcement:", error);
      handleError(error);
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const handleArchiveAnnouncement = async (announcementId) => {
    setActionLoading({ type: "archive", id: announcementId });

    try {
      console.log("Archiving announcement...");
      const result = await announcementService.archiveAnnouncement(
        announcementId
      );
      console.log("Announcement archived successfully:", result);

      const announcementToArchive = announcements.find(
        (ann) => ann.id === announcementId
      );
      if (announcementToArchive) {
        setAnnouncements((prev) =>
          prev.filter((ann) => ann.id !== announcementId)
        );
        setArchivedAnnouncements((prev) => [
          ...prev,
          { ...announcementToArchive, IsActive: false },
        ]);
      }

      closeModal();
      openModal("success", { action: "archived" });
    } catch (error) {
      console.error("Failed to archive announcement:", error);
      handleError(error);
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const handleRestoreAnnouncement = async (announcementId) => {
    setActionLoading({ type: "restore", id: announcementId });

    try {
      console.log("Restoring announcement...");
      const result = await announcementService.restoreAnnouncement(
        announcementId
      );
      console.log("Announcement restored successfully:", result);

      const announcementToRestore = archivedAnnouncements.find(
        (ann) => ann.id === announcementId
      );
      if (announcementToRestore) {
        setArchivedAnnouncements((prev) =>
          prev.filter((ann) => ann.id !== announcementId)
        );
        setAnnouncements((prev) => [
          ...prev,
          { ...announcementToRestore, IsActive: true },
        ]);
      }

      closeModal();
      openModal("success", { action: "restored" });
    } catch (error) {
      console.error("Failed to restore announcement:", error);
      handleError(error);
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const handleTogglePin = async (announcementId, currentPinStatus) => {
    if (!announcementId) {
      console.error("Invalid announcement ID for pin toggle");
      handleError(new Error("Invalid announcement ID"));
      return;
    }

    setActionLoading({ type: "pin", id: announcementId });
    const newPinStatus = !currentPinStatus;

    try {
      await announcementService.togglePinAnnouncement(
        announcementId,
        newPinStatus
      );

      if (activeTab === "active") {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((ann) =>
            ann.id === announcementId ? { ...ann, IsPinned: newPinStatus } : ann
          )
        );
      } else {
        setArchivedAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((ann) =>
            ann.id === announcementId ? { ...ann, IsPinned: newPinStatus } : ann
          )
        );
      }
    } catch (error) {
      console.error(
        `Failed to ${newPinStatus ? "pin" : "unpin"} announcement:`,
        error
      );

      if (activeTab === "active") {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((ann) =>
            ann.id === announcementId
              ? { ...ann, IsPinned: currentPinStatus }
              : ann
          )
        );
      } else {
        setArchivedAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((ann) =>
            ann.id === announcementId
              ? { ...ann, IsPinned: currentPinStatus }
              : ann
          )
        );
      }

      handleError(error);
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const handleConfirmPost = async (type, data) => {
    if (type !== "post") return;
    if (currentFormData) {
      await handlePostAnnouncement(currentFormData);
    }
  };

  const displayedAnnouncements =
    activeTab === "active" ? announcements : archivedAnnouncements;

  const filteredAnnouncements = getFilteredAnnouncements(
    displayedAnnouncements
  );
  const sortedAnnouncements = getSortedAnnouncements(filteredAnnouncements);

  useEffect(() => {
    if (shouldResetForm) {
      const timer = setTimeout(() => {
        setShouldResetForm(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldResetForm]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.value);
    setIsCategoryOpen(false);
  };

  return (
    <div
      className={`min-h-screen pl-6 pr-6 pb-6 pt-3 ${
        isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
      }`}
    >
      {/* Header Banner */}
      <div
        className={`rounded-3xl px-8 py-3 mb-6 mt-1 shadow-md ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-700 to-gray-800"
            : "bg-gradient-to-r from-yellow-500 to-yellow-400"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
              Announcements
            </h1>
            <p className="text-white font-regular font-spartan text-[1.1em]">
              Here are the announcements at Gymnazo Christian Academy -
              Novaliches now
            </p>
          </div>
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-1 ${
          isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
        }`}
      >
        {/* Announcement Form */}
        <div
          className={`rounded-2xl p-0 shadow-lg mt-6 mb-8 border-solid ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <AnnouncementForm
            onOpenConfirm={handleOpenConfirm}
            onError={handleError}
            resetForm={shouldResetForm}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Tabs and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          {/* Tabs Component */}
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

          <div
            className="flex items-center gap-2 mb-6"
            ref={categoryDropdownRef}
          >
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="relative z-40">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors min-w-[160px] justify-between text-sm font-kumbh ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{currentCategory.label}</span>
                <span
                  className={`transition-transform flex-shrink-0 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } ${isCategoryOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {isCategoryOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
                  {" "}
                  {categoryOptions.map((category) => (
                    <li
                      key={category.value}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm font-kumbh ${
                        selectedCategory === category.value
                          ? isDarkMode
                            ? "bg-yellow-600 text-white"
                            : "bg-yellow-50 text-yellow-700"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        {isLoading ? (
          <div
            className={`col-span-full rounded-2xl p-16 text-center shadow-sm ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 border-4 rounded-full animate-spin ${
                isDarkMode
                  ? "border-gray-600 border-t-yellow-500"
                  : "border-gray-200 border-t-yellow-500"
              }`}
            ></div>
            <p
              className={`font-spartan text-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Loading announcements...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedAnnouncements.length > 0 ? (
              sortedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isArchived={activeTab === "archived"}
                  onView={(data) => openModal("view", data)}
                  onEdit={(data) => openModal("edit", data)}
                  onArchive={() => openModal("archive-confirm", announcement)}
                  onRestore={() => openModal("restore-confirm", announcement)}
                  onTogglePin={() =>
                    handleTogglePin(announcement.id, announcement.IsPinned)
                  }
                  isSubmitting={isSubmitting}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <div
                className={`col-span-full rounded-2xl p-16 text-center shadow-sm ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <Calendar
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p
                  className={`font-league-spartan text-xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {activeTab === "active"
                    ? selectedCategory === "All"
                      ? "No active announcements at this time"
                      : `No ${selectedCategory.toLowerCase()} announcements at this time`
                    : selectedCategory === "All"
                    ? "No archived announcements"
                    : `No archived ${selectedCategory.toLowerCase()} announcements`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Consolidated Modal */}
      <AnnouncementModal
        darkMode={isDarkMode}
        isOpen={modalState.isOpen}
        type={modalState.type}
        data={modalState.data}
        onClose={closeModal}
        onConfirm={(action, data) => {
          switch (action) {
            case "post":
              handleConfirmPost(action, data);
              break;
            case "edit":
              handleEditAnnouncement(data);
              break;
            case "archive":
              handleArchiveAnnouncement(data.id);
              break;
            case "restore":
              handleRestoreAnnouncement(data.id);
              break;
            default:
              closeModal();
          }
        }}
        actionLoading={actionLoading}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        error={errorModal.error}
        title="Operation Failed"
      />
    </div>
  );
};

export default Announcements;
