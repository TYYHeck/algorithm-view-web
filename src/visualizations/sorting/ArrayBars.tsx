import { useMemo } from 'react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { barColors, cn } from '../../lib/utils';
import type { AlgorithmStep } from '../../algorithms/types';

export function ArrayBars() {
  const { currentData, steps, currentStepIndex } = useAlgorithmStore();
  const array = currentData?.array ?? [];
  const sortedIndices = currentData?.sortedIndices ?? [];

  const activeIndices = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
      return { type: 'default', indices: [] as number[] };
    }
    const step = steps[currentStepIndex];
    return { type: step.type, indices: step.indices };
  }, [steps, currentStepIndex]);

  const maxVal = Math.max(...array, 1);

  const getBarColor = (index: number): string => {
    if (sortedIndices.includes(index)) return barColors.sorted;
    if (activeIndices.indices.includes(index)) {
      return (barColors as any)[activeIndices.type] || barColors.default;
    }
    return barColors.default;
  };

  if (array.length === 0) return null;

  return (
    <div className="w-full h-full flex items-end justify-center gap-[2px] px-4 pb-4">
      {array.map((value, index) => {
        const heightPercent = (value / maxVal) * 100;
        const isActive = activeIndices.indices.includes(index);
        const isSorted = sortedIndices.includes(index);
        
        return (
          <div
            key={index}
            className={cn(
              'relative flex-1 max-w-[60px] rounded-t-md transition-all duration-200 ease-out',
              getBarColor(index),
              isActive && 'scale-y-105 shadow-lg shadow-current/30',
            )}
            style={{ height: `${heightPercent}%`, minHeight: '20px' }}
          >
            {array.length <= 25 && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-300">
                {value}
              </span>
            )}
            {array.length <= 30 && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400">
                {index}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
