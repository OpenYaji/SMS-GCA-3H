import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../common/account/ProfileHeader';
import PersonalInfo from '../common/account/PersonalInfo';
import ParentGuardianInfo from '../common/account/ParentGuardianInfo';
import MedicalInfo from '../common/account/MedicalInfo';
import AuthorizedEscorts from '../common/account/AuthorizedEscorts';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>Could not load user data.</div>;
  }

  const studentData = {
    personal: {
      fullName: user.fullName,
      email: user.emailAddress,
      age: user.age,
      birthday: user.dateOfBirth,
      address: user.address,
      phone: user.phoneNumber,
      gender: user.gender,
      nationality: user.nationality,
      profilePictureURL: user.profilePictureURL,
    },
    academic: {
      gradeSection: user.gradeAndSection,
      adviser: user.adviserName,
      status: user.studentStatus,
    },
    parentGuardian: {
      guardianName: user.primaryGuardianName,
      guardianRelationship: user.primaryGuardianRelationship,
      contactNumber: user.primaryGuardianContactNumber,
      email: user.primaryGuardianEmail,
    },
    medical: {
      weight: user.weight,
      height: user.height,
      allergies: user.allergies,
      conditions: user.medicalConditions,
      emergencyContactPerson: user.emergencyContactPerson,
      emergencyContactNumber: user.emergencyContactNumber,
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        My Account
      </h1>
      <div className="flex flex-col gap-8">
        <ProfileHeader user={studentData.personal} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PersonalInfo personalData={studentData.personal} academicData={studentData.academic} />
            <ParentGuardianInfo data={studentData.parentGuardian} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-8">
            <MedicalInfo data={studentData.medical} />
            <AuthorizedEscorts />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;