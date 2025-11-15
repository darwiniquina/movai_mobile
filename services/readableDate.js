export default function readableDate(input) {
  const date = new Date(input);

  if (isNaN(date)) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}