import React, { useState, useRef } from "react";
import BaseModal from "../BaseModal";
import {
  CheckCircle,
  Edit2,
  Archive,
  AlertTriangle,
  Send,
  RotateCcw,
  Loader,
  Pin,
  Calendar,
  Image,
  X,
  Tag,
} from "lucide-react";

import DefaultBanner from "../../assets/images/DefaultBanner.jpg";

const AnnouncementModal = ({
  isOpen,
  type,
  data,
  onClose,
  onConfirm,
  actionLoading,
  darkMode = false,
}) => {
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    summary: "",
    category: "General",
    targetAudience: "All Users",
    isPinned: false,
    expiryDate: "",
  });
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [newBannerPreview, setNewBannerPreview] = useState(null);
  const bannerInputRef = useRef(null);

  const audienceOptions = ["All Users", "Students", "Teachers", "Parents"];
  const categoryOptions = ["Academic", "Events", "General"];

  // Reset form when edit modal opens with current data
  React.useEffect(() => {
    if (type === "edit" && data) {
      const backendAudience = data.TargetAudience || data.meta || "All Users";
      const backendCategory = data.Category || "General";
      const backendSummary = data.Summary || data.summary || "";

      setEditForm({
        title: data.Title || data.title || "",
        content: data.Content || data.content || data.fullContent || "",
        summary: backendSummary,
        category: backendCategory,
        targetAudience: backendAudience,
        isPinned: Boolean(data.IsPinned),
        expiryDate: data.ExpiryDate
          ? data.ExpiryDate.replace(" ", "T").slice(0, 16)
          : "",
      });

      // Reset banner selection
      setNewBannerImage(null);
      setNewBannerPreview(null);
    }
  }, [type, data]);

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF).");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image under 2MB.");
        return;
      }

      setNewBannerImage(file);
      setNewBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setNewBannerImage(null);
    setNewBannerPreview(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const handleEditSubmit = () => {
    if (!editForm.title.trim()) {
      alert("Please enter a title for your announcement.");
      return;
    }

    if (!editForm.content.trim()) {
      alert("Please enter some content for your announcement.");
      return;
    }

    const updateData = {
      id: data.id || data.AnnouncementID,
      Title: editForm.title.trim(),
      Content: editForm.content.trim(),
      Summary: editForm.summary.trim(),
      Category: editForm.category,
      TargetAudience: editForm.targetAudience,
      IsPinned: editForm.isPinned,
      ExpiryDate: editForm.expiryDate
        ? editForm.expiryDate.replace("T", " ") + ":00"
        : data.ExpiryDate,
      PublishDate: data.PublishDate,
      IsActive: data.IsActive !== false,
    };

    if (newBannerImage) {
      updateData.banner = newBannerImage;
    }

    console.log("Sending update data:", updateData);
    onConfirm("edit", updateData);
  };

  const getModalConfig = () => {
    switch (type) {
      case "view":
        return {
          title: "Announcement Details",
          width: "max-w-4xl",
          content: (
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 overflow-hidden">
                <img
                  src={data?.image || data?.BannerURL || DefaultBanner}
                  alt="Announcement"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4 font-kumbh">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {data?.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {data?.category || "General"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {data?.meta}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    {data?.date}
                  </p>
                </div>

                {data?.summary && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Summary
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      {data.summary}
                    </p>
                  </div>
                )}

                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed text-base">
                  {data?.fullContent}
                </div>

                {data?.signature && (
                  <p className="text-gray-600 dark:text-gray-400 italic border-l-4 border-yellow-400 pl-4">
                    {data.signature}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {data?.status}
                  </span>
                </div>
              </div>
            </div>
          ),
        };

      case "edit":
        return {
          title: "Edit Announcement",
          width: "max-w-2xl",
          content: (
            <div className="space-y-4">
              {/* Current Banner Display */}
              {data?.BannerURL && !newBannerPreview && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-3">
                  <h4 className="text-sm font-kumbh font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Banner
                  </h4>
                  <div className="relative w-full aspect-[16/9] bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={data.BannerURL}
                      alt="Current banner"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* New Banner Preview */}
              {newBannerPreview && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-yellow-400 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-kumbh font-semibold text-gray-700 dark:text-gray-300">
                      New Banner Image
                    </h4>
                    <button
                      onClick={removeBanner}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      disabled={actionLoading.type === "edit"}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <div className="relative w-full aspect-[16/9] bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={newBannerPreview}
                      alt="New banner preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-kumbh">
                    {newBannerImage?.name} (
                    {(newBannerImage?.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {/* Upload Banner Button */}
              <div>
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl transition-colors font-kumbh text-sm text-gray-700 dark:text-gray-300"
                  disabled={actionLoading.type === "edit"}
                >
                  <Image className="w-4 h-4" />
                  {newBannerImage
                    ? "Change Banner Image"
                    : data?.BannerURL
                    ? "Upload New Banner"
                    : "Add Banner Image"}
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter announcement title..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-gray-900 dark:text-gray-100"
                  disabled={actionLoading.type === "edit"}
                />
              </div>

              {/* Summary Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                  Summary (Optional)
                </label>
                <textarea
                  value={editForm.summary}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  placeholder="Enter a brief summary (optional)..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl outline-none resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-gray-900 dark:text-gray-100"
                  disabled={actionLoading.type === "edit"}
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                  Content
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Enter announcement content..."
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl outline-none resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-gray-900 dark:text-gray-100"
                  disabled={actionLoading.type === "edit"}
                />
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                    Target Audience
                  </label>
                  <select
                    value={editForm.targetAudience}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        targetAudience: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-sm text-gray-900 dark:text-gray-100"
                    disabled={actionLoading.type === "edit"}
                  >
                    {audienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-sm text-gray-900 dark:text-gray-100"
                    disabled={actionLoading.type === "edit"}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pin Announcement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                    Pin Announcement
                  </label>
                  <button
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        isPinned: !prev.isPinned,
                      }))
                    }
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-kumbh ${
                      editForm.isPinned
                        ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300"
                        : "bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500"
                    } ${
                      actionLoading.type === "edit"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={actionLoading.type === "edit"}
                  >
                    <Pin
                      className={`w-4 h-4 ${
                        editForm.isPinned ? "fill-yellow-500" : ""
                      }`}
                    />
                    {editForm.isPinned ? "Pinned" : "Pin to Top"}
                  </button>
                </div>

                {/* Expiry Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={editForm.expiryDate}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 pl-10 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-sm text-gray-900 dark:text-gray-100"
                      disabled={actionLoading.type === "edit"}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-kumbh">
                    Leave empty to keep current expiry date
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium transition-colors font-kumbh"
                  disabled={actionLoading.type === "edit"}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors flex items-center gap-2 font-kumbh"
                  disabled={actionLoading.type === "edit"}
                >
                  {actionLoading.type === "edit" ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Update Announcement
                    </>
                  )}
                </button>
              </div>

              {/* Hidden banner input */}
              <input
                type="file"
                ref={bannerInputRef}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleBannerSelect}
                className="hidden"
                disabled={actionLoading.type === "edit"}
              />
            </div>
          ),
        };

      case "confirm":
        return {
          title: "Confirm Post",
          width: "max-w-md",
          content: (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 font-kumbh">
                Post Announcement?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg font-kumbh">
                Are you sure you want to post this announcement?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium transition-colors font-kumbh"
                  disabled={actionLoading.type === "post"}
                >
                  No
                </button>
                <button
                  onClick={() => onConfirm("post", data)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors flex items-center gap-2 font-kumbh"
                  disabled={actionLoading.type === "post"}
                >
                  {actionLoading.type === "post" ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Yes, Post"
                  )}
                </button>
              </div>
            </div>
          ),
        };

      case "archive-confirm":
        return {
          title: "Archive Announcement",
          width: "max-w-md",
          content: (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 font-kumbh">
                Archive Announcement?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-kumbh">
                Are you sure you want to archive this announcement?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium transition-colors font-kumbh"
                  disabled={actionLoading.type === "archive"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm("archive", data)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors flex items-center gap-2 font-kumbh"
                  disabled={actionLoading.type === "archive"}
                >
                  {actionLoading.type === "archive" ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Archiving...
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4" />
                      Yes, Archive
                    </>
                  )}
                </button>
              </div>
            </div>
          ),
        };

      case "restore-confirm":
        return {
          title: "Restore Announcement",
          width: "max-w-md",
          content: (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 font-kumbh">
                Restore Announcement?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-kumbh">
                Are you sure you want to restore this announcement?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium transition-colors font-kumbh"
                  disabled={actionLoading.type === "restore"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm("restore", data)}
                  className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center gap-2 font-kumbh"
                  disabled={actionLoading.type === "restore"}
                >
                  {actionLoading.type === "restore" ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Yes, Restore
                    </>
                  )}
                </button>
              </div>
            </div>
          ),
        };

      case "success":
        return {
          title: "Success",
          width: "max-w-md",
          content: (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-kumbh">
                {data?.action === "posted" && "Announcement Posted!"}
                {data?.action === "updated" && "Announcement Updated!"}
                {data?.action === "archived" && "Announcement Archived!"}
                {data?.action === "restored" && "Announcement Restored!"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-kumbh">
                {data?.action === "posted" &&
                  "Your announcement has been posted successfully."}
                {data?.action === "updated" &&
                  "Your announcement has been updated successfully."}
                {data?.action === "archived" &&
                  "Your announcement has been archived successfully."}
                {data?.action === "restored" &&
                  "Your announcement has been restored successfully."}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors font-kumbh"
              >
                Done
              </button>
            </div>
          ),
        };

      default:
        return { title: "", width: "max-w-md", content: null };
    }
  };

  const config = getModalConfig();

  if (!config.content) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      width={config.width}
      darkMode={darkMode}
    >
      {config.content}
    </BaseModal>
  );
};

export default AnnouncementModal;
