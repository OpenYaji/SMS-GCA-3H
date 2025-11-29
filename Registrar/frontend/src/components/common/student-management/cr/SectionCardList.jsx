import { useEffect, useState } from "react";
import { getSections } from "./api/crApi";
import SectionCard from "./SectionCard";

const SectionCardList = ({ search, onSelectSection }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSections();
        setSections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
      }
    };
    fetchSections();
  }, []);

  // ✅ Apply search filter
  const filteredSections = sections.filter((section) =>
    section.SectionName.toLowerCase().includes(search.toLowerCase())
  );

  if (!filteredSections.length) {
    return (
      <p className="text-center text-gray-500">
        No sections found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredSections.map((section) => (
        <SectionCard
          key={section.SectionID}
          data={section}
          onClick={() => onSelectSection(section)}
        />
      ))}
    </div>
  );
};

export default SectionCardList;
