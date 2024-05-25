export const prettyDateTime = (date: Date) => {
  const d = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const t = date.toLocaleTimeString('en-IN'); // -> "7:38:05 AM"
  return `${d} ${t}`;
};
