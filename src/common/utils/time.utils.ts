import type { Await } from '../types';
import { getRandomInt } from './number.utils';

/**
 * Return a promise that will resolve after the given number of milliseconds
 *
 * @param time The time in milliseconds to wait before resolving the promise
 */
export function sleep(time: number): Promise<void> {
  return new Promise((done) => {
    setTimeout(done, time);
  });
}

type Callback = (...args: any[]) => any;

export function withDelay<CB extends Callback>(ms: number) {
  return (callback: CB): (() => Promise<Await<ReturnType<Callback>>>) => delay<CB>(ms, callback);
}

export function delay<CB extends Callback>(ms: number, callback?: CB): () => Promise<Await<ReturnType<CB>>> {
  return () => new Promise((resolve) => setTimeout(resolve, ms)).then(callback);
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function minutesToMs(minutes: number): number {
  return minutes * 60000;
}

/**
 * Check to see if two UNIX timestamps have the same minute value
 */
export function haveSameMinute(left: number, right: number): boolean {
  return new Date(left).getMinutes() === new Date(right).getMinutes();
}

export function randomDelay<CB extends Callback>(min: number, max: number) {
  return (callback: CB): Promise<any> =>
    new Promise((resolve) => setTimeout(resolve, getRandomInt(min, max))).then(callback);
}

export function debounce<T extends (...args: any[]) => any>(cb: T, wait = 20): T {
  let timeout: NodeJS.Timeout | null = null;

  const callable = (...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => cb(...args), wait);
  };

  return callable as T;
}

export function formatMs(ms: number): string {
  if (ms <= 0) {
    return 'N/a';
  }

  if (ms <= 1000) {
    return '1s';
  }

  const seconds = ms / 1000;
  if (seconds < 60) {
    return String(Math.floor(seconds)) + 's';
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return String(Math.floor(minutes)) + 'm';
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return String(Math.floor(hours)) + 'h';
  }

  const days = hours / 24;
  return String(Math.floor(days)) + 'd';
}

export function getHoursFromMs(ms: number): number {
  return Math.floor(ms / 3600000);
}

export function hrsToMs(hrs: number): number {
  return hrs * 3600000;
}
