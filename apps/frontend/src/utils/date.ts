export const prettyDateTime = (date: Date) => {
  const d = prettyDate(date);
  const t = prettyTime(date);
  return `${d} ${t}`;
};

export const prettyDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const prettyTime = (date: Date) => {
  return date.toLocaleTimeString('en-IN');
};
