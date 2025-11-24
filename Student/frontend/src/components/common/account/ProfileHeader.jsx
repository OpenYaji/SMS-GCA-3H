import React from 'react';
import { Pencil } from 'lucide-react';
import DefaultProfilePic from '../../../assets/img/jhego.jpg';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-md">

      <div className="relative h-40 bg-gradient-to-r from-amber-300 to-orange-400 rounded-t-2xl">
        <button className="absolute top-4 right-4 bg-black/10 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-black/20 active:bg-black/30 transition">
          <Pencil size={16} />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end w-full sm:w-auto"> 
            <img
              src={user.profilePictureURL || DefaultProfilePic}
              alt="Profile" 
              className="relative z-10 w-24 h-24  lg:w-32 lg:h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover -mt-14 flex-shrink-0"
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
            <button className="w-full sm:w-auto text-sm font-semibold border border-gray-200 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition-colors touch-manipulation">
              Change Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;