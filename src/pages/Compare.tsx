import { useState, useMemo, useEffect } from 'react';
import { sortingAlgorithms } from '../algorithms/sorting';
import { generateRandomArray } from '../algorithms';
import { barColors, cn, speedToMs } from '../lib/utils';
import { Play, Pause, RotateCcw, GitCompare } from 'lucide-react';
import type { IAlgorithm, AlgorithmStep, SortingState, SortingInput } from '../algorithms/types';

interface CompareInstance {
  algorithm: IAlgorithm;
  steps: AlgorithmStep[];
  currentStep: number;
  array: number[];
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  finished: boolean;
}

export function Compare() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    sortingAlgorithms[0].nameEn,
    sortingAlgorithms[3].nameEn,
  ]);
  const [arraySize, setArraySize] = useState(20);
  const [baseArray, setBaseArray] = useState<number[]>(() => generateRandomArray(20));
  const [speed, setSpeed] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instances, setInstances] = useState<CompareInstance[]>([]);

  const selectedAlgos = useMemo(() => {
    return sortingAlgorithms.filter(a => selectedAlgorithms.includes(a.nameEn));
  }, [selectedAlgorithms]);

  useEffect(() => {
    const newInstances: CompareInstance[] = selectedAlgos.map(algo => {
      const result = algo.execute({ array: [...baseArray] } as SortingInput);
      return {
        algorithm: algo,
        steps: result.steps,
        currentStep: -1,
        array: [...baseArray],
        sortedIndices: [],
        comparisons: 0,
        swaps: 0,
        finished: false,
      };
    });
    setInstances(newInstances);
    setIsPlaying(false);
  }, [selectedAlgos.length, baseArray]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setInstances(prev => {
        const allFinished = prev.every(inst => inst.finished);
        if (allFinished) {
          setIsPlaying(false);
          return prev;
        }

        return prev.map(inst => {
          if (inst.finished) return inst;
          const nextStep = inst.currentStep + 1;
          if (nextStep >= inst.steps.length) {
            return { ...inst, finished: true };
          }

          const step = inst.steps[nextStep];
          const newArray = [...inst.array];
          let newComparisons = inst.comparisons;
          let newSwaps = inst.swaps;
          let newSorted = [...inst.sortedIndices];

          if (step.type === 'compare') newComparisons++;
          else if (step.type === 'swap') {
            newSwaps++;
            const [i, j] = step.indices;
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          } else if (step.type === 'sorted') {
            newSorted = [...step.indices];
          }

          return {
            ...inst,
            currentStep: nextStep,
            array: newArray,
            sortedIndices: newSorted,
            comparisons: newComparisons,
            swaps: newSwaps,
          };
        });
      });
    }, speedToMs(speed));

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const toggleAlgorithm = (nameEn: string) => {
    setSelectedAlgorithms(prev => {
      if (prev.includes(nameEn)) {
        if (prev.length <= 2) return prev;
        return prev.filter(n => n !== nameEn);
      }
      if (prev.length >= 3) return prev;
      return [...prev, nameEn];
    });
  };

  const reset = () => {
    setIsPlaying(false);
    setInstances(selectedAlgos.map(algo => ({
      algorithm: algo,
      steps: algo.execute({ array: [...baseArray] } as SortingInput).steps,
      currentStep: -1,
      array: [...baseArray],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      finished: false,
    })));
  };

  const generateNew = () => {
    setBaseArray(generateRandomArray(arraySize));
  };

  const maxVal = Math.max(...baseArray, 1);

  const getBarColor = (index: number, sortedIndices: number[], step: AlgorithmStep | null): string => {
    if (sortedIndices.includes(index)) return barColors.sorted;
    if (step && step.indices.includes(index)) {
      return (barColors as any)[step.type] || barColors.default;
    }
    return barColors.default;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-violet-400" />
            算法对比
          </h1>
          <p className="text-sm text-slate-400">选择2-3种排序算法，直观对比执行过程和性能</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 block mb-2">选择算法（2-3个）</label>
              <div className="flex flex-wrap gap-2">
                {sortingAlgorithms.map(algo => (
                  <button
                    key={algo.nameEn}
                    onClick={() => toggleAlgorithm(algo.nameEn)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedAlgorithms.includes(algo.nameEn)
                        ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-lg shadow-violet-500/20"
                        : "bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700"
                    )}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-40">
              <label className="text-xs text-slate-400 block mb-2">
                数组大小: <span className="text-sky-400 font-mono">{arraySize}</span>
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:h-4
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-sky-500
                           [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <div className="w-32">
              <label className="text-xs text-slate-400 block mb-2">
                速度: <span className="text-sky-400 font-mono">{speed}x</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:h-4
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-emerald-500
                           [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105",
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20"
                    : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                )}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <button
                onClick={generateNew}
                className="px-4 py-2 rounded-xl bg-violet-600/50 hover:bg-violet-600 text-white transition-all flex items-center gap-2"
              >
                新数据
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${instances.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {instances.map((inst, idx) => {
            const currentStepData = inst.currentStep >= 0 && inst.currentStep < inst.steps.length
              ? inst.steps[inst.currentStep]
              : null;

            return (
              <div
                key={inst.algorithm.nameEn}
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-800/50">
                  <h3 className="font-semibold text-white">{inst.algorithm.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{inst.algorithm.timeComplexity.average}</p>
                </div>

                <div className="h-[250px] flex items-end px-3 pb-3 pt-6 gap-[1px]">
                  {inst.array.map((value, i) => {
                    const heightPercent = (value / maxVal) * 100;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex-1 rounded-t-sm transition-all duration-150',
                          getBarColor(i, inst.sortedIndices, currentStepData),
                          currentStepData?.indices.includes(i) && 'shadow-lg'
                        )}
                        style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                      />
                    );
                  })}
                </div>

                <div className="p-4 bg-slate-800/30 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">比较次数</div>
                    <div className="text-lg font-bold text-amber-400 font-mono">{inst.comparisons}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">交换次数</div>
                    <div className="text-lg font-bold text-pink-400 font-mono">{inst.swaps}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
