import { useEffect } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { DPTable } from '../visualizations/dp/DPTable';
import { ControlPanel } from '../components/ControlPanel/ControlPanel';
import { CodeViewer } from '../components/CodeViewer';
import { InfoPanel } from '../components/InfoPanel';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { dpAlgorithms } from '../algorithms/dp';

export function DynamicProgramming() {
  const { setCategory, algorithm, setAlgorithm } = useAlgorithmStore();

  useEffect(() => {
    setCategory('dp');
    if (!algorithm || algorithm.category !== 'dp') {
      setAlgorithm(dpAlgorithms[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">动态规划可视化</h1>
            <p className="text-sm text-slate-400">6种经典动态规划问题的动态演示</p>
          </div>
          <AlgorithmSelector category="dp" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-xl overflow-hidden">
              <div className="h-[450px] overflow-auto">
                <DPTable />
              </div>
            </div>
            <ControlPanel />
          </div>

          <div className="space-y-6">
            <InfoPanel />
            <CodeViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
