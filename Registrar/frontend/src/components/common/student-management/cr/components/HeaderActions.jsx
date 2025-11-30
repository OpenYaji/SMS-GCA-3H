
import { notifyTeacher, notifyParents } from "../api/crApi";

const HeaderActions = ({ sectionId }) => {
  const handleNotifyTeacher = async () => {
    try {
      await notifyTeacher(sectionId);
      alert("Teacher notified!");
    } catch (err) {
      console.error(err);
      alert("Failed to notify teacher.");
    }
  };

  const handleNotifyParents = async () => {
    try {
      await notifyParents(sectionId);
      alert("Parents notified!");
    } catch (err) {
      console.error(err);
      alert("Failed to notify parents.");
    }
  };

  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-gray-700 rounded"
      >
        Print Roster
      </button>

      <button
        onClick={handleNotifyTeacher}
        className="px-4 py-2 bg-blue-600 rounded"
      >
        Notify Teacher
      </button>

      <button
        onClick={handleNotifyParents}
        className="px-4 py-2 bg-orange-600 rounded"
      >
        Notify Parents
      </button>
    </div>
  );
};

export default HeaderActions;