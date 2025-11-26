export default function Tabs({ activeTab, onChangeTab, darkMode }) {
  const tabs = [
    "Students",
    "Parents/Escorts",
    "Teachers",
    "Guards",
    "Registrars",
    "Admins",
  ];

  return (
    <div className="flex justify-between flex-wrap px-3 mb-4 w-full gap-7">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeTab(tab)}
          className={`flex-1 mx-1 py-3 rounded-lg font-kumbh text-base transform transition-all duration-300 shadow-inner ${
            darkMode ? "shadow-gray-700" : "shadow-gray-300"
          } ${
            activeTab === tab
              ? "bg-yellow-400 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.25)] scale-[1.02]"
              : `${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                } hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.25)]`
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
