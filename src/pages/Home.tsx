import { Link } from 'react-router-dom';
import { BarChart3, Network, Brain, Play, Zap, Code, BarChart2, ArrowRight, Sparkles } from 'lucide-react';

export function Home() {
  const categories = [
    {
      title: '排序算法',
      desc: '冒泡、选择、插入、快速、归并、堆、希尔、计数排序',
      icon: BarChart3,
      path: '/sorting',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/20',
      count: 8,
    },
    {
      title: '图论算法',
      desc: 'BFS、DFS、Dijkstra、Prim、Kruskal、Floyd、拓扑排序',
      icon: Network,
      path: '/graph',
      gradient: 'from-sky-500 to-blue-600',
      glow: 'shadow-sky-500/20',
      count: 7,
    },
    {
      title: '动态规划',
      desc: '斐波那契、背包、LCS、LIS、爬楼梯、硬币找零',
      icon: Brain,
      path: '/dp',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
      count: 6,
    },
  ];

  const features = [
    {
      icon: Play,
      title: '动画演示',
      desc: '流畅的动画效果，直观展示算法执行的每一个步骤',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Zap,
      title: '速度控制',
      desc: '自由调节播放速度，单步执行或连续播放，按需学习',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Code,
      title: '代码同步',
      desc: '源代码实时高亮，动画与代码行同步，深入理解',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      icon: BarChart2,
      title: '复杂度分析',
      desc: '详细的时间/空间复杂度展示，对比不同算法性能',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900/0 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        
        <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>21种经典算法 · 三大核心类别</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              让算法学习
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent"> 可视化 </span>
              <br className="hidden sm:block" />
              变得简单而有趣
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              面向教学场景的算法可视化工具，通过动态演示和丰富交互，
              将抽象的算法逻辑转化为直观的动画过程，降低学习门槛。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/sorting"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                <Play className="w-5 h-5" />
                开始体验
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all hover:scale-105"
              >
                <BarChart2 className="w-5 h-5" />
                算法对比
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">三大算法类别</h2>
          <p className="text-slate-400">覆盖数据结构与算法课程的核心知识点</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] hover:${cat.glow} hover:shadow-xl`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {cat.title}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {cat.count}种
                </span>
              </h3>
              <p className="text-sm text-slate-400 mb-4">{cat.desc}</p>
              <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                开始学习
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">核心特性</h2>
          <p className="text-slate-400">为算法学习量身打造的交互体验</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700/50 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            AlgorithmView · 算法可视化教学工具 · 为学习而生
          </p>
        </div>
      </footer>
    </div>
  );
}
