import React, { useState, useEffect, useRef } from "react";
import {
  Edit2,
  Archive,
  Pin,
  PinOff,
  RotateCcw,
  Loader,
  Tag,
} from "lucide-react";
import DefaultBanner from "../../assets/images/DefaultBanner.jpg";

const AnnouncementCard = ({
  announcement,
  isArchived,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onTogglePin,
  isSubmitting = false,
  actionLoading = { type: null, id: null },
}) => {
  const [showTooltip, setShowTooltip] = useState({
    edit: false,
    archive: false,
    restore: false,
    pin: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);

  const announcementId =
    announcement.id || announcement.AnnouncementID || announcement.Id;
  const isPinned = Boolean(announcement.IsPinned);

  const isCardLoading = actionLoading.id === announcementId;
  const isLoadingType = actionLoading.type;

  useEffect(() => {
    if (isLoadingType === "pin" && isCardLoading) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoadingType, isCardLoading]);

  React.useEffect(() => {
    if (!announcementId) {
      console.error(
        "AnnouncementCard: Missing ID for announcement:",
        announcement
      );
    }
  }, [announcementId, announcement]);

  const getDisplayData = () => {
    return {
      id: announcementId,
      title: announcement.Title || announcement.title,
      content: announcement.Content || announcement.content,
      summary: announcement.Summary || announcement.summary,
      category: announcement.Category || "General",
      date: formatDate(announcement.PublishDate || announcement.date),
      meta: announcement.TargetAudience || announcement.meta,
      status: getStatus(announcement),
      image: getImage(announcement),
      fullContent:
        announcement.Content ||
        announcement.fullContent ||
        announcement.content,
      signature: announcement.signature || "— School Administration",
      originalData: { ...announcement, id: announcementId },
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();
    } catch (error) {
      return dateString;
    }
  };

  const getStatus = (announcement) => {
    if (announcement.IsActive === false || announcement.isArchived) {
      return "Archived";
    }
    if (announcement.IsPinned) {
      return "Pinned";
    }
    return null;
  };

  const getImage = (announcement) => {
    if (announcement.BannerURL) {
      return announcement.BannerURL;
    }

    if (announcement.defaultBannerPreview) {
      return announcement.defaultBannerPreview;
    }
    if (announcement.attachments && announcement.attachments.length > 0) {
      const firstImage = announcement.attachments.find(
        (att) => att.type === "image" || att.fileType?.includes("image")
      );
      if (firstImage?.preview || firstImage?.url) {
        return firstImage.preview || firstImage.url;
      }
    }
    return DefaultBanner;
  };
  const displayData = getDisplayData();

  const handleEdit = (e) => {
    e.stopPropagation();
    if (!isCardLoading) {
      onEdit(displayData.originalData);
    }
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    if (!isCardLoading) {
      onArchive();
    }
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    if (!isCardLoading) {
      onRestore();
    }
  };

  const handleTogglePin = (e) => {
    e.stopPropagation();
    if (!isCardLoading) {
      onTogglePin();
    }
  };

  const handleView = () => {
    if (!isCardLoading) {
      onView(displayData);
    }
  };

  const toggleTooltip = (tooltip, show) => {
    if (!isCardLoading) {
      setShowTooltip((prev) => ({
        ...prev,
        [tooltip]: show,
      }));
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleView}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-60 hover:shadow-lg 
        transition-all duration-600 ease-in-out hover:-translate-y-1 
        cursor-pointer font-spartan group relative
        ${isCardLoading ? "opacity-60 pointer-events-none" : ""}
        ${isAnimating ? "transform-gpu scale-105 shadow-xl z-10" : ""}
        ${
          (actionLoading.type === "archive" &&
            actionLoading.id === announcementId) ||
          (actionLoading.type === "restore" &&
            actionLoading.id === announcementId)
            ? "animate-pulse"
            : ""
        }
      `}
      style={{
        transition: isAnimating
          ? "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "all 0.3s ease-in-out",
      }}
    >
      {/* Loading Overlay */}
      {isCardLoading && isLoadingType !== "pin" && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 rounded-xl z-10 flex items-center justify-center">
          <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
        </div>
      )}

      {/* Pin Loading Overlay */}
      {isCardLoading && isLoadingType === "pin" && (
        <div className="absolute inset-0 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 bg-opacity-50 rounded-xl z-5 flex items-center justify-center">
          <Loader className="w-4 h-4 text-yellow-500 animate-spin" />
        </div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-[16/9] bg-[#d3d3d3] dark:bg-gray-700 overflow-hidden rounded-t-xl">
        <img
          src={displayData.image}
          alt="Announcement"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* Pin/Unpin Button  */}
          {!isArchived && (
            <div className="relative">
              <button
                onClick={handleTogglePin}
                onMouseEnter={() => toggleTooltip("pin", true)}
                onMouseLeave={() => toggleTooltip("pin", false)}
                onFocus={() => toggleTooltip("pin", true)}
                onBlur={() => toggleTooltip("pin", false)}
                disabled={isCardLoading}
                className={`p-1.5 transition-all duration-200 rounded-full group ${
                  isPinned
                    ? "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 border border-yellow-300 dark:border-yellow-600"
                    : "text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                } ${isCardLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isPinned ? "Unpin announcement" : "Pin announcement"}
              >
                {isCardLoading && isLoadingType === "pin" ? (
                  <Loader className="w-3.5 h-3.5 animate-spin text-yellow-600 dark:text-yellow-400" />
                ) : isPinned ? (
                  <Pin className="w-3.5 h-3.5 fill-yellow-500 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <PinOff className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {showTooltip.pin && !isCardLoading && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                    {isPinned ? "Unpin" : "Pin to Top"}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Button - Only show for active announcements */}
          {!isArchived && (
            <div className="relative">
              <button
                onClick={handleEdit}
                onMouseEnter={() => toggleTooltip("edit", true)}
                onMouseLeave={() => toggleTooltip("edit", false)}
                onFocus={() => toggleTooltip("edit", true)}
                onBlur={() => toggleTooltip("edit", false)}
                className={`p-1.5 text-gray-700 dark:text-gray-300 bg-yellow-400 dark:bg-yellow-600 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-yellow-300 dark:hover:bg-yellow-500 rounded-full group border border-yellow-500 dark:border-yellow-400 ${
                  isCardLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isCardLoading}
              >
                {isCardLoading && isLoadingType === "edit" ? (
                  <Loader className="w-3.5 h-3.5 animate-spin text-gray-700 dark:text-gray-300" />
                ) : (
                  <Edit2 className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {showTooltip.edit && !isCardLoading && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                    Update
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Archive/Restore Button */}
          <div className="relative">
            <button
              onClick={isArchived ? handleRestore : handleArchive}
              onMouseEnter={() =>
                toggleTooltip(isArchived ? "restore" : "archive", true)
              }
              onMouseLeave={() =>
                toggleTooltip(isArchived ? "restore" : "archive", false)
              }
              onFocus={() =>
                toggleTooltip(isArchived ? "restore" : "archive", true)
              }
              onBlur={() =>
                toggleTooltip(isArchived ? "restore" : "archive", false)
              }
              className={`p-1.5 transition-all duration-200 rounded-full group border ${
                isArchived
                  ? "text-gray-700 dark:text-gray-300 bg-green-400 dark:bg-green-600 hover:text-gray-900 dark:hover:text-white hover:bg-green-300 dark:hover:bg-green-500 border-green-500 dark:border-green-400"
                  : "text-gray-700 dark:text-gray-300 bg-yellow-400 dark:bg-yellow-600 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-300 dark:hover:bg-yellow-500 border-yellow-500 dark:border-yellow-400"
              } ${isCardLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isCardLoading}
            >
              {isCardLoading &&
              (isLoadingType === "archive" || isLoadingType === "restore") ? (
                <Loader className="w-3.5 h-3.5 animate-spin text-gray-700 dark:text-gray-300" />
              ) : isArchived ? (
                <RotateCcw className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Archive className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {showTooltip.archive && !isArchived && !isCardLoading && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                  Archive
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                </div>
              </div>
            )}

            {showTooltip.restore && isArchived && !isCardLoading && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                  Restore
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Pinned Badge */}
        {isPinned && !isArchived && (
          <div className="absolute top-2 left-2">
            <div className="bg-yellow-500 text-white text-xs font-kumbh py-1 px-2 rounded-full flex items-center gap-1 shadow-md">
              <Pin className="w-3 h-3 fill-white" />
              PINNED
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Tag className="w-3 h-3 mr-1" />
            {displayData.category}
          </span>
        </div>

        <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {displayData.title}
        </h3>

        {/* Summary */}
        {displayData.summary && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {displayData.summary}
          </p>
        )}

        {/* Content */}
        {!displayData.summary && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
            {displayData.content}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {displayData.date}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {displayData.meta}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
