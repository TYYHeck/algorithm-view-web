import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { algorithmsByCategory, categoryNames } from '../algorithms';
import type { AlgorithmCategory, IAlgorithm } from '../algorithms/types';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AlgorithmSelectorProps {
  category: AlgorithmCategory;
}

export function AlgorithmSelector({ category }: AlgorithmSelectorProps) {
  const { algorithm, setAlgorithm, generateNewData } = useAlgorithmStore();
  const [isOpen, setIsOpen] = useState(false);
  const algorithms = algorithmsByCategory[category];

  const handleSelect = (algo: IAlgorithm) => {
    setAlgorithm(algo);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-white transition-all w-full sm:w-auto min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
          <span className="text-sm font-medium">
            {algorithm ? algorithm.name : `选择${categoryNames[category]}`}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {algorithms.map((algo) => (
            <button
              key={algo.nameEn}
              onClick={() => handleSelect(algo)}
              className={cn(
                "w-full px-4 py-3 text-left transition-all flex items-center justify-between group",
                algorithm?.nameEn === algo.nameEn
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <div>
                <div className="text-sm font-medium">{algo.name}</div>
                <div className="text-xs text-slate-500 font-mono">{algo.nameEn}</div>
              </div>
              <div className="text-xs text-slate-500 group-hover:text-slate-400 font-mono">
                {algo.timeComplexity.average}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
