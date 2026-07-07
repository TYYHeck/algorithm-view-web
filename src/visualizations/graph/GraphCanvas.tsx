import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { nodeColors } from '../../lib/utils';
import type { AlgorithmStep } from '../../algorithms/types';
import { useMemo } from 'react';

export function GraphCanvas() {
  const { currentData, steps, currentStepIndex } = useAlgorithmStore();
  const nodes = currentData?.nodes ?? [];
  const edges = currentData?.edges ?? [];
  const visited = currentData?.visited ?? [];
  const mstEdges = currentData?.mstEdges ?? [];
  const distances = currentData?.distances;

  const activeStep = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) return null;
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const activeIndices = activeStep?.indices ?? [];
  const activeType = activeStep?.type;

  const getNodeColor = (nodeId: number): string => {
    if (activeType === 'current-node' && activeIndices.includes(nodeId)) return nodeColors.current;
    if (activeType === 'visit' && activeIndices.includes(nodeId)) return nodeColors.current;
    if (activeType === 'add-to-mst' && activeIndices.includes(nodeId)) return nodeColors.mst;
    if (visited.includes(nodeId)) return nodeColors.visited;
    if (activeIndices.includes(nodeId)) return nodeColors.exploring;
    return nodeColors.default;
  };

  const getNodeRadius = (nodeId: number): number => {
    if (activeIndices.includes(nodeId)) return 24;
    return 20;
  };

  const isMstEdge = (from: number, to: number): boolean => {
    return mstEdges.some(e => 
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  };

  const isActiveEdge = (from: number, to: number): boolean => {
    if (activeIndices.length < 2) return false;
    const [a, b] = activeIndices;
    return (a === from && b === to) || (a === to && b === from);
  };

  const getEdgeColor = (from: number, to: number): string => {
    if (isActiveEdge(from, to)) {
      if (activeType === 'add-to-mst' || activeType === 'select-edge') return '#8b5cf6';
      return '#f59e0b';
    }
    if (isMstEdge(from, to)) return '#8b5cf6';
    return '#475569';
  };

  const getEdgeWidth = (from: number, to: number): number => {
    if (isActiveEdge(from, to)) return 4;
    if (isMstEdge(from, to)) return 3;
    return 2;
  };

  if (nodes.length === 0) return null;

  const width = 600;
  const height = 500;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="max-w-full max-h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          const x1 = fromNode.x ?? 0;
          const y1 = fromNode.y ?? 0;
          const x2 = toNode.x ?? 0;
          const y2 = toNode.y ?? 0;
          const color = getEdgeColor(edge.from, edge.to);
          const strokeWidth = getEdgeWidth(edge.from, edge.to);

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={strokeWidth}
                className="transition-all duration-300"
                filter={isActiveEdge(edge.from, edge.to) ? 'url(#glow)' : undefined}
              />
              {edge.weight !== undefined && (
                <g>
                  <circle cx={midX} cy={midY} r={14} fill="#0f172a" stroke={color} strokeWidth={1.5} />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={color}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const x = node.x ?? 0;
          const y = node.y ?? 0;
          const color = getNodeColor(node.id);
          const radius = getNodeRadius(node.id);
          const dist = distances?.[node.id];

          return (
            <g key={node.id} className="transition-all duration-300">
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke="white"
                strokeWidth={2}
                filter={activeIndices.includes(node.id) ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {node.label}
              </text>
              {dist !== undefined && dist !== Infinity && (
                <text
                  x={x}
                  y={y - radius - 8}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  d={dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
