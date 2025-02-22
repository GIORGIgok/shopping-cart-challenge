export function formatDate(timestamp: string): string {
  const date = new Date(Number(timestamp));

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
