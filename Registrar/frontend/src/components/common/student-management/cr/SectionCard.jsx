
const SectionCard = ({ data, onClick }) => {
  const current = parseInt(data.CurrentEnrollment ?? 0);
  const max = parseInt(data.MaxCapacity ?? 0);

  const ratio = max > 0 ? current / max : 0;

  const capacityColor =
    ratio === 1
      ? "bg-red-600"
      : ratio >= 0.8
      ? "bg-yellow-500"
      : "bg-green-600";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gray-900 p-5 rounded-xl border border-gray-700 
                 hover:border-blue-400 hover:shadow-lg transition-all duration-150"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <p className="text-lg font-semibold text-yellow-500">{data.SectionName}</p>

        {/* Capacity Badge */}
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full text-white ${capacityColor}`}
        >
          {current}/{max}
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
        {/* clock icon */}
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
          />
        </svg>

        <span>{data.time ?? "No schedule"}</span>
      </div>

      {/* Adviser */}
      <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
        {/* user icon */}
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A9 9 0 1118.9 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <span>{data.AdviserName ?? "No adviser"}</span>
      </div>
    </div>
  );
};

export default SectionCard;


