import React, { useState, useRef, useEffect } from "react";
import {
  Smile,
  Send,
  X,
  Paperclip,
  Calendar,
  Users,
  Pin,
  Image,
  Tag,
  Plus,
} from "lucide-react";

import DefaultBanner from "../../assets/images/DefaultBanner.jpg";

const AnnouncementForm = ({
  onOpenConfirm,
  resetForm = false,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("General");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [targetAudience, setTargetAudience] = useState("All Users");
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [showTooltip, setShowTooltip] = useState({
    file: false,
    image: false,
    emoji: false,
    post: false,
    audience: false,
    pin: false,
    expiry: false,
    category: false,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const bannerInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const contentTextareaRef = useRef(null);
  const titleInputRef = useRef(null);
  const audienceDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Audience options
  const audienceOptions = ["All Users", "Students", "Teachers", "Parents"];

  // Category options
  const categoryOptions = ["Academic", "Events", "General"];

  const emojiCategories = [
    {
      name: "Smileys & Emotion",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😚",
        "😋",
        "😛",
        "😝",
        "😜",
        "🤪",
        "🤨",
        "🧐",
        "🤓",
        "😎",
        "🤩",
      ],
    },
    {
      name: "People & Body",
      emojis: [
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👌",
        "🤌",
        "🤏",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "🖕",
        "👇",
        "☝️",
        "👍",
        "👎",
        "👊",
        "✊",
        "🤛",
        "🤜",
        "👏",
        "🙌",
        "👐",
        "🤲",
        "🤝",
      ],
    },
    {
      name: "Animals & Nature",
      emojis: [
        "🐵",
        "🐒",
        "🦍",
        "🦧",
        "🐶",
        "🐕",
        "🦮",
        "🐩",
        "🐺",
        "🦊",
        "🦝",
        "🐱",
        "🐈",
        "🦁",
        "🐯",
        "🐅",
        "🐆",
        "🐴",
        "🐎",
        "🦄",
        "🦓",
        "🦌",
        "🐮",
        "🐂",
        "🐃",
        "🐄",
        "🐷",
        "🐖",
        "🐗",
        "🐽",
      ],
    },
    {
      name: "Food & Drink",
      emojis: [
        "🍎",
        "🍏",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶️",
        "🫑",
        "🌽",
        "🥕",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
      ],
    },
    {
      name: "Activities & Sports",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🎿",
        "⛷️",
        "🏂",
        "🪂",
        "🏋️",
        "🤼",
        "🤸",
        "⛹️",
        "🤾",
        "🌏",
        "🏇",
        "🧘",
        "🏄",
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        audienceDropdownRef.current &&
        !audienceDropdownRef.current.contains(event.target)
      ) {
        setShowAudienceDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isExpanded
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (resetForm) {
      setTitle("");
      setContent("");
      setSummary("");
      setCategory("General");
      setBannerImage(null);
      setBannerPreview(null);
      setTargetAudience("All Users");
      setIsPinned(false);
      setExpiryDate("");
      setIsExpanded(false);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  }, [resetForm]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF).");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image under 2MB.");
        return;
      }

      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBannerImage(null);
    setBannerPreview(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a title for your announcement.");
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }
    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    let calculatedExpiryDate = expiryDate;
    if (!calculatedExpiryDate) {
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 7);
      calculatedExpiryDate = defaultExpiry.toISOString().slice(0, 16);
    }

    const formData = {
      Title: title.trim(),
      Content: content.trim(),
      Summary: summary.trim(),
      Category: category,
      TargetAudience: targetAudience,
      IsPinned: isPinned,
      ExpiryDate: calculatedExpiryDate.replace("T", " ") + ":00",
      banner: bannerImage,
      useDefaultBanner: !bannerImage,
    };

    if (onOpenConfirm) {
      onOpenConfirm(formData);
    }
  };

  const handleEmojiClick = (emoji) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (contentTextareaRef.current) {
      contentTextareaRef.current.focus();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const toggleAudienceDropdown = () => {
    setShowAudienceDropdown((prev) => !prev);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown((prev) => !prev);
  };

  const handleAudienceSelect = (audience) => {
    setTargetAudience(audience);
    setShowAudienceDropdown(false);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const togglePin = () => {
    setIsPinned((prev) => !prev);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(true);
    // Focus on title input when expanded
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
    // Only reset form if no content has been entered
    if (!title.trim() && !content.trim() && !summary.trim()) {
      setTitle("");
      setContent("");
      setSummary("");
      setCategory("General");
      setBannerImage(null);
      setBannerPreview(null);
      setTargetAudience("All Users");
      setIsPinned(false);
      setExpiryDate("");
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    // Reset form completely on cancel
    setTitle("");
    setContent("");
    setSummary("");
    setCategory("General");
    setBannerImage(null);
    setBannerPreview(null);
    setTargetAudience("All Users");
    setIsPinned(false);
    setExpiryDate("");
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const canPost = title.trim().length > 0 && content.trim().length > 0;

  const toggleTooltip = (tooltip, show) => {
    setShowTooltip((prev) => ({
      ...prev,
      [tooltip]: show,
    }));
  };

  return (
    <div className="space-y-0 rounded-xl">
      {/* Collapsed State  */}
      {!isExpanded && (
        <div
          className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all duration-200 cursor-text"
          onClick={handleExpand}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Create a new announcement..."
                className="w-full bg-transparent border-none outline-none font-kumbh text-lg font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:border-none focus:outline-none cursor-text"
                disabled={isSubmitting}
                onClick={handleExpand}
              />
            </div>
          </div>
        </div>
      )}

      {/* Expanded State - Full Form as Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            ref={modalRef}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold font-kumbh text-gray-900 dark:text-gray-100">
                Create New Announcement
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-4">
                {/* Main Container with Title and Content Area */}
                <div className="bg-gray-50 dark:bg-gray-700 shadow-inner shadow-gray-300 dark:shadow-gray-600 rounded-xl p-0 relative border-2 border-solid border-gray-300 dark:border-gray-600">
                  {/* Title Input */}
                  <div className="border-b border-gray-300 dark:border-gray-600 border-dashed">
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Announcement title..."
                      className="w-full bg-transparent border-none outline-none font-kumbh text-base font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-3 py-3 focus:ring-0 focus:border-none focus:outline-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Content Area */}
                  <div className="relative">
                    <textarea
                      ref={contentTextareaRef}
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Write your announcement content here..."
                      className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] font-kumbh text-sm font-medium text-gray-600 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 pr-16 py-3 pl-3 focus:ring-0 focus:border-none focus:outline-none"
                      rows="4"
                      disabled={isSubmitting}
                    />

                    {/* Integrated Action Buttons */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      {/* Banner Image Button */}
                      <div className="relative">
                        <button
                          onClick={() => bannerInputRef.current?.click()}
                          onMouseEnter={() => toggleTooltip("image", true)}
                          onMouseLeave={() => toggleTooltip("image", false)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                          disabled={isSubmitting}
                        >
                          <Image className="w-3.5 h-3.5" />
                        </button>

                        {/* Image Tooltip */}
                        {showTooltip.image && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50">
                            <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                              Add Banner Image
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Emoji Button */}
                      <div className="relative" ref={emojiPickerRef}>
                        <button
                          onClick={toggleEmojiPicker}
                          onMouseEnter={() => toggleTooltip("emoji", true)}
                          onMouseLeave={() => toggleTooltip("emoji", false)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                          disabled={isSubmitting}
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>

                        {/* Emoji Tooltip */}
                        {showTooltip.emoji && !showEmojiPicker && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50">
                            <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                              Add Emoji
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                          </div>
                        )}

                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 mb-1 z-50 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-sm font-kumbh font-semibold text-gray-900 dark:text-gray-200">
                                Choose an emoji
                              </h3>
                              <button
                                onClick={() => setShowEmojiPicker(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>

                            <div className="max-h-48 overflow-y-auto">
                              {emojiCategories.map((category) => (
                                <div key={category.name} className="mb-3">
                                  <h4 className="text-xs font-kumbh font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                                    {category.name}
                                  </h4>
                                  <div className="grid grid-cols-8 gap-1">
                                    {category.emojis.map(
                                      (emoji, emojiIndex) => (
                                        <button
                                          key={emojiIndex}
                                          onClick={() =>
                                            handleEmojiClick(emoji)
                                          }
                                          className="w-7 h-7 flex items-center justify-center text-base hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 hover:scale-110"
                                          title={emoji}
                                        >
                                          {emoji}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner Image Preview */}
                {bannerPreview && (
                  <div className="bg-gray-50 dark:bg-gray-600 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-500 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-kumbh font-semibold text-gray-700 dark:text-gray-200">
                        Banner Image
                      </h4>
                      <button
                        onClick={removeBanner}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <div className="relative w-full aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-kumbh">
                      {bannerImage?.name} (
                      {(bannerImage?.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}

                {/* Summary Input */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-inner border border-gray-200 dark:border-gray-600">
                  <label className="block text-xs font-kumbh font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Summary (Optional)
                  </label>
                  <textarea
                    value={summary}
                    onChange={handleSummaryChange}
                    placeholder="Enter a brief summary of your announcement (optional)..."
                    rows="2"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-kumbh">
                    A short summary that will be displayed in the announcement
                    card (optional)
                  </p>
                </div>

                {/* Settings Panel */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-inner border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Target Audience */}
                    <div className="relative" ref={audienceDropdownRef}>
                      <label className="block text-xs font-kumbh font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Audience
                      </label>
                      <button
                        onClick={toggleAudienceDropdown}
                        onMouseEnter={() => toggleTooltip("audience", true)}
                        onMouseLeave={() => toggleTooltip("audience", false)}
                        className="w-full flex items-center justify-between px-2 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        disabled={isSubmitting}
                      >
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span className="font-kumbh text-xs text-gray-700 dark:text-gray-300">
                            {targetAudience}
                          </span>
                        </div>
                        <div className="transform transition-transform text-xs text-gray-500 dark:text-gray-400">
                          {showAudienceDropdown ? "▲" : "▼"}
                        </div>
                      </button>

                      {showAudienceDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                          {audienceOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleAudienceSelect(option)}
                              className={`w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg text-xs ${
                                targetAudience === option
                                  ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="relative" ref={categoryDropdownRef}>
                      <label className="block text-xs font-kumbh font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <button
                        onClick={toggleCategoryDropdown}
                        onMouseEnter={() => toggleTooltip("category", true)}
                        onMouseLeave={() => toggleTooltip("category", false)}
                        className="w-full flex items-center justify-between px-2 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        disabled={isSubmitting}
                      >
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span className="font-kumbh text-xs text-gray-700 dark:text-gray-300">
                            {category}
                          </span>
                        </div>
                        <div className="transform transition-transform text-xs text-gray-500 dark:text-gray-400">
                          {showCategoryDropdown ? "▲" : "▼"}
                        </div>
                      </button>

                      {showCategoryDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                          {categoryOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleCategorySelect(option)}
                              className={`w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg text-xs ${
                                category === option
                                  ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pin Announcement */}
                    <div>
                      <label className="block text-xs font-kumbh font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pin Announcement
                      </label>
                      <button
                        onClick={togglePin}
                        onMouseEnter={() => toggleTooltip("pin", true)}
                        onMouseLeave={() => toggleTooltip("pin", false)}
                        className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-xs ${
                          isPinned
                            ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300"
                            : "bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500"
                        }`}
                        disabled={isSubmitting}
                      >
                        <Pin
                          className={`w-3.5 h-3.5 ${
                            isPinned ? "fill-yellow-500" : ""
                          }`}
                        />
                        <span className="font-kumbh">
                          {isPinned ? "Pinned" : "Pin to Top"}
                        </span>
                      </button>
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-xs font-kumbh font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full px-2 py-1.5 pl-8 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-kumbh text-xs text-gray-700 dark:text-gray-300"
                          disabled={isSubmitting}
                        />
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-kumbh">
                        Leave empty for 7 days from now
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-kumbh text-sm transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <div className="relative">
                <button
                  onClick={handleSubmit}
                  disabled={!canPost || isSubmitting}
                  onMouseEnter={() => toggleTooltip("post", true)}
                  onMouseLeave={() => toggleTooltip("post", false)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 font-kumbh text-sm font-medium ${
                    canPost && !isSubmitting
                      ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Posting..." : "Post Announcement"}
                </button>

                {/* Post Tooltip */}
                {showTooltip.post && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50">
                    <div
                      className={`text-xs font-kumbh py-1 px-2 rounded-lg shadow-lg whitespace-nowrap ${
                        canPost && !isSubmitting
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {isSubmitting
                        ? "Posting..."
                        : canPost
                        ? "Post Announcement"
                        : "Add title and content to post"}
                      <div
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                          canPost && !isSubmitting
                            ? "border-t-green-600"
                            : "border-t-gray-600"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden banner input */}
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleBannerSelect}
        className="hidden"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default AnnouncementForm;
