export function cleanObject(obj: Record<string, any>): Record<string, any> {
  const copy = { ...obj };
  Object.keys(copy).forEach((key) => {
    const prop = obj[key];
    if (prop === null || prop === undefined || prop === '') {
      delete copy[key];
    }
  });
  return copy;
}

export const getZeroTime = () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  return midnight.getTime();
};

export const getTimestampDaysFromNow = (days: number) => {
  const currentDate = new Date();
  const daysLater = new Date(currentDate);
  daysLater.setDate(currentDate.getDate() + days);
  daysLater.setHours(0, 0, 0, 0);
  return daysLater.getTime();
};

export const timeFormat = (timestamp: number) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDate = new Date(timestamp)
    .toLocaleString('ja-JP', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replaceAll('/', '.');

  return formattedDate;
};

export const hourtimestamp = 60 * 60 * 1000;
