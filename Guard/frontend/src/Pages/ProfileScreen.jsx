// ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import Edit2 from '../Components/Edit2.jsx';
import Mail from '../Components/Mail.jsx';
import ProfileField from '../Components/ProfileField.jsx';

const GUARD_EMPLOYEE_ID = 'GRD-00101';

// Map front-end keys to backend
const mapToBackendKeys = (data) => ({
    fname: data.fullName.split(' ')[0] || '',
    email: data.email || '',
    employee_id: data.employeeId || '',
    sex: data.sex || '',
    birthday: data.dateOfBirth || '',
    phone_number: data.phoneNumber || '',
    address: data.address || '',
    religion: data.religion || '',
    mother_tounge: data.motherTongue || '',
    nationality: data.nationality || '',
    weight: data.weight ? parseFloat(data.weight.replace(' kg', '')) : null,
    height: data.height ? parseFloat(data.height.replace(' cm', '')) : null,
});

const ProfileScreen = () => {
    const employeeId = GUARD_EMPLOYEE_ID;

    const [profileData, setProfileData] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const mapToDisplayData = (data) => {
        const nameParts = [data.fname, data.middle_name, data.last_name].filter(Boolean);
        return {
            fullName: nameParts.length > 0 ? nameParts.join(' ') : '',
            email: data.email || '',
            employeeId: data.employee_id || '',
            sex: data.sex || '',
            dateOfBirth: data.birthday || '',
            phoneNumber: data.phone_number || '',
            address: data.address || '',
            religion: data.religion || '',
            motherTongue: data.mother_tounge || '',
            nationality: data.nationality || '',
            weight: data.weight ? `${data.weight} kg` : '',
            height: data.height ? `${data.height} cm` : '',
            avatar_url: data.avatar_url,
        };
    };

    const fetchProfile = async () => {
        if (!employeeId) {
            setError("Employee ID is missing. Please log in.");
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5174/server/server.php/profile/${employeeId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const mappedData = mapToDisplayData(data);
            setProfileData(mappedData);
            setEditData(mappedData);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [employeeId]);

    const handleEditToggle = () => {
        if (isEditing) setEditData(profileData); // cancel edits
        setIsEditing(!isEditing);
        setError(null);
    };

    const handleInputChange = (key, value) => {
        // If editing phone number, allow only numbers and max 11 digits
        if (key === 'phoneNumber') {
            // Remove non-numeric characters
            value = value.replace(/\D/g, '');
            // Limit length to 11
            if (value.length > 11) value = value.slice(0, 11);
        }
        setEditData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const validateFields = () => {
        const requiredFields = ['fullName', 'email', 'dateOfBirth', 'phoneNumber', 'address'];
        const emptyFields = requiredFields.filter(key => !editData[key] || editData[key].trim() === '');

        // Phone number validation
        if (editData.phoneNumber && !/^09\d{9}$/.test(editData.phoneNumber)) {
            setError("Phone number must start with '09' and be exactly 11 digits.");
            setShowErrorModal(true);
            return false;
        }

        if (emptyFields.length > 0) {
            setError(`Please fill out all required fields: ${emptyFields.join(', ')}`);
            setShowErrorModal(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        setIsSaving(true);
        setError(null);

        const dataToUpdate = mapToBackendKeys(editData);

        try {
            const response = await fetch(`http://localhost:5174/server/server.php/profile/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToUpdate),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile. Status: ${response.status}. Message: ${errorText}`);
            }

            await fetchProfile();
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setShowErrorModal(true);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center p-20">Loading Profile...</div>;

    const currentData = isEditing ? editData : profileData;

    const allProfileFields = [
        { label: "Full Name", key: 'fullName', isMain: true, editable: true, required: true },
        { label: "Employee ID", key: 'employeeId', editable: false },
        { label: "Email", key: 'email', isHeader: true, editable: true, required: true },
        { label: "Sex", key: 'sex', editable: false },
        { label: "Date of Birth", key: 'dateOfBirth', editable: true, type: 'date', required: true },
        { label: "Phone Number", key: 'phoneNumber', isLink: true, editable: true, required: true },
        { label: "Address", key: 'address', editable: true, required: true },
        { label: "Religion", key: 'religion', editable: true },
        { label: "Mother Tongue", key: 'motherTongue', editable: true },
        { label: "Nationality", key: 'nationality', isExtra: true, editable: true },
        { label: "Weight", key: 'weight', isExtra: true, editable: true, type: 'number' },
        { label: "Height", key: 'height', isExtra: true, editable: true, type: 'number' },
    ];

    const displayFields = allProfileFields.map(field => ({
        ...field,
        value: currentData[field.key],
    }));

    const filteredFields = isEditing
        ? displayFields
        : displayFields.filter(field => field.value !== null && field.value !== undefined && String(field.value).trim() !== '');

    const mainHeader = filteredFields.find(f => f.isMain) || { value: 'Guard Profile' };
    const emailHeader = filteredFields.find(f => f.key === 'email');
    const mainFields = filteredFields.filter(f => !f.isExtra && !f.isMain && f.key !== 'email');
    const extraFields = filteredFields.filter(f => f.isExtra);

    return (
        <div className="p-4 sm:p-0">
            {/* Error Modal */}
            {showErrorModal && error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="mb-4 text-sm">{error}</p>
                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-start mb-8">
                <h1 className="text-4xl font-extrabold text-stone-900">My Profile</h1>
                {isEditing ? (
                    <div className="flex space-x-3">
                        {isSaving ? (
                            <button disabled className="flex items-center space-x-2 px-4 py-2 bg-stone-300 text-stone-700 font-semibold rounded-lg shadow-md">
                                <span className="animate-spin">⚙️</span>
                                <span>Saving...</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                            >
                                <span>✔</span>
                                <span>Save Changes</span>
                            </button>
                        )}
                        <button
                            onClick={handleEditToggle}
                            disabled={isSaving}
                            className="px-4 py-2 bg-stone-200 text-stone-700 font-semibold rounded-lg shadow-md hover:bg-stone-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-stone-900 font-semibold rounded-lg shadow-md hover:bg-amber-500 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                )}
            </header>

            <div className="bg-white rounded-2xl shadow-xl p-8 pt-4">
                <div className="relative pb-16">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-amber-200 rounded-t-2xl"></div>
                    <div className="relative z-10 flex items-end -mb-12">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-stone-200">
                            <div
                                className="w-full h-full flex items-center justify-center bg-cover bg-center"
                                style={{ backgroundImage: `url('${currentData.avatar_url}')` }}
                            >
                                <span className="text-stone-800 text-2xl font-bold">
                                    {mainHeader.value && !currentData.avatar_url ? mainHeader.value.split(' ').map(n => n[0]).join('') : ''}
                                </span>
                            </div>
                        </div>

                        <div className="ml-6">
                            <h2 className="text-3xl font-bold text-stone-900">{mainHeader.value}</h2>
                            {emailHeader && (
                                <div className="flex items-center text-stone-600 text-sm mt-1">
                                    <Mail className="w-4 h-4 mr-1" />
                                    <span>{emailHeader.value}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {mainFields.map(field => {
                        if (isEditing && field.editable) {
                            return (
                                <div key={field.key}>
                                    <label className="text-sm font-medium text-stone-500">{field.label}</label>
                                    <input
                                        type={field.type || 'text'}
                                        value={editData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        className="w-full mt-1 p-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            );
                        } else {
                            return <ProfileField key={field.key} label={field.label} value={field.value} isLink={field.isLink} />;
                        }
                    })}

                    {extraFields.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 col-span-1 md:col-span-2">
                            {extraFields.map(field => {
                                if (isEditing && field.editable) {
                                    return (
                                        <div key={field.key}>
                                            <label className="text-sm font-medium text-stone-500">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                value={editData[field.key] || ''}
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                className="w-full mt-1 p-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    );
                                } else {
                                    return <ProfileField key={field.key} label={field.label} value={field.value} />;
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
