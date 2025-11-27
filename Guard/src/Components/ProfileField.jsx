import React from 'react';
import ChevronDown from './ChevronDown.jsx';
import HelpCircle from './HelpCircle.jsx';

const ProfileField = ({ label, value, isLink = false }) => {
    const PhilippineFlag = () => (
        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <span role="img" aria-label="Philippine Flag">🇵🇭</span>
        </div>
    );

    if (isLink) {
        return (
            <div className="flex flex-col">
                <label className="text-xs font-semibold uppercase text-stone-500 mb-1">{label}</label>
                <div className="flex border border-stone-300 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center px-3 py-3 border-r border-stone-300 bg-white cursor-pointer hover:bg-stone-50 transition-colors">
                        <PhilippineFlag />
                        <ChevronDown className="w-3 h-3 text-stone-500 transform rotate-[-90deg] ml-1" />
                    </div>
                    <div className="flex-1 px-3 py-3 flex items-center text-stone-800 font-medium">
                        {value}
                    </div>
                    <div className="px-3 py-3 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-stone-400" strokeWidth="1.5" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase text-stone-500 mb-1">{label}</label>
            <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                <span className="text-stone-800 font-medium">
                    {value}
                </span>
            </div>
        </div>
    );
};

export default ProfileField;
