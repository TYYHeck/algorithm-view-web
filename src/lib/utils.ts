import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const barColors = {
  default: 'bg-slate-500',
  compare: 'bg-amber-500',
  swap: 'bg-pink-500',
  sorted: 'bg-emerald-500',
  pivot: 'bg-sky-500',
  highlight: 'bg-violet-500',
  overwrite: 'bg-orange-500',
  merge: 'bg-cyan-500',
};

export const nodeColors = {
  default: '#475569',
  visited: '#10b981',
  current: '#3b82f6',
  exploring: '#f59e0b',
  mst: '#8b5cf6',
};

export const speedToMs = (speed: number): number => {
  const minSpeed = 50;
  const maxSpeed = 1000;
  return maxSpeed - ((speed - 1) / 9) * (maxSpeed - minSpeed);
};
