import { sortingAlgorithms } from './sorting';
import { graphAlgorithms } from './graph';
import { dpAlgorithms } from './dp';
import type { IAlgorithm, AlgorithmCategory } from './types';

export const allAlgorithms: IAlgorithm[] = [
  ...sortingAlgorithms,
  ...graphAlgorithms,
  ...dpAlgorithms,
];

export const algorithmsByCategory: Record<AlgorithmCategory, IAlgorithm[]> = {
  sorting: sortingAlgorithms,
  graph: graphAlgorithms,
  dp: dpAlgorithms,
};

export const categoryNames: Record<AlgorithmCategory, string> = {
  sorting: '排序算法',
  graph: '图论算法',
  dp: '动态规划',
};

export function getAlgorithmByName(name: string): IAlgorithm | undefined {
  return allAlgorithms.find(a => a.name === name || a.nameEn === name);
}

export function generateRandomArray(size: number, min: number = 5, max: number = 100): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

export function generateRandomGraph(nodeCount: number, edgeDensity: number = 0.4, weighted: boolean = true) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    label: String(i),
  }));

  const edges: { from: number; to: number; weight?: number }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < edgeDensity) {
        const key = `${i}-${j}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({
            from: i,
            to: j,
            weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined,
          });
        }
      }
    }
  }

  if (edges.length < nodeCount - 1) {
    for (let i = 1; i < nodeCount; i++) {
      const j = Math.floor(Math.random() * i);
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({
          from: j,
          to: i,
          weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined,
        });
      }
    }
  }

  return { nodes, edges };
}
