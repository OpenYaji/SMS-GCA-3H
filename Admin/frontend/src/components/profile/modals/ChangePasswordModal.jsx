import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, AlertCircle } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  onTogglePassword,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 capitalize font-kumbh">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-lg pl-10 ${
            showPasswordToggle ? "pr-10" : "pr-3"
          } py-2.5 focus:ring-2 outline-none font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 dark:border-gray-600 focus:ring-yellow-400"
          }`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {type === "password" ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ChangePasswordModal = ({
  showCurrentPasswordModal,
  showNewPasswordModal,
  passwordVisibility,
  passwordData,
  togglePasswordVisibility,
  handlePasswordChange,
  setShowCurrentPasswordModal,
  setShowNewPasswordModal,
  handleConfirmCurrentPassword,
  handleSaveNewPassword,
}) => {
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const validateCurrentPassword = () => {
    if (!passwordData.current.trim()) {
      setErrors((prev) => ({
        ...prev,
        current: "Current password is required",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, current: "" }));
    return true;
  };

  const validateNewPasswords = () => {
    const newErrors = { new: "", confirm: "" };

    if (!passwordData.new.trim()) {
      newErrors.new = "New password is required";
    } else if (passwordData.new.length < 6) {
      newErrors.new = "Password must be at least 6 characters long";
    }

    if (!passwordData.confirm.trim()) {
      newErrors.confirm = "Please confirm your new password";
    } else if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !newErrors.new && !newErrors.confirm;
  };

  const handleConfirmWithValidation = () => {
    if (validateCurrentPassword()) {
      handleConfirmCurrentPassword();
      setErrors({ current: "", new: "", confirm: "" });
    }
  };

  const handleSaveWithValidation = () => {
    if (validateNewPasswords()) {
      handleSaveNewPassword();
    }
  };

  const handleInputChange = (field, value) => {
    handlePasswordChange(field, value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCloseCurrentModal = () => {
    setShowCurrentPasswordModal(false);
    setErrors({ current: "", new: "", confirm: "" });
  };

  const handleCloseNewModal = () => {
    setShowNewPasswordModal(false);
    setErrors({ current: "", new: "", confirm: "" });
  };

  return (
    <>
      {/* Current Password Modal */}
      {showCurrentPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-kumbh">
                Enter Current Password
              </h2>
              <button
                onClick={handleCloseCurrentModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            </div>

            <InputField
              label="Current Password"
              type={passwordVisibility.current ? "text" : "password"}
              placeholder="Enter your current password"
              icon={Lock}
              value={passwordData.current}
              onChange={(e) => handleInputChange("current", e.target.value)}
              error={errors.current}
              showPasswordToggle={true}
              onTogglePassword={() => togglePasswordVisibility("current")}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseCurrentModal}
                className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium font-kumbh transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithValidation}
                className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium font-kumbh transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-kumbh">
                Set New Password
              </h2>
              <button
                onClick={handleCloseNewModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            </div>

            <InputField
              label="New Password"
              type={passwordVisibility.new ? "text" : "password"}
              placeholder="Enter new password"
              icon={KeyRound}
              value={passwordData.new}
              onChange={(e) => handleInputChange("new", e.target.value)}
              error={errors.new}
              showPasswordToggle={true}
              onTogglePassword={() => togglePasswordVisibility("new")}
            />

            <InputField
              label="Confirm New Password"
              type={passwordVisibility.confirm ? "text" : "password"}
              placeholder="Re-enter new password"
              icon={Lock}
              value={passwordData.confirm}
              onChange={(e) => handleInputChange("confirm", e.target.value)}
              error={errors.confirm}
              showPasswordToggle={true}
              onTogglePassword={() => togglePasswordVisibility("confirm")}
            />

            {/* Password Requirements */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordData.new.length >= 6
                        ? "bg-green-500"
                        : "bg-blue-300 dark:bg-blue-600"
                    }`}
                  ></div>
                  At least 6 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordData.new === passwordData.confirm &&
                      passwordData.confirm
                        ? "bg-green-500"
                        : "bg-blue-300 dark:bg-blue-600"
                    }`}
                  ></div>
                  Passwords must match
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseNewModal}
                className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium font-kumbh transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveWithValidation}
                className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium font-kumbh transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePasswordModal;
