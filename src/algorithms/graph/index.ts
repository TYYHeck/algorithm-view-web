import { AlgorithmStep, IAlgorithm, GraphInput, GraphState, GraphEdge } from '../types';

abstract class GraphAlgorithm implements IAlgorithm<GraphInput, GraphState> {
  abstract name: string;
  abstract nameEn: string;
  category = 'graph' as const;
  abstract timeComplexity: { best: string; average: string; worst: string };
  abstract spaceComplexity: string;
  abstract description: string;
  abstract code: string;

  abstract execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState };

  protected createStep(
    type: AlgorithmStep['type'],
    indices: number[],
    description: string,
    data?: Record<string, any>,
    codeLine?: number
  ): AlgorithmStep {
    return { type, indices, description, data, codeLine };
  }

  protected getAdjacencyList(nodes: { id: number }[], edges: GraphEdge[]): Map<number, number[]> {
    const adj = new Map<number, number[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push(e.to);
      adj.get(e.to)?.push(e.from);
    });
    return adj;
  }

  protected getWeightedAdjacencyList(nodes: { id: number }[], edges: GraphEdge[]): Map<number, { to: number; weight: number }[]> {
    const adj = new Map<number, { to: number; weight: number }[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      const w = e.weight ?? 1;
      adj.get(e.from)?.push({ to: e.to, weight: w });
      adj.get(e.to)?.push({ to: e.from, weight: w });
    });
    return adj;
  }
}

export class BFS extends GraphAlgorithm {
  name = '广度优先搜索';
  nameEn = 'BFS';
  timeComplexity = { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' };
  spaceComplexity = 'O(V)';
  description = '从起点开始，逐层向外扩展访问节点，使用队列实现。';
  code = `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const startNode = input.startNode ?? nodes[0]?.id ?? 0;
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];
    const adj = this.getAdjacencyList(nodes, edges);

    steps.push(this.createStep('current-node', [startNode], `从起点 ${startNode} 开始BFS`, { queue: [startNode] }, 2));

    const queue: number[] = [startNode];
    const visitedSet = new Set<number>([startNode]);

    while (queue.length > 0) {
      const node = queue.shift()!;
      visited.push(node);
      steps.push(this.createStep('visit', [node], `访问节点 ${node}`, { queue: [...queue], visited: [...visited] }, 7));

      const neighbors = adj.get(node) ?? [];
      for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          queue.push(neighbor);
          steps.push(this.createStep('explore', [node, neighbor], `发现邻居 ${neighbor}，加入队列`, { queue: [...queue] }, 10));
        }
      }
    }

    steps.push(this.createStep('mark-visited', visited, 'BFS遍历完成', { visited: [...visited] }, 14));

    return {
      steps,
      finalState: { nodes, edges, visited }
    };
  }
}

export class DFS extends GraphAlgorithm {
  name = '深度优先搜索';
  nameEn = 'DFS';
  timeComplexity = { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' };
  spaceComplexity = 'O(V)';
  description = '从起点开始，沿着一条路径尽可能深地访问，回溯后继续探索。';
  code = `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const startNode = input.startNode ?? nodes[0]?.id ?? 0;
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];
    const adj = this.getAdjacencyList(nodes, edges);
    const visitedSet = new Set<number>();

    const dfsHelper = (node: number, depth: number = 0) => {
      visitedSet.add(node);
      visited.push(node);
      steps.push(this.createStep('visit', [node], `深度 ${depth}: 访问节点 ${node}`, { visited: [...visited] }, 2));

      const neighbors = adj.get(node) ?? [];
      for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor)) {
          steps.push(this.createStep('explore', [node, neighbor], `从 ${node} 探索到 ${neighbor}`, undefined, 4));
          dfsHelper(neighbor, depth + 1);
          steps.push(this.createStep('process', [node], `回溯到节点 ${node}`, { depth }, 7));
        }
      }
    };

    steps.push(this.createStep('current-node', [startNode], `从起点 ${startNode} 开始DFS`, undefined, 0));
    dfsHelper(startNode);
    steps.push(this.createStep('mark-visited', visited, 'DFS遍历完成', { visited: [...visited] }, 8));

    return {
      steps,
      finalState: { nodes, edges, visited }
    };
  }
}

export class Dijkstra extends GraphAlgorithm {
  name = 'Dijkstra最短路径';
  nameEn = 'Dijkstra';
  timeComplexity = { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' };
  spaceComplexity = 'O(V)';
  description = '单源最短路径算法，从起点出发，贪心选择距离最近的未访问节点。';
  code = `function dijkstra(graph, start) {
  const dist = {};
  const visited = new Set();
  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
  }
  dist[start] = 0;
  
  while (visited.size < Object.keys(graph).length) {
    let minDist = Infinity;
    let minNode = null;
    for (const node of Object.keys(graph)) {
      if (!visited.has(node) && dist[node] < minDist) {
        minDist = dist[node];
        minNode = node;
      }
    }
    if (minNode === null) break;
    visited.add(minNode);
    
    for (const { to, weight } of graph[minNode]) {
      if (!visited.has(to)) {
        const newDist = dist[minNode] + weight;
        if (newDist < dist[to]) {
          dist[to] = newDist;
        }
      }
    }
  }
  return dist;
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const startNode = input.startNode ?? nodes[0]?.id ?? 0;
    const steps: AlgorithmStep[] = [];
    const adj = this.getWeightedAdjacencyList(nodes, edges);
    
    const dist: Record<number, number> = {};
    const visited: number[] = [];
    const visitedSet = new Set<number>();
    const nodeIds = nodes.map(n => n.id);

    nodeIds.forEach(id => { dist[id] = Infinity; });
    dist[startNode] = 0;

    steps.push(this.createStep('current-node', [startNode], `初始化: dist[${startNode}]=0, 其他=Infinity`, { dist: { ...dist } }, 5));

    while (visited.length < nodeIds.length) {
      let minDist = Infinity;
      let minNode: number | null = null;
      
      for (const id of nodeIds) {
        if (!visitedSet.has(id) && dist[id] < minDist) {
          minDist = dist[id];
          minNode = id;
        }
      }

      if (minNode === null) break;

      visitedSet.add(minNode);
      visited.push(minNode);
      steps.push(this.createStep('visit', [minNode], `选择节点 ${minNode}，距离 = ${dist[minNode]}`, { dist: { ...dist }, visited: [...visited] }, 9));

      const neighbors = adj.get(minNode) ?? [];
      for (const { to, weight } of neighbors) {
        if (!visitedSet.has(to)) {
          const newDist = dist[minNode] + weight;
          steps.push(this.createStep('explore', [minNode, to], `检查边 ${minNode}->${to} (权重${weight}): ${dist[minNode]} + ${weight} = ${newDist}`, { dist: { ...dist } }, 17));
          if (newDist < dist[to]) {
            dist[to] = newDist;
            steps.push(this.createStep('update-distance', [to], `更新 dist[${to}] = ${newDist}`, { dist: { ...dist } }, 19));
          }
        }
      }
    }

    steps.push(this.createStep('mark-visited', visited, 'Dijkstra完成', { dist: { ...dist }, visited: [...visited] }, 22));

    return {
      steps,
      finalState: { nodes, edges, visited, distances: nodeIds.map(id => dist[id]) }
    };
  }
}

export class Prim extends GraphAlgorithm {
  name = 'Prim最小生成树';
  nameEn = 'Prim';
  timeComplexity = { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' };
  spaceComplexity = 'O(V)';
  description = '从任意节点开始，贪心选择连接已访问和未访问节点的最小权边。';
  code = `function prim(graph, start) {
  const mst = [];
  const visited = new Set([start]);
  const edges = [];
  
  while (visited.size < Object.keys(graph).length) {
    let minEdge = null;
    let minWeight = Infinity;
    
    for (const node of visited) {
      for (const { to, weight } of graph[node]) {
        if (!visited.has(to) && weight < minWeight) {
          minWeight = weight;
          minEdge = { from: node, to, weight };
        }
      }
    }
    
    if (minEdge) {
      mst.push(minEdge);
      visited.add(minEdge.to);
    }
  }
  return mst;
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const startNode = input.startNode ?? nodes[0]?.id ?? 0;
    const steps: AlgorithmStep[] = [];
    const adj = this.getWeightedAdjacencyList(nodes, edges);
    const nodeIds = nodes.map(n => n.id);
    
    const mstEdges: GraphEdge[] = [];
    const visited: number[] = [startNode];
    const visitedSet = new Set<number>([startNode]);
    let totalWeight = 0;

    steps.push(this.createStep('current-node', [startNode], `从节点 ${startNode} 开始Prim算法`, { mstEdges: [] }, 2));

    while (visited.length < nodeIds.length) {
      let minEdge: { from: number; to: number; weight: number } | null = null;
      let minWeight = Infinity;
      const candidateEdges: { from: number; to: number; weight: number }[] = [];

      for (const node of visited) {
        const neighbors = adj.get(node) ?? [];
        for (const { to, weight } of neighbors) {
          if (!visitedSet.has(to)) {
            candidateEdges.push({ from: node, to, weight });
            if (weight < minWeight) {
              minWeight = weight;
              minEdge = { from: node, to, weight };
            }
          }
        }
      }

      if (!minEdge) break;

      steps.push(this.createStep('select-edge', [minEdge.from, minEdge.to], `选择最小边 ${minEdge.from}-${minEdge.to} (权重 ${minEdge.weight})`, { candidateEdges, minEdge }, 7));

      mstEdges.push({ from: minEdge.from, to: minEdge.to, weight: minEdge.weight });
      visitedSet.add(minEdge.to);
      visited.push(minEdge.to);
      totalWeight += minEdge.weight;

      steps.push(this.createStep('add-to-mst', [minEdge.to], `节点 ${minEdge.to} 加入MST，总权重 = ${totalWeight}`, { mstEdges: [...mstEdges], visited: [...visited] }, 16));
    }

    steps.push(this.createStep('mark-visited', visited, `Prim完成，MST总权重 = ${totalWeight}`, { mstEdges: [...mstEdges], totalWeight }, 18));

    return {
      steps,
      finalState: { nodes, edges, visited, mstEdges }
    };
  }
}

export class Kruskal extends GraphAlgorithm {
  name = 'Kruskal最小生成树';
  nameEn = 'Kruskal';
  timeComplexity = { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' };
  spaceComplexity = 'O(E + V)';
  description = '将所有边按权排序，依次加入不形成环的边，使用并查集判环。';
  code = `function kruskal(graph, nodes) {
  const edges = [];
  for (const from of Object.keys(graph)) {
    for (const { to, weight } of graph[from]) {
      if (from < to) edges.push({ from, to, weight });
    }
  }
  edges.sort((a, b) => a.weight - b.weight);
  
  const parent = {};
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x, y) => {
    parent[find(x)] = find(y);
  };
  
  nodes.forEach(n => parent[n] = n);
  const mst = [];
  
  for (const edge of edges) {
    if (find(edge.from) !== find(edge.to)) {
      mst.push(edge);
      union(edge.from, edge.to);
    }
  }
  return mst;
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const steps: AlgorithmStep[] = [];
    const nodeIds = nodes.map(n => n.id);
    
    const allEdges: { from: number; to: number; weight: number }[] = [];
    const seen = new Set<string>();
    edges.forEach(e => {
      const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      if (!seen.has(key)) {
        seen.add(key);
        allEdges.push({ from: e.from, to: e.to, weight: e.weight ?? 1 });
      }
    });

    allEdges.sort((a, b) => a.weight - b.weight);
    steps.push(this.createStep('highlight', nodeIds, `所有边按权重排序: ${allEdges.map(e => `${e.from}-${e.to}(${e.weight})`).join(', ')}`, { sortedEdges: [...allEdges] }, 2));

    const parent: Record<number, number> = {};
    nodeIds.forEach(id => { parent[id] = id; });

    const find = (x: number): number => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };

    const union = (x: number, y: number) => {
      parent[find(x)] = find(y);
    };

    const mstEdges: GraphEdge[] = [];
    const visited: number[] = [];
    const visitedSet = new Set<number>();
    let totalWeight = 0;

    for (const edge of allEdges) {
      steps.push(this.createStep('select-edge', [edge.from, edge.to], `检查边 ${edge.from}-${edge.to} (权重 ${edge.weight})`, { mstEdges: [...mstEdges] }, 17));
      
      if (find(edge.from) !== find(edge.to)) {
        mstEdges.push({ from: edge.from, to: edge.to, weight: edge.weight });
        totalWeight += edge.weight;
        if (!visitedSet.has(edge.from)) { visitedSet.add(edge.from); visited.push(edge.from); }
        if (!visitedSet.has(edge.to)) { visitedSet.add(edge.to); visited.push(edge.to); }
        union(edge.from, edge.to);
        steps.push(this.createStep('add-to-mst', [edge.from, edge.to], `加入MST (不形成环)，总权重 = ${totalWeight}`, { mstEdges: [...mstEdges], parent: { ...parent } }, 18));
      } else {
        steps.push(this.createStep('process', [edge.from, edge.to], '跳过 (形成环)', { skipped: true }, 20));
      }

      if (mstEdges.length >= nodeIds.length - 1) break;
    }

    steps.push(this.createStep('mark-visited', visited, `Kruskal完成，MST总权重 = ${totalWeight}`, { mstEdges: [...mstEdges], totalWeight }, 22));

    return {
      steps,
      finalState: { nodes, edges, visited, mstEdges }
    };
  }
}

export class Floyd extends GraphAlgorithm {
  name = 'Floyd最短路径';
  nameEn = 'Floyd';
  timeComplexity = { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' };
  spaceComplexity = 'O(V²)';
  description = '多源最短路径，动态规划思想，三重循环逐步更新最短距离矩阵。';
  code = `function floyd(graph, nodes) {
  const n = nodes.length;
  const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
  
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const from of Object.keys(graph)) {
    for (const { to, weight } of graph[from]) {
      dist[from][to] = weight;
    }
  }
  
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const steps: AlgorithmStep[] = [];
    const n = nodes.length;
    const idToIdx = new Map<number, number>();
    nodes.forEach((node, idx) => idToIdx.set(node.id, idx));

    const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;

    edges.forEach(e => {
      const i = idToIdx.get(e.from)!;
      const j = idToIdx.get(e.to)!;
      const w = e.weight ?? 1;
      dist[i][j] = w;
      dist[j][i] = w;
    });

    steps.push(this.createStep('highlight', nodes.map(n => n.id), '初始化距离矩阵', { dist: dist.map(r => [...r]) }, 4));

    for (let k = 0; k < n; k++) {
      const kNode = nodes[k].id;
      steps.push(this.createStep('current-node', [kNode], `中间节点 k = ${kNode} (第 ${k + 1} 轮)`, { k, dist: dist.map(r => [...r]) }, 11));
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push(this.createStep('update-distance', [nodes[i].id, nodes[j].id], 
              `dist[${nodes[i].id}][${nodes[j].id}] = dist[${nodes[i].id}][${kNode}] + dist[${kNode}][${nodes[j].id}] = ${dist[i][j]}`,
              { dist: dist.map(r => [...r]), i, j, k }, 14));
          }
        }
      }
    }

    steps.push(this.createStep('mark-visited', nodes.map(n => n.id), 'Floyd算法完成', { dist: dist.map(r => [...r]) }, 17));

    return {
      steps,
      finalState: { nodes, edges, visited: nodes.map(n => n.id) }
    };
  }
}

export class TopologicalSort extends GraphAlgorithm {
  name = '拓扑排序';
  nameEn = 'Topological Sort';
  timeComplexity = { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' };
  spaceComplexity = 'O(V)';
  description = '对有向无环图的节点排序，使得所有边从排在前面的节点指向后面的节点。';
  code = `function topologicalSort(graph, nodes) {
  const inDegree = {};
  nodes.forEach(n => inDegree[n] = 0);
  for (const from of Object.keys(graph)) {
    for (const to of graph[from]) {
      inDegree[to]++;
    }
  }
  
  const queue = nodes.filter(n => inDegree[n] === 0);
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  return result;
}`;

  execute(input: GraphInput): { steps: AlgorithmStep[]; finalState: GraphState } {
    const { nodes, edges } = input;
    const steps: AlgorithmStep[] = [];
    const nodeIds = nodes.map(n => n.id);

    const inDegree: Record<number, number> = {};
    nodeIds.forEach(id => { inDegree[id] = 0; });

    const adj = new Map<number, number[]>();
    nodeIds.forEach(id => adj.set(id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push(e.to);
      inDegree[e.to]++;
    });

    steps.push(this.createStep('highlight', nodeIds, `计算入度: ${nodeIds.map(id => `${id}(${inDegree[id]})`).join(', ')}`, { inDegree: { ...inDegree } }, 5));

    const queue: number[] = nodeIds.filter(id => inDegree[id] === 0);
    const result: number[] = [];

    steps.push(this.createStep('current-node', queue, `入度为0的节点入队: [${queue.join(', ')}]`, { queue: [...queue] }, 8));

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);
      steps.push(this.createStep('visit', [node], `取出节点 ${node}，加入结果`, { result: [...result], queue: [...queue] }, 11));

      const neighbors = adj.get(node) ?? [];
      for (const neighbor of neighbors) {
        inDegree[neighbor]--;
        steps.push(this.createStep('explore', [node, neighbor], `节点 ${neighbor} 入度减为 ${inDegree[neighbor]}`, { inDegree: { ...inDegree } }, 13));
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
          steps.push(this.createStep('process', [neighbor], `节点 ${neighbor} 入度为0，入队`, { queue: [...queue] }, 15));
        }
      }
    }

    const success = result.length === nodeIds.length;
    steps.push(this.createStep('mark-visited', result, 
      success ? `拓扑排序完成: [${result.join(' → ')}]` : '图中存在环，无法拓扑排序', 
      { result: [...result], success }, 18));

    return {
      steps,
      finalState: { nodes, edges, visited: result }
    };
  }
}

export const graphAlgorithms = [
  new BFS(),
  new DFS(),
  new Dijkstra(),
  new Prim(),
  new Kruskal(),
  new Floyd(),
  new TopologicalSort(),
];
