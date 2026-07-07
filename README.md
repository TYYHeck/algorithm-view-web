# AlgorithmView - 算法可视化教学工具

面向教学场景的算法可视化Web应用，支持21种经典算法的动态执行演示，覆盖排序、图论、动态规划三大核心类别。

## ✨ 功能特性

- **动态可视化演示** - 流畅的动画效果，颜色编码算法状态
- **播放控制** - 播放/暂停、单步前进/后退、重置
- **速度调节** - 1-10倍速自由调节
- **数据规模调整** - 数组大小、节点数量可调
- **代码同步高亮** - 源代码与执行步骤同步
- **复杂度分析** - 时间/空间复杂度详细展示
- **算法对比** - 2-3种排序算法并排对比执行

## 📊 算法列表

### 排序算法 (8种)
- 冒泡排序 (Bubble Sort)
- 选择排序 (Selection Sort)
- 插入排序 (Insertion Sort)
- 快速排序 (Quick Sort)
- 归并排序 (Merge Sort)
- 堆排序 (Heap Sort)
- 希尔排序 (Shell Sort)
- 计数排序 (Counting Sort)

### 图论算法 (7种)
- 广度优先搜索 (BFS)
- 深度优先搜索 (DFS)
- Dijkstra最短路径
- Prim最小生成树
- Kruskal最小生成树
- Floyd最短路径
- 拓扑排序

### 动态规划 (6种)
- 斐波那契数列
- 0-1背包问题
- 最长公共子序列 (LCS)
- 最长递增子序列 (LIS)
- 爬楼梯问题
- 硬币找零

## 🛠️ 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- Zustand (状态管理)
- React Router DOM 7
- Lucide React (图标)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173/

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 类型检查

```bash
npm run check
```

## 📁 项目结构

```
src/
├── algorithms/          # 算法引擎（策略模式）
│   ├── types.ts         # 类型定义
│   ├── sorting/         # 排序算法
│   ├── graph/           # 图论算法
│   └── dp/              # 动态规划算法
├── components/          # UI组件
│   ├── Navbar.tsx
│   ├── ControlPanel/
│   ├── CodeViewer.tsx
│   ├── InfoPanel.tsx
│   └── AlgorithmSelector.tsx
├── pages/               # 页面
│   ├── Home.tsx
│   ├── Sorting.tsx
│   ├── Graph.tsx
│   ├── DynamicProgramming.tsx
│   └── Compare.tsx
├── visualizations/      # 可视化渲染
│   ├── sorting/ArrayBars.tsx
│   ├── graph/GraphCanvas.tsx
│   └── dp/DPTable.tsx
├── store/               # 状态管理
│   └── useAlgorithmStore.ts
└── lib/utils.ts         # 工具函数
```

## 📦 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

在 GitHub 上创建一个新的公共仓库，命名为 `algorithm-view-web`

### 2. 添加远程仓库

```bash
git remote add origin https://github.com/<your-username>/algorithm-view-web.git
```

### 3. 配置 GitHub Pages

在仓库设置中：
- 转到 **Settings > Pages**
- 在 **Source** 下选择 **GitHub Actions**
- 创建 `.github/workflows/deploy.yml` 文件

### 4. 创建部署工作流

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
```

### 5. 推送代码

```bash
git branch -M main
git push -u origin main
```

### 6. 等待部署

GitHub Actions 会自动构建并部署到 `gh-pages` 分支。部署完成后，访问:

```
https://<your-username>.github.io/algorithm-view-web/
```

## 📝 设计模式

项目采用**策略模式**设计统一的算法调用接口 `IAlgorithm`，实现算法模块解耦与灵活扩展。新增算法仅需实现标准接口即可快速接入。

## 📄 许可证

MIT License
