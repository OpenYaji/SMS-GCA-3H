import React, { useState } from 'react';
import { Pencil, X, Upload } from 'lucide-react';
import DefaultProfilePic from '../../../assets/img/jhego.jpg';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getProfilePictureUrl = (profilePictureURL) => {
    if (!profilePictureURL) return DefaultProfilePic;
    if (profilePictureURL.startsWith('http')) return profilePictureURL;
    return `http://localhost/SMS-GCA-3H/Student/backend/${profilePictureURL}`;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await fetch('http://localhost/SMS-GCA-3H/Student/backend/api/profile/profile-picture.php', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for session cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (onProfileUpdate) {
          onProfileUpdate(data.profilePictureURL);
        }
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        alert('Profile picture updated successfully!');
        // Optionally refresh the page to show new image
        window.location.reload();
      } else {
        alert(data.message || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please check console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-md">

        <div className="relative h-40 bg-gradient-to-r from-amber-300 to-orange-400 rounded-t-2xl">
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 bg-black/10 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-black/20 active:bg-black/30 transition">
            <Pencil size={16} />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex flex-col sm:flex-row items-center sm:items-end w-full sm:w-auto">
              <img
                src={getProfilePictureUrl(user.profilePictureURL)}
                alt="Profile"
                className="relative z-10 w-24 h-24  lg:w-32 lg:h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover -mt-14 flex-shrink-0"
                onError={(e) => { e.target.src = DefaultProfilePic; }}
              />
              <div className="sm:ml-4 mt-2 sm:mt-0 sm:mb-2 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.fullName}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{user.email}</p>
                  <span className="text-green-400 text-xl dark:text-green-500">•</span>
                  <p className="bg-yellow-300 dark:bg-yellow-300 rounded-xl text-sm px-2 py-1 font-normal text-black dark:text-black">{user.role || 'Student'}</p>
                </div>
              </div>

            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto text-sm font-semibold border border-gray-200 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition-colors touch-manipulation">
                Change Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Change Profile Photo</h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-slate-600"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center border-4 border-gray-200 dark:border-slate-600">
                    <Upload size={48} className="text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                <label className="cursor-pointer bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                  Select Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {selectedFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-semibold">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold">
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;