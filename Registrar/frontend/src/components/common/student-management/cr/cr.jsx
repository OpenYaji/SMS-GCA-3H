import { useState } from "react";
import Filters from "./components/Filters";
import SectionCardList from "./SectionCardList";
import SectionModal from "./components/SectionModal";

const CR = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [search, setSearch] = useState(""); // <-- search state here

  return (
    <div className="w-full h-full space-y-6 text-white">
      
      {/* Pass search & setSearch to Filters */}
      <Filters search={search} setSearch={setSearch} />

      {/* Pass search to SectionCardList */}
      <SectionCardList 
        search={search}
        onSelectSection={setSelectedSection} 
      />

      {selectedSection && (
        <SectionModal
          section={selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}
    </div>
  );
};

export default CR;