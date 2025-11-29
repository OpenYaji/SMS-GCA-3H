// ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import Edit2 from '../Components/Edit2.jsx'; // Icon for Edit
import Mail from '../Components/Mail.jsx';   // Icon for Mail
import ProfileField from '../Components/ProfileField.jsx'; // Display component
// Inalis ang: import Save from '../Components/Save.jsx'; 

// DAHIL HINDI KO MA-ACCESS ANG AUTH CONTEXT MO, GAGAMIT TAYO NG HARDCODED ID MUNA.
// PALITAN ITO NG TAMANG MECHANISM (e.g., const { employeeId } = useAuth();)
const GUARD_EMPLOYEE_ID = 'employee_id'; // Palitan ito ng tamang mekanismo para makuha ang employee ID

// Helper function to map front-end keys to back-end/DB keys
const mapToBackendKeys = (data) => ({
    // Note: Sa simpleng pag-e-edit, kailangan mo ng logic para hatiin ang fullName pabalik sa fname/middle_name/last_name
    // Para sa simpleng demo, gagamitin natin ang fname muna.
    fname: data.fullName.split(' ')[0] || '', // Simplified: assuming only first name is used
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
    const [editData, setEditData] = useState({}); // Data currently being edited
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to map DB keys to display keys/format
    const mapToDisplayData = (data) => {
        const nameParts = [data.fname, data.middle_name, data.last_name].filter(Boolean);
        return {
            fullName: nameParts.length > 0 ? nameParts.join(' ') : '',
            email: data.email || '',
            employeeId: data.employee_id || '',
            sex: data.sex || '',
            dateOfBirth: data.birthday || '', // Assume date format is fine for now
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

    // --- Data Fetching Logic ---
    const fetchProfile = async () => {
        if (!employeeId) {
            setError("Employee ID is missing. Please log in.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5174/api/profile/${employeeId}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
            }
            const data = await response.json();
            
            const mappedData = mapToDisplayData(data);
            setProfileData(mappedData); 
            setEditData(mappedData); // Initialize editData with fetched data
        } catch (err) {
            console.error("Fetch profile error:", err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [employeeId]); 

    // --- Editing Functions ---
    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel Editing: Revert temporary changes
            setEditData(profileData);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (key, value) => {
        setEditData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        
        // 1. Map the front-end editData back to the expected DB structure
        const dataToUpdate = mapToBackendKeys(editData);

        try {
            const response = await fetch(`http://localhost:5174/api/profile/${employeeId}`, {
                method: 'PUT', // Use PUT or PATCH for update
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile. Status: ${response.status}. Message: ${errorText}`);
            }

            // 2. Successful update: Fetch the profile again to get the latest, clean data
            await fetchProfile(); // Re-fetch data to update profileData state

            setIsEditing(false); // Exit edit mode
            // alert("Profile successfully updated!"); // Maaari mong gamitin ito
        } catch (err) {
            console.error("Update profile error:", err.message);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div className="text-center p-20 text-stone-500">
                <p className="text-2xl font-bold">Loading Profile...</p>
            </div>
        );
    }

    // Kung may error, at hindi ka nagse-save, ipakita ang error message
    if (error && !isSaving) {
        return (
            <div className="text-center p-8 text-red-700 bg-red-100 border-2 border-red-300 rounded-xl">
                <p className="text-xl font-bold mb-2">Error!</p>
                <p className="text-sm">Details: {error}</p>
                <button 
                    onClick={fetchProfile} 
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Try Reloading
                </button>
            </div>
        );
    }
    
    // Use the current data (editData if editing, profileData if displaying)
    const currentData = isEditing ? editData : profileData;

    // --- Data Preparation for Rendering ---

    // List of all profile fields with their display logic
    const allProfileFields = [
        { label: "Full Name", key: 'fullName', isMain: true, editable: true },
        { label: "Employee ID", key: 'employeeId', editable: false }, // Should not be editable
        { label: "Email", key: 'email', isHeader: true, editable: true },
        { label: "Sex", key: 'sex', editable: true },
        { label: "Date of Birth", key: 'dateOfBirth', editable: true, type: 'date' },
        { label: "Phone Number", key: 'phoneNumber', isLink: true, editable: true },
        { label: "Address", key: 'address', editable: true },
        { label: "Religion", key: 'religion', editable: true },
        { label: "Mother Tongue", key: 'motherTongue', editable: true },
        { label: "Nationality", key: 'nationality', isExtra: true, editable: true },
        { label: "Weight", key: 'weight', isExtra: true, editable: true, type: 'number' },
        { label: "Height", key: 'height', isExtra: true, editable: true, type: 'number' },
    ];

    // Filter fields: Only include fields with a valid value
    const filteredFields = allProfileFields.map(field => ({
        ...field,
        value: currentData[field.key], // Get value from currentData
    })).filter(field => 
        field.value !== null && field.value !== undefined && String(field.value).trim() !== ''
    );

    // Separate fields for layout
    const mainHeader = filteredFields.find(field => field.isMain) || { value: 'Guard Profile' };
    const emailHeader = filteredFields.find(field => field.key === 'email');
    const mainFields = filteredFields.filter(field => !field.isExtra && !field.isMain && field.key !== 'email');
    const extraFields = filteredFields.filter(field => field.isExtra);

    return (
        <div className="p-4 sm:p-0">
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
                                {/* Gumamit ng simpleng checkmark at text imbes na Save.jsx */}
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
                        {/* Profile Picture */}
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
                    {/* Display Main Fields */}
                    {mainFields.map(field => {
                        const isEditableField = isEditing && field.editable;

                        if (isEditableField) {
                            return (
                                <div key={field.key}>
                                    <label className="text-sm font-medium text-stone-500">{field.label}</label>
                                    <input
                                        type={field.type || 'text'}
                                        value={editData[field.key]}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        className="w-full mt-1 p-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                        readOnly={!field.editable}
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <ProfileField 
                                    key={field.key} 
                                    label={field.label} 
                                    value={field.value} 
                                    isLink={field.isLink} 
                                />
                            );
                        }
                    })}

                    {/* Display Extra Fields (3 Columns, spans full width) */}
                    {extraFields.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 col-span-1 md:col-span-2">
                            {extraFields.map(field => {
                                const isEditableField = isEditing && field.editable;

                                if (isEditableField) {
                                    return (
                                        <div key={field.key}>
                                            <label className="text-sm font-medium text-stone-500">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                value={editData[field.key]}
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                className="w-full mt-1 p-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <ProfileField 
                                            key={field.key} 
                                            label={field.label} 
                                            value={field.value} 
                                        />
                                    );
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