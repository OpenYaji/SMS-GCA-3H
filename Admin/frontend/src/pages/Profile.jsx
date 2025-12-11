import React, { useState, useEffect } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ActivityLog from "../components/profile/ActivityLog";
import Tabs from "../components/profile/Tabs";
import ChangePasswordModal from "../components/profile/modals/ChangePasswordModal";
import SuccessModal from "../components/profile/modals/SuccessModal";
import { profileService } from "../services/profileService";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPasswordModal, setShowCurrentPasswordModal] =
    useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize profile data with empty values
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    age: "",
    birthday: "",
    address: "",
    phoneNumber: "",
    sex: "",
    nationality: "",
    religion: "",
    motherTongue: "",
  });

  // Fetch profile data from API using profileService
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();

        if (response.data) {
          const profile = response.data;
          // Map API data to our component's state structure
          setProfileData({
            fullName: `${profile.FirstName} ${
              profile.MiddleName ? profile.MiddleName + " " : ""
            }${profile.LastName}`.trim(),
            email: profile.User?.EmailAddress || "",
            age: "", // You might need to calculate this from birthdate if available
            birthday: "", // Add if available from API
            address: profile.Address || "",
            phoneNumber: profile.PhoneNumber || "",
            sex: "", // Add if available from API
            nationality: "", // Add if available from API
            religion: "", // Add if available from API
            motherTongue: "", // Add if available from API
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePassword = () => {
    setShowCurrentPasswordModal(true);
  };

  const handleConfirmCurrentPassword = () => {
    setShowCurrentPasswordModal(false);
    setShowNewPasswordModal(true);
  };

  const handleSaveNewPassword = async () => {
    try {
      // Use profileService to change password
      await profileService.changePassword({
        current_password: passwordData.current,
        new_password: passwordData.new,
        new_password_confirmation: passwordData.confirm,
      });

      console.log("Password changed successfully");
      setShowNewPasswordModal(false);
      setShowSuccessModal(true);
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      // You might want to show an error message to the user here
    }
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "activity", label: "Activity Log" },
  ];

  if (loading) {
    return (
      <div className="bg-[whitesmoke] dark:bg-gray-900 pl-6 min-h-screen p-3 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[whitesmoke] dark:bg-gray-900 pl-6 min-h-screen p-3 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[whitesmoke] dark:bg-gray-900 pl-6 min-h-screen p-3 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-spartan text-[3em] font-bold mb-2 text-[#404040] dark:text-white">
            {activeTab === "profile" ? "Profile" : "Activity Log"}
          </h1>
        </div>
        {activeTab === "profile" && (
          <div className="profile-actions">
            <button
              onClick={handleChangePassword}
              className="bg-yellow-400 dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-400 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-kumbh font-medium hover:bg-yellow-500 dark:hover:from-blue-600 dark:hover:to-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                >
                  <path d="M7.23 25q.049-.662.1-1.238c.228-2.505 2.235-4.311 4.746-4.446C15.013 19.16 19.576 19 26 19c6.425 0 10.987.16 13.924.316c2.511.135 4.518 1.941 4.745 4.446c.18 1.973.331 4.69.331 8.238s-.152 6.265-.33 8.238c-.228 2.505-2.235 4.312-4.746 4.446q-.657.035-1.424.07" />
                  <path d="m31.532 19.043l-.238-4.052a5.303 5.303 0 0 0-10.587 0l-.239 4.052m18.89.244l-.44-5.283A12 12 0 0 0 26.957 3h-1.916a12 12 0 0 0-11.959 11.004l-.44 5.283M10 44a7 7 0 1 1 6.326-10H31a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0v-2h-1v2a3 3 0 1 1-6 0v-2h-4.674A7 7 0 0 1 10 44m-1-7h2" />
                </g>
              </svg>
              Change Password
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 gap-6 max-w-7xl">
          {/* FIXED: No userId prop needed - API uses authentication token */}
          <ProfileInfo
            profileData={profileData}
            setProfileData={setProfileData}
          />
          {/* <MedicalInfo
            medicalData={medicalData}
            setMedicalData={setMedicalData}
          /> */}
        </div>
      ) : (
        <div className="max-w-7xl">
          <ActivityLog />
        </div>
      )}

      <ChangePasswordModal
        showCurrentPasswordModal={showCurrentPasswordModal}
        showNewPasswordModal={showNewPasswordModal}
        passwordVisibility={passwordVisibility}
        passwordData={passwordData}
        togglePasswordVisibility={togglePasswordVisibility}
        handlePasswordChange={handlePasswordChange}
        setShowCurrentPasswordModal={setShowCurrentPasswordModal}
        setShowNewPasswordModal={setShowNewPasswordModal}
        handleConfirmCurrentPassword={handleConfirmCurrentPassword}
        handleSaveNewPassword={handleSaveNewPassword}
      />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
    </div>
  );
};

export default Profile;
