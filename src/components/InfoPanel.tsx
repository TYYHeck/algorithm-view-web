import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { Clock, Database, Activity, TrendingUp, Info } from 'lucide-react';
import { useMemo } from 'react';

export function InfoPanel() {
  const { algorithm, statistics, steps, currentStepIndex, category, currentData } = useAlgorithmStore();

  const currentStepDesc = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
      return '点击播放按钮开始演示';
    }
    return steps[currentStepIndex]?.description ?? '';
  }, [steps, currentStepIndex]);

  const getStatusText = () => {
    if (!algorithm) return '未选择算法';
    if (steps.length === 0) return '准备就绪';
    if (currentStepIndex < 0) return '准备就绪';
    if (currentStepIndex >= steps.length - 1) return '执行完成';
    return '执行中...';
  };

  const getStatusColor = () => {
    if (!algorithm) return 'text-slate-500';
    if (steps.length === 0 || currentStepIndex < 0) return 'text-sky-400';
    if (currentStepIndex >= steps.length - 1) return 'text-emerald-400';
    return 'text-amber-400';
  };

  if (!algorithm) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl">
        <div className="text-slate-500 text-sm text-center py-8">
          请选择一个算法开始学习
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-xl space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            算法信息
          </h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-700/50 ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <h4 className="text-lg font-bold text-white mb-1">{algorithm.name}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{algorithm.description}</p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-3">
        <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          当前步骤
        </div>
        <p className="text-sm text-slate-200 leading-relaxed min-h-[40px]">
          {currentStepDesc}
        </p>
      </div>

      {category === 'sorting' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">比较次数</div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {statistics.comparisons}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">交换次数</div>
            <div className="text-xl font-bold text-pink-400 font-mono">
              {statistics.swaps}
            </div>
          </div>
        </div>
      )}

      {category === 'graph' && currentData?.visited && (
        <div className="bg-slate-900/50 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-2">访问顺序</div>
          <div className="text-sm text-emerald-400 font-mono flex flex-wrap gap-1">
            {currentData.visited.map((v: number, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-emerald-500/20 rounded">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          时间复杂度
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">最好</span>
            <span className="font-mono text-emerald-400">{algorithm.timeComplexity.best}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">平均</span>
            <span className="font-mono text-amber-400">{algorithm.timeComplexity.average}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">最坏</span>
            <span className="font-mono text-pink-400">{algorithm.timeComplexity.worst}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
          <Database className="w-3 h-3" />
          空间复杂度
        </div>
        <div className="text-sm font-mono text-violet-400">
          {algorithm.spaceComplexity}
        </div>
      </div>

      {'stable' in algorithm && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            稳定性
          </span>
          <span className={`font-medium ${algorithm.stable ? 'text-emerald-400' : 'text-pink-400'}`}>
            {algorithm.stable ? '稳定' : '不稳定'}
          </span>
        </div>
      )}
    </div>
  );
}
