export default function useSearch(data, query, keys = []) {
  if (!query.trim()) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter((item) =>
    keys.some((key) => (item[key] || "").toLowerCase().includes(lowerQuery))
  );
}
