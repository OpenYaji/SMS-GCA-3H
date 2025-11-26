export default function useTransactionSort(data, sortOption) {
  if (!Array.isArray(data)) return [];

  const sorted = [...data];

  switch (sortOption) {
    case "Newest First":
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "Oldest First":
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "Amount (High to Low)":
      return sorted.sort(
        (a, b) =>
          parseFloat(b.amount.replace("$", "")) -
          parseFloat(a.amount.replace("$", ""))
      );
    case "Amount (Low to High)":
      return sorted.sort(
        (a, b) =>
          parseFloat(a.amount.replace("$", "")) -
          parseFloat(b.amount.replace("$", ""))
      );
    case "Alphabetical (A-Z)":
      return sorted.sort((a, b) => a.user.localeCompare(b.user));
    case "Alphabetical (Z-A)":
      return sorted.sort((a, b) => b.user.localeCompare(a.user));
    default:
      return sorted;
  }
}
