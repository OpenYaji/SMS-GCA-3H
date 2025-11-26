import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const ProfileInfoItem = ({
  label,
  value,
  field,
  isEditing = false,
  type = "text",
  onProfileChange,
}) => (
  <div className={`flex flex-col ${label === "Address" ? "col-span-2" : ""}`}>
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </span>
    {isEditing ? (
      type === "select" ? (
        <select
          value={value}
          onChange={(e) => onProfileChange(field, e.target.value)}
          className="w-full px-3 py-2 border-2 border-yellow-500 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium transition-all focus:border-yellow-600 focus:ring-3 focus:ring-yellow-200 dark:focus:ring-yellow-800 dark:text-white"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onProfileChange(field, e.target.value)}
          className="w-full px-3 py-2 border-2 border-yellow-500 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium transition-all focus:border-yellow-600 focus:ring-3 focus:ring-yellow-200 dark:focus:ring-yellow-800 dark:text-white"
        />
      )
    ) : (
      <span className="text-sm text-gray-900 dark:text-white font-medium">
        {value}
      </span>
    )}
  </div>
);

const ProfileInfo = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Function to calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return "";

    try {
      // Try to parse the birthday string
      let birthDate;

      // Handle different date formats
      if (birthday.includes(",")) {
        // Format like "June 6, 2005"
        birthDate = new Date(birthday);
      } else if (birthday.includes("-")) {
        // Format like "2005-06-06"
        birthDate = new Date(birthday);
      } else {
        // Try direct parsing
        birthDate = new Date(birthday);
      }

      if (isNaN(birthDate.getTime())) {
        console.warn("Invalid date format:", birthday);
        return "";
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred this year yet
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age.toString();
    } catch (error) {
      console.error("Error calculating age:", error);
      return "";
    }
  };

  // Function to format birthday for date input
  const formatBirthdayForInput = (birthday) => {
    if (!birthday) return "";

    try {
      let birthDate;

      if (birthday.includes(",")) {
        // Format like "June 6, 2005" to "2005-06-06"
        birthDate = new Date(birthday);
      } else if (birthday.includes("-")) {
        // Already in correct format
        return birthday;
      } else {
        birthDate = new Date(birthday);
      }

      if (isNaN(birthDate.getTime())) {
        return "";
      }

      return birthDate.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting birthday:", error);
      return "";
    }
  };

  // Function to format date for display
  const formatBirthdayForDisplay = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return dateString;
    }
  };

  // Update age when birthday changes
  useEffect(() => {
    if (profileData.birthday) {
      const calculatedAge = calculateAge(profileData.birthday);
      if (calculatedAge && calculatedAge !== profileData.age) {
        setProfileData((prev) => ({
          ...prev,
          age: calculatedAge,
        }));
      }
    }
  }, [profileData.birthday]);

  const handleProfileChange = (field, value) => {
    const updatedData = {
      ...profileData,
      [field]: value,
    };

    // If birthday is being updated, calculate age automatically
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value);
      if (calculatedAge) {
        updatedData.age = calculatedAge;
      }
    }

    setProfileData(updatedData);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden font-kumbh transition-colors duration-300">
      {/* Profile Header - Yellow in light mode, gradient in dark mode */}
      <div className="px-8 py-4 flex items-center gap-6 relative bg-gradient-to-r from-yellow-400 to-yellow-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-400">
        {isEditing ? (
          <div className="flex gap-2 absolute top-6 right-6">
            <button
              onClick={handleSaveProfile}
              className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <Check size={20} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 w-11 h-11 bg-gray-800 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gray-900 dark:hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg border dark:border-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L17.625 2.175L21.8 6.45L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
            </svg>
          </button>
        )}

        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#888"
          >
            <path d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" />
          </svg>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-kumbh">
            {profileData.fullName}
          </h2>
          <p className="text-gray-700 dark:text-gray-200 font-kumbh text-base">
            {profileData.email}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-5">
          <ProfileInfoItem
            label="Full Name"
            value={profileData.fullName}
            field="fullName"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Email Address"
            value={profileData.email}
            field="email"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Age"
            value={profileData.age}
            field="age"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
            type="text"
          />
          <ProfileInfoItem
            label="Birthday"
            value={
              isEditing
                ? formatBirthdayForInput(profileData.birthday)
                : profileData.birthday
            }
            field="birthday"
            isEditing={isEditing}
            type={isEditing ? "date" : "text"}
            onProfileChange={(field, value) => {
              // When saving, format the date for display
              if (!isEditing) return;
              handleProfileChange(field, value);
            }}
          />
          <ProfileInfoItem
            label="Address"
            value={profileData.address}
            field="address"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Phone Number"
            value={profileData.phoneNumber}
            field="phoneNumber"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Sex"
            value={profileData.sex}
            field="sex"
            isEditing={isEditing}
            type="select"
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Nationality"
            value={profileData.nationality}
            field="nationality"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Religion"
            value={profileData.religion}
            field="religion"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
          <ProfileInfoItem
            label="Mother Tongue"
            value={profileData.motherTongue}
            field="motherTongue"
            isEditing={isEditing}
            onProfileChange={handleProfileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
