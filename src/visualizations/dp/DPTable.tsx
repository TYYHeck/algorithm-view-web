import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { useMemo } from 'react';

export function DPTable() {
  const { currentData, steps, currentStepIndex, algorithm } = useAlgorithmStore();
  const table = currentData?.table ?? [];
  
  const activeStep = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) return null;
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const activeRow = activeStep?.data?.i ?? -1;
  const activeCol = activeStep?.data?.j ?? -1;

  const getCellStatus = (row: number, col: number): string => {
    if (activeStep?.type === 'fill-cell' && activeStep.data?.i === row && activeStep.data?.j === col) {
      return 'filling';
    }
    if (activeStep?.type === 'compute' && activeStep.indices[0] === row) {
      return 'computing-row';
    }
    if (activeStep?.type === 'state-transfer') {
      return 'done';
    }
    if (table[row]?.[col] !== undefined && table[row][col] !== 0) {
      return 'filled';
    }
    return 'empty';
  };

  const getCellClass = (status: string): string => {
    switch (status) {
      case 'filling':
        return 'bg-sky-500 text-white scale-110 shadow-lg shadow-sky-500/50 font-bold';
      case 'computing-row':
        return 'bg-amber-500/30 border-amber-500';
      case 'filled':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
      case 'done':
        return 'bg-emerald-500/30 border-emerald-400';
      default:
        return 'bg-slate-800/50 border-slate-700';
    }
  };

  const dpType = algorithm?.nameEn?.toLowerCase() ?? '';

  const renderTableHeader = () => {
    if (!table.length) return null;
    const cols = table[0].length;

    if (dpType === 'lcs') {
      const text1 = currentData?.text1 ?? '';
      const text2 = currentData?.text2 ?? '';
      return (
        <>
          <thead>
            <tr>
              <th className="p-2 text-slate-500 text-sm font-mono"></th>
              <th className="p-2 text-slate-500 text-sm font-mono">∅</th>
              {text2.split('').map((ch: string, i: number) => (
                <th key={i} className="p-2 text-sky-400 text-sm font-bold font-mono">{ch}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri}>
                <td className="p-2 text-sky-400 text-sm font-bold font-mono text-center">
                  {ri === 0 ? '∅' : text1[ri - 1]}
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`p-2 m-0.5 text-center font-mono text-sm border rounded transition-all duration-200 ${getCellClass(getCellStatus(ri, ci))}`}
                  >
                    {cell === Infinity ? '∞' : cell !== -1 ? cell : '∞'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      );
    }

    if (dpType === 'knapsack') {
      const weights = currentData?.weights ?? [];
      return (
        <>
          <thead>
            <tr>
              <th className="p-2 text-slate-500 text-sm font-mono">物品\容量</th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="p-2 text-sky-400 text-sm font-bold font-mono">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri}>
                <td className="p-2 text-sky-400 text-sm font-bold font-mono text-center">
                  {ri === 0 ? '∅' : `#${ri} (w=${weights[ri - 1]})`}
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`p-2 m-0.5 text-center font-mono text-sm border rounded transition-all duration-200 ${getCellClass(getCellStatus(ri, ci))}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      );
    }

    return (
      <>
        <tbody>
          {table.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`p-2 m-0.5 text-center font-mono text-sm border rounded transition-all duration-200 min-w-[40px] ${getCellClass(getCellStatus(ri, ci))}`}
                >
                  {cell === Infinity ? '∞' : cell !== -1 ? cell : '∞'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </>
    );
  };

  if (table.length === 0) return null;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
      <div className="inline-block">
        <table className="border-separate border-spacing-1">
          {renderTableHeader()}
        </table>
      </div>
    </div>
  );
}
