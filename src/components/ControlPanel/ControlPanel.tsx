import { Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle, FastForward } from 'lucide-react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { cn } from '../../lib/utils';
import { useEffect, useRef } from 'react';
import { speedToMs } from '../../lib/utils';

export function ControlPanel() {
  const {
    status,
    currentStepIndex,
    speed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    generateNewData,
    arraySize,
    setArraySize,
    graphNodeCount,
    setGraphNodeCount,
    category,
    steps,
  } = useAlgorithmStore();

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        stepForward();
      }, speedToMs(speed));
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, speed, stepForward]);

  useEffect(() => {
    if (status === 'running' && currentStepIndex >= steps.length - 1) {
      pause();
    }
  }, [currentStepIndex, steps.length, status, pause]);

  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <FastForward className="w-4 h-4 text-sky-400" />
        控制面板
      </h3>

      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={reset}
          className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
          title="重置"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={stepBackward}
          disabled={currentStepIndex <= 0}
          className={cn(
            "p-3 rounded-xl transition-all hover:scale-105",
            currentStepIndex <= 0
              ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
              : "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white"
          )}
          title="上一步"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={status === 'running' ? pause : play}
          disabled={steps.length === 0}
          className={cn(
            "p-4 rounded-2xl transition-all hover:scale-105 shadow-lg",
            steps.length === 0
              ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
              : status === 'running'
              ? "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/30"
              : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30"
          )}
          title={status === 'running' ? '暂停' : '播放'}
        >
          {status === 'running' ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button
          onClick={stepForward}
          disabled={currentStepIndex >= steps.length - 1}
          className={cn(
            "p-3 rounded-xl transition-all hover:scale-105",
            currentStepIndex >= steps.length - 1
              ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
              : "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white"
          )}
          title="下一步"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        <button
          onClick={generateNewData}
          className="p-3 rounded-xl bg-slate-700/50 hover:bg-violet-600 text-slate-300 hover:text-white transition-all hover:scale-105"
          title="随机生成新数据"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>进度</span>
          <span>{Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-200 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>速度</span>
          <span className="text-sky-400 font-mono">{speed}x</span>
        </div>
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
                     [&::-webkit-slider-thumb]:bg-sky-500
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:shadow-sky-500/50
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-webkit-slider-thumb]:transition-transform"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>慢</span>
          <span>快</span>
        </div>
      </div>

      {category === 'sorting' && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>数组大小</span>
            <span className="text-sky-400 font-mono">{arraySize}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-violet-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-violet-500/50
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      )}

      {category === 'graph' && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>节点数量</span>
            <span className="text-sky-400 font-mono">{graphNodeCount}</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            value={graphNodeCount}
            onChange={(e) => setGraphNodeCount(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-violet-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-violet-500/50
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
