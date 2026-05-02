export function formatedDate(date?: string | Date, local = "en-US") {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "Invalid Date";

  return parsedDate.toLocaleDateString(local, {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}
