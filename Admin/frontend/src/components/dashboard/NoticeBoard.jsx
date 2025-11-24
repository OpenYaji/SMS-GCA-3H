import { useState } from "react";
import AnnouncementModal from "../announcements/AnnouncementModal";

export default function NoticeBoard({ announcements, darkMode }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "view",
    data: null,
  });

  const openAnnouncementModal = (announcement) => {
    // Transform the announcement data to match what AnnouncementModal expects
    const modalData = {
      id: announcement.AnnouncementID,
      title: announcement.Title,
      content: announcement.Content,
      fullContent: announcement.Content,
      date: announcement.PublishDate,
      meta: announcement.TargetAudience,
      image: announcement.BannerURL,
      BannerURL: announcement.BannerURL,
      IsPinned: announcement.IsPinned,
      IsActive: announcement.IsActive,
      ExpiryDate: announcement.ExpiryDate,
      TargetAudience: announcement.TargetAudience,
      status: announcement.IsActive ? "Active" : "Inactive",
    };

    setModalState({
      isOpen: true,
      type: "view",
      data: modalData,
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  //only first 3 announcements
  const displayedAnnouncements = announcements ? announcements.slice(0, 3) : [];

  return (
    <>
      <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
        <div className="card-header">
          <h3 className="card-title">Notice Board</h3>
          <button className="card-menu">⋯</button>
        </div>
        <div className="notice-list">
          {displayedAnnouncements.length > 0 ? (
            displayedAnnouncements.map((announcement, i) => (
              <div
                key={i}
                className="notice-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => openAnnouncementModal(announcement)}
              >
                <div className="notice-image">
                  {announcement.BannerURL ? (
                    <img
                      src={announcement.BannerURL}
                      alt={announcement.Title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback icon if no image or image fails to load */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                      !announcement.BannerURL ? "flex" : "hidden"
                    } bg-gray-200 dark:bg-gray-600`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 20 20"
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <path
                        fill="currentColor"
                        d="M3 6c0-1.1.9-2 2-2h8l4-4h2v16h-2l-4-4H5a2 2 0 0 1-2-2H1V6zm8 9v5H8l-1.67-5H5v-2h8v2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="notice-content">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {announcement.Title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {announcement.Content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(announcement.PublishDate)}
                    </span>
                    {announcement.IsPinned && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                        Pinned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 20 20"
                  className="text-gray-400 dark:text-gray-500"
                >
                  <path
                    fill="currentColor"
                    d="M3 6c0-1.1.9-2 2-2h8l4-4h2v16h-2l-4-4H5a2 2 0 0 1-2-2H1V6zm8 9v5H8l-1.67-5H5v-2h8v2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No pinned announcements
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        data={modalState.data}
        onClose={closeModal}
        onConfirm={closeModal}
        actionLoading={{ type: null, id: null }}
        darkMode={darkMode}
      />
    </>
  );
}
