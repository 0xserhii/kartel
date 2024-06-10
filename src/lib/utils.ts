import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMillisecondsShort = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const shortMilliseconds = Math.floor((ms % 1000) / 10);
  const formattedMilliseconds = shortMilliseconds.toString().padStart(2, '0');
  return `${totalSeconds}:${formattedMilliseconds}`;
};
