import { create } from 'zustand';
import type { AlgorithmStep, IAlgorithm, AlgorithmCategory } from '../algorithms/types';
import { generateRandomArray, generateRandomGraph } from '../algorithms';

type PlaybackStatus = 'idle' | 'running' | 'paused' | 'finished';

interface AlgorithmState {
  category: AlgorithmCategory;
  algorithm: IAlgorithm | null;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  status: PlaybackStatus;
  speed: number;
  inputData: any;
  currentData: any;
  statistics: {
    comparisons: number;
    swaps: number;
  };
}

interface AlgorithmActions {
  setCategory: (category: AlgorithmCategory) => void;
  setAlgorithm: (algo: IAlgorithm) => void;
  setInputData: (data: any) => void;
  executeAlgorithm: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  setCurrentStep: (index: number) => void;
  generateNewData: () => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  graphNodeCount: number;
  setGraphNodeCount: (count: number) => void;
}

const initialArray = generateRandomArray(15);

export const useAlgorithmStore = create<AlgorithmState & AlgorithmActions>((set, get) => ({
  category: 'sorting',
  algorithm: null,
  steps: [],
  currentStepIndex: -1,
  status: 'idle',
  speed: 5,
  inputData: { array: initialArray },
  currentData: { array: initialArray, sortedIndices: [] },
  statistics: { comparisons: 0, swaps: 0 },
  arraySize: 15,
  graphNodeCount: 8,

  setCategory: (category) => {
    set({ category, algorithm: null, steps: [], currentStepIndex: -1, status: 'idle' });
    get().generateNewData();
  },

  setAlgorithm: (algo) => {
    set({ algorithm: algo, steps: [], currentStepIndex: -1, status: 'idle' });
    get().executeAlgorithm();
  },

  setInputData: (data) => {
    set({ inputData: data, steps: [], currentStepIndex: -1, status: 'idle' });
    if (get().algorithm) {
      get().executeAlgorithm();
    }
  },

  executeAlgorithm: () => {
    const { algorithm, inputData } = get();
    if (!algorithm) return;

    const result = algorithm.execute(inputData);
    let currentData = { ...inputData, sortedIndices: [] };
    let comparisons = 0;
    let swaps = 0;

    set({
      steps: result.steps,
      currentStepIndex: -1,
      status: 'idle',
      currentData,
      statistics: { comparisons: 0, swaps: 0 },
    });
  },

  play: () => set({ status: 'running' }),
  pause: () => set({ status: 'paused' }),

  reset: () => {
    const { inputData } = get();
    set({
      currentStepIndex: -1,
      status: 'idle',
      currentData: { ...inputData, sortedIndices: [] },
      statistics: { comparisons: 0, swaps: 0 },
    });
  },

  stepForward: () => {
    const { steps, currentStepIndex, inputData } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ status: 'finished' });
      return;
    }

    const nextIndex = currentStepIndex + 1;
    const step = steps[nextIndex];
    const currentData = { ...get().currentData };
    const stats = { ...get().statistics };

    if (step.type === 'compare') {
      stats.comparisons++;
    } else if (step.type === 'swap') {
      stats.swaps++;
      if (currentData.array) {
        const arr = [...currentData.array];
        const [i, j] = step.indices;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        currentData.array = arr;
      }
    } else if (step.type === 'overwrite') {
      if (currentData.array) {
        const arr = [...currentData.array];
        const snapshot = step.data?.array;
        if (snapshot) {
          for (let i = 0; i < snapshot.length; i++) {
            if (snapshot[i] !== undefined) arr[i] = snapshot[i];
          }
        }
        currentData.array = arr;
      }
    } else if (step.type === 'sorted') {
      currentData.sortedIndices = [...step.indices];
    }

    if (step.data?.distances !== undefined) {
      currentData.distances = step.data.distances;
    }
    if (step.data?.visited !== undefined) {
      currentData.visited = step.data.visited;
    }
    if (step.data?.mstEdges !== undefined) {
      currentData.mstEdges = step.data.mstEdges;
    }
    if (step.data?.table !== undefined) {
      currentData.table = step.data.table;
    }
    if (step.data?.inDegree !== undefined) {
      currentData.inDegree = step.data.inDegree;
    }

    const newStatus = nextIndex >= steps.length - 1 ? 'finished' : get().status === 'running' ? 'running' : 'paused';

    set({
      currentStepIndex: nextIndex,
      currentData,
      statistics: stats,
      status: newStatus,
    });
  },

  stepBackward: () => {
    const { currentStepIndex, steps, inputData, algorithm } = get();
    if (currentStepIndex <= 0) {
      get().reset();
      return;
    }

    const targetIndex = currentStepIndex - 1;
    let currentData: any = { ...inputData, sortedIndices: [] };
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i <= targetIndex; i++) {
      const step = steps[i];
      if (step.type === 'compare') {
        comparisons++;
      } else if (step.type === 'swap') {
        swaps++;
        if (currentData.array) {
          const arr = [...currentData.array];
          const [a, b] = step.indices;
          [arr[a], arr[b]] = [arr[b], arr[a]];
          currentData.array = arr;
        }
      } else if (step.type === 'sorted') {
        currentData.sortedIndices = [...step.indices];
      }
      if (step.data?.distances !== undefined) currentData.distances = step.data.distances;
      if (step.data?.visited !== undefined) currentData.visited = step.data.visited;
      if (step.data?.mstEdges !== undefined) currentData.mstEdges = step.data.mstEdges;
      if (step.data?.table !== undefined) currentData.table = step.data.table;
    }

    set({
      currentStepIndex: targetIndex,
      currentData,
      statistics: { comparisons, swaps },
      status: 'paused',
    });
  },

  setSpeed: (speed) => set({ speed }),

  setCurrentStep: (index) => {
    const { steps, inputData } = get();
    if (index < -1 || index >= steps.length) return;

    if (index === -1) {
      get().reset();
      return;
    }

    let currentData: any = { ...inputData, sortedIndices: [] };
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i <= index; i++) {
      const step = steps[i];
      if (step.type === 'compare') comparisons++;
      else if (step.type === 'swap') {
        swaps++;
        if (currentData.array) {
          const arr = [...currentData.array];
          const [a, b] = step.indices;
          [arr[a], arr[b]] = [arr[b], arr[a]];
          currentData.array = arr;
        }
      } else if (step.type === 'sorted') {
        currentData.sortedIndices = [...step.indices];
      }
      if (step.data?.distances !== undefined) currentData.distances = step.data.distances;
      if (step.data?.visited !== undefined) currentData.visited = step.data.visited;
      if (step.data?.mstEdges !== undefined) currentData.mstEdges = step.data.mstEdges;
      if (step.data?.table !== undefined) currentData.table = step.data.table;
    }

    set({
      currentStepIndex: index,
      currentData,
      statistics: { comparisons, swaps },
      status: index >= steps.length - 1 ? 'finished' : 'paused',
    });
  },

  generateNewData: () => {
    const { category, arraySize, graphNodeCount } = get();
    let newData: any;

    if (category === 'sorting') {
      newData = { array: generateRandomArray(arraySize) };
    } else if (category === 'graph') {
      const { nodes, edges } = generateRandomGraph(graphNodeCount, 0.4, true);
      const positions: Record<number, { x: number; y: number }> = {};
      const centerX = 300;
      const centerY = 250;
      const radius = 200;
      nodes.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
        positions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
      const positionedNodes = nodes.map(n => ({ ...n, x: positions[n.id].x, y: positions[n.id].y }));
      newData = { nodes: positionedNodes, edges, startNode: 0 };
    } else if (category === 'dp') {
      newData = {
        n: 10,
        nums: [10, 9, 2, 5, 3, 7, 101, 18],
        weights: [2, 3, 4, 5],
        values: [3, 4, 5, 6],
        capacity: 8,
        text1: 'ABCBDAB',
        text2: 'BDCABA',
        coins: [1, 2, 5],
        amount: 11,
      };
    }

    set({
      inputData: newData,
      steps: [],
      currentStepIndex: -1,
      status: 'idle',
      currentData: newData && 'array' in newData ? { ...newData, sortedIndices: [] } : newData,
      statistics: { comparisons: 0, swaps: 0 },
    });

    if (get().algorithm) {
      get().executeAlgorithm();
    }
  },

  setArraySize: (size) => {
    set({ arraySize: size });
    if (get().category === 'sorting') {
      get().generateNewData();
    }
  },

  setGraphNodeCount: (count) => {
    set({ graphNodeCount: count });
    if (get().category === 'graph') {
      get().generateNewData();
    }
  },
}));
