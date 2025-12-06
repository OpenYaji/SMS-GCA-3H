import React from "react";
import { useState } from "react";
import DocumentRequests from "../common/records/DocumentRequests";
import CompletedRequestHistory from "../common/records/CompletedRequest";
import ArchiveSearch from "../common/records/archivesearch";

const RecordPage = () => {
  const [activeTab, setActiveTab] = useState("DocReq");

  const tabs = [
    {
      id: "DocReq",
      label: "Document Request",
      component: DocumentRequests,
    },
    {
      id: "DocLog",
      label: "Completed Request",
      component: CompletedRequestHistory,
    },
    { id: "archive", 
      label: "Archive Search", 
      component: ArchiveSearch },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Records and Archives
          </h1>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default RecordPage;
