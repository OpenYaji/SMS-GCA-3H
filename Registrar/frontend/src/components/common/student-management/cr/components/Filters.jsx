const Filters = ({ search, setSearch }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <input
        type="text"
        placeholder="Search sections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-700 p-3 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Filters;
