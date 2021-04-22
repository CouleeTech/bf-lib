import { ISODATE } from 'bf-types';
import { DateTime } from 'luxon';

/**
 * Format an ISO timestamp like the following: Oct 14, 1983, 1:30 PM
 *
 * @param date A date formatted as an ISO timestamp
 */
export function formatIsoDate(date: ISODATE): string {
  if (!date || typeof date !== 'string') {
    return '';
  }

  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
}

/**
 * Compare two date values by their year, month, and day.
 * Returns:
 *  -1   if the left date is before the day of the right.
 *   0   if the left date is on the same day as the right.
 *   1   if the left date is after the day of the right.
 *
 * @param left A date value.
 * @param right A date value.
 */
export function compareDates(left: Date, right: Date): number {
  const leftYear = left.getFullYear();
  const rightYear = right.getFullYear();
  const yearDiff = leftYear - rightYear;
  if (yearDiff < 0) {
    return -1;
  } else if (yearDiff > 0) {
    return 1;
  }

  const leftMonth = left.getMonth();
  const rightMonth = right.getMonth();
  const monthDiff = leftMonth - rightMonth;
  if (monthDiff < 0) {
    return -1;
  } else if (monthDiff > 0) {
    return 1;
  }

  const leftDay = left.getDate();
  const rightDay = right.getDate();
  const dayDiff = leftDay - rightDay;
  if (dayDiff < 0) {
    return -1;
  } else if (dayDiff > 0) {
    return 1;
  }

  return 0;
}
