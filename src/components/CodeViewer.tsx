import { useMemo } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { Code2 } from 'lucide-react';

export function CodeViewer() {
  const { algorithm, steps, currentStepIndex } = useAlgorithmStore();

  const activeLine = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) return -1;
    return steps[currentStepIndex]?.codeLine ?? -1;
  }, [steps, currentStepIndex]);

  if (!algorithm) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl h-full">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          源代码
        </h3>
        <div className="text-slate-500 text-sm flex items-center justify-center h-48">
          请选择一个算法
        </div>
      </div>
    );
  }

  const codeLines = algorithm.code.split('\n');

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <Code2 className="w-4 h-4 text-emerald-400" />
        源代码
        <span className="ml-auto text-xs text-slate-500 font-mono">{algorithm.nameEn}</span>
      </h3>
      
      <div className="flex-1 overflow-auto rounded-xl bg-slate-950/50 p-3 font-mono text-xs">
        {codeLines.map((line, index) => (
          <div
            key={index}
            className={`flex transition-all duration-200 -mx-3 px-3 py-0.5 ${
              activeLine === index
                ? 'bg-sky-500/20 border-l-2 border-sky-400 text-sky-200'
                : 'text-slate-400 border-l-2 border-transparent'
            }`}
          >
            <span className="text-slate-600 w-8 flex-shrink-0 text-right pr-3 select-none">
              {index + 1}
            </span>
            <span className="whitespace-pre">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
