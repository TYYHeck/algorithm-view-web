export type AlgorithmCategory = 'sorting' | 'graph' | 'dp';

export type SortingStepType = 
  | 'compare' 
  | 'swap' 
  | 'sorted' 
  | 'pivot' 
  | 'merge' 
  | 'overwrite'
  | 'highlight';

export type GraphStepType =
  | 'visit'
  | 'process'
  | 'explore'
  | 'update-distance'
  | 'select-edge'
  | 'add-to-mst'
  | 'mark-visited'
  | 'current-node';

export type DPStepType =
  | 'init'
  | 'compute'
  | 'fill-cell'
  | 'highlight-row'
  | 'highlight-col'
  | 'state-transfer';

export type AlgorithmStepType = SortingStepType | GraphStepType | DPStepType;

export interface AlgorithmStep {
  type: AlgorithmStepType;
  indices: number[];
  description: string;
  data?: Record<string, any>;
  codeLine?: number;
}

export interface AlgorithmResult<T = any> {
  steps: AlgorithmStep[];
  finalState: T;
}

export interface AlgorithmInfo {
  name: string;
  nameEn: string;
  category: AlgorithmCategory;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  stable?: boolean;
}

export interface IAlgorithm<TInput = any, TResult = any> extends AlgorithmInfo {
  code: string;
  execute(input: TInput): AlgorithmResult<TResult>;
}

export interface SortingInput {
  array: number[];
}

export interface SortingState {
  array: number[];
  sortedIndices: number[];
}

export interface GraphNode {
  id: number;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode?: number;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: number[];
  distances?: number[];
  currentNode?: number;
  mstEdges?: GraphEdge[];
}

export interface DPInput {
  type: string;
  [key: string]: any;
}

export interface DPState {
  table: number[][];
  currentRow?: number;
  currentCol?: number;
  [key: string]: any;
}
