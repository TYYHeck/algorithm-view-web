import { AlgorithmStep, IAlgorithm, DPInput, DPState } from '../types';

abstract class DPAlgorithm implements IAlgorithm<DPInput, DPState> {
  abstract name: string;
  abstract nameEn: string;
  category = 'dp' as const;
  abstract timeComplexity: { best: string; average: string; worst: string };
  abstract spaceComplexity: string;
  abstract description: string;
  abstract code: string;
  abstract dpType: string;

  abstract execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState };

  protected createStep(
    type: AlgorithmStep['type'],
    indices: number[],
    description: string,
    data?: Record<string, any>,
    codeLine?: number
  ): AlgorithmStep {
    return { type, indices, description, data, codeLine };
  }
}

export class FibonacciDP extends DPAlgorithm {
  name = '斐波那契数列';
  nameEn = 'Fibonacci';
  dpType = 'fibonacci';
  timeComplexity = { best: 'O(n)', average: 'O(n)', worst: 'O(n)' };
  spaceComplexity = 'O(n)';
  description = '动态规划求解斐波那契数列，避免重复子问题计算。';
  code = `function fibonacci(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 状态转移方程: dp[i] = dp[i-1] + dp[i-2]`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const n = input.n ?? 10;
    const steps: AlgorithmStep[] = [];
    const table: number[][] = [new Array(n + 1).fill(0)];

    steps.push(this.createStep('init', [0, 1], `初始化: dp[0]=0, dp[1]=1`, { table: [new Array(n + 1).fill(0)] }, 3));
    
    table[0][0] = 0;
    table[0][1] = 1;

    for (let i = 2; i <= n; i++) {
      steps.push(this.createStep('compute', [i], `计算 dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${table[0][i - 1]} + ${table[0][i - 2]}`, { table: table.map(r => [...r]) }, 6));
      table[0][i] = table[0][i - 1] + table[0][i - 2];
      steps.push(this.createStep('fill-cell', [0, i], `dp[${i}] = ${table[0][i]}`, { table: table.map(r => [...r]) }, 7));
    }

    steps.push(this.createStep('state-transfer', [n], `斐波那契数 F(${n}) = ${table[0][n]}`, { table: table.map(r => [...r]), result: table[0][n] }, 9));

    return {
      steps,
      finalState: { table, result: table[0][n], n }
    };
  }
}

export class KnapsackDP extends DPAlgorithm {
  name = '0-1背包问题';
  nameEn = '0-1 Knapsack';
  dpType = 'knapsack';
  timeComplexity = { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' };
  spaceComplexity = 'O(nW)';
  description = '给定物品的重量和价值，在背包容量限制下求最大价值。每个物品只能选一次。';
  code = `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}

// 状态转移方程:
// dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i-1]] + val[i-1])`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const weights = input.weights ?? [2, 3, 4, 5];
    const values = input.values ?? [3, 4, 5, 6];
    const capacity = input.capacity ?? 8;
    const n = weights.length;
    const steps: AlgorithmStep[] = [];

    const table: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

    steps.push(this.createStep('init', [0], `初始化DP表 (${n + 1}行 x ${capacity + 1}列)，第一行第一列全为0`, { table: table.map(r => [...r]), weights, values, capacity }, 3));

    for (let i = 1; i <= n; i++) {
      steps.push(this.createStep('highlight-row', [i], `考虑第 ${i} 个物品: 重量=${weights[i - 1]}, 价值=${values[i - 1]}`, { table: table.map(r => [...r]) }, 5));
      
      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          const notTake = table[i - 1][w];
          const take = table[i - 1][w - weights[i - 1]] + values[i - 1];
          table[i][w] = Math.max(notTake, take);
          steps.push(this.createStep('fill-cell', [i, w], 
            `dp[${i}][${w}] = max(不选=${notTake}, 选=${take}) = ${table[i][w]}`,
            { table: table.map(r => [...r]), i, w, notTake, take }, 8));
        } else {
          table[i][w] = table[i - 1][w];
          steps.push(this.createStep('fill-cell', [i, w], 
            `重量${weights[i - 1]} > 容量${w}，不能选: dp[${i}][${w}] = dp[${i - 1}][${w}] = ${table[i][w]}`,
            { table: table.map(r => [...r]), i, w }, 12));
        }
      }
    }

    steps.push(this.createStep('state-transfer', [n, capacity], 
      `最大价值 = dp[${n}][${capacity}] = ${table[n][capacity]}`,
      { table: table.map(r => [...r]), result: table[n][capacity] }, 15));

    return {
      steps,
      finalState: { table, result: table[n][capacity], weights, values, capacity }
    };
  }
}

export class LCSDP extends DPAlgorithm {
  name = '最长公共子序列';
  nameEn = 'LCS';
  dpType = 'lcs';
  timeComplexity = { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' };
  spaceComplexity = 'O(mn)';
  description = '求两个字符串的最长公共子序列长度。子序列不要求连续。';
  code = `function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// 状态转移方程:
// if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
// else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const text1 = input.text1 ?? 'ABCBDAB';
    const text2 = input.text2 ?? 'BDCABA';
    const m = text1.length;
    const n = text2.length;
    const steps: AlgorithmStep[] = [];

    const table: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    steps.push(this.createStep('init', [0], 
      `初始化DP表，text1="${text1}", text2="${text2}"`, 
      { table: table.map(r => [...r]), text1, text2 }, 3));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          table[i][j] = table[i - 1][j - 1] + 1;
          steps.push(this.createStep('fill-cell', [i, j], 
            `${text1[i - 1]} == ${text2[j - 1]}: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${table[i][j]}`,
            { table: table.map(r => [...r]), i, j, match: true }, 7));
        } else {
          const top = table[i - 1][j];
          const left = table[i][j - 1];
          table[i][j] = Math.max(top, left);
          steps.push(this.createStep('fill-cell', [i, j], 
            `${text1[i - 1]} != ${text2[j - 1]}: dp[${i}][${j}] = max(上面=${top}, 左面=${left}) = ${table[i][j]}`,
            { table: table.map(r => [...r]), i, j, match: false, top, left }, 9));
        }
      }
    }

    steps.push(this.createStep('state-transfer', [m, n], 
      `最长公共子序列长度 = dp[${m}][${n}] = ${table[m][n]}`,
      { table: table.map(r => [...r]), result: table[m][n] }, 12));

    return {
      steps,
      finalState: { table, result: table[m][n], text1, text2 }
    };
  }
}

export class LISDP extends DPAlgorithm {
  name = '最长递增子序列';
  nameEn = 'LIS';
  dpType = 'lis';
  timeComplexity = { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' };
  spaceComplexity = 'O(n)';
  description = '求数组中最长严格递增子序列的长度。';
  code = `function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let maxLen = 1;
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}

// 状态转移方程: dp[i] = max(dp[j] + 1) for j < i and nums[j] < nums[i]`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const nums = input.nums ?? [10, 9, 2, 5, 3, 7, 101, 18];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(n).fill(1);
    const table: number[][] = [dp];
    let maxLen = 1;

    steps.push(this.createStep('init', [0], 
      `初始化 dp 数组全为 1，nums = [${nums.join(', ')}]`, 
      { table: [[...dp]], nums }, 3));

    for (let i = 1; i < n; i++) {
      steps.push(this.createStep('compute', [i], 
        `计算以 nums[${i}]=${nums[i]} 结尾的LIS`, 
        { table: [[...dp]], i }, 5));
      
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          const oldVal = dp[i];
          const newVal = dp[j] + 1;
          if (newVal > oldVal) {
            dp[i] = newVal;
            steps.push(this.createStep('fill-cell', [0, i], 
              `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}: dp[${i}] = max(${oldVal}, dp[${j}]+1=${newVal}) = ${dp[i]}`,
              { table: [[...dp]], i, j }, 8));
          } else {
            steps.push(this.createStep('highlight-col', [j], 
              `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}，但 dp[${j}]+1=${newVal} <= dp[${i}]=${oldVal}`,
              { table: [[...dp]], i, j }, 8));
          }
        }
      }
      maxLen = Math.max(maxLen, dp[i]);
    }

    steps.push(this.createStep('state-transfer', [0, n - 1], 
      `最长递增子序列长度 = ${maxLen}`,
      { table: [[...dp]], result: maxLen }, 11));

    return {
      steps,
      finalState: { table, result: maxLen, nums }
    };
  }
}

export class ClimbStairsDP extends DPAlgorithm {
  name = '爬楼梯问题';
  nameEn = 'Climb Stairs';
  dpType = 'climbstairs';
  timeComplexity = { best: 'O(n)', average: 'O(n)', worst: 'O(n)' };
  spaceComplexity = 'O(n)';
  description = '每次可以爬1或2个台阶，求爬n个台阶有多少种不同方法。';
  code = `function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 状态转移方程: dp[i] = dp[i-1] + dp[i-2]
// 到达第i阶的方法 = 从i-1阶爬1步 + 从i-2阶爬2步`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const n = input.n ?? 10;
    const steps: AlgorithmStep[] = [];
    const dp = new Array(n + 1).fill(0);
    const table: number[][] = [dp];

    steps.push(this.createStep('init', [1, 2], 
      `初始化: dp[1]=1 (1种), dp[2]=2 (1+1, 2)`, 
      { table: [[...dp]] }, 3));
    
    dp[1] = 1;
    dp[2] = 2;

    for (let i = 3; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push(this.createStep('fill-cell', [0, i], 
        `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        { table: [[...dp]], i }, 6));
    }

    steps.push(this.createStep('state-transfer', [0, n], 
      `爬 ${n} 阶楼梯共有 ${dp[n]} 种方法`,
      { table: [[...dp]], result: dp[n] }, 8));

    return {
      steps,
      finalState: { table, result: dp[n], n }
    };
  }
}

export class CoinChangeDP extends DPAlgorithm {
  name = '硬币找零';
  nameEn = 'Coin Change';
  dpType = 'coinchange';
  timeComplexity = { best: 'O(amount * coins)', average: 'O(amount * coins)', worst: 'O(amount * coins)' };
  spaceComplexity = 'O(amount)';
  description = '给定不同面额的硬币coins和总金额amount，求凑成总金额的最少硬币数。';
  code = `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 状态转移方程: dp[i] = min(dp[i - coin] + 1) for coin in coins`;

  execute(input: DPInput): { steps: AlgorithmStep[]; finalState: DPState } {
    const coins = input.coins ?? [1, 2, 5];
    const amount = input.amount ?? 11;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    const table: number[][] = [dp.map(v => v === Infinity ? -1 : v)];

    steps.push(this.createStep('init', [0], 
      `初始化: dp[0]=0, 其余=Infinity, 硬币=[${coins.join(', ')}], 金额=${amount}`, 
      { table: [[...dp.map(v => v === Infinity ? -1 : v)]], coins, amount }, 3));

    for (let i = 1; i <= amount; i++) {
      steps.push(this.createStep('compute', [i], 
        `计算凑成金额 ${i} 的最少硬币数`, 
        { table: [[...dp.map(v => v === Infinity ? -1 : v)]], i }, 5));
      
      for (const coin of coins) {
        if (coin <= i) {
          const prev = dp[i - coin];
          if (prev !== Infinity) {
            const newVal = prev + 1;
            if (newVal < dp[i]) {
              dp[i] = newVal;
              steps.push(this.createStep('fill-cell', [0, i], 
                `硬币${coin}: dp[${i}] = min(当前=${dp[i] === Infinity ? 'Inf' : dp[i]}, dp[${i - coin}]+1=${newVal}) = ${dp[i]}`,
                { table: [[...dp.map(v => v === Infinity ? -1 : v)]], i, coin }, 8));
            }
          }
        }
      }
    }

    const result = dp[amount] === Infinity ? -1 : dp[amount];
    steps.push(this.createStep('state-transfer', [0, amount], 
      result === -1 ? `无法凑成金额 ${amount}` : `凑成金额 ${amount} 最少需要 ${result} 枚硬币`,
      { table: [[...dp.map(v => v === Infinity ? -1 : v)]], result }, 11));

    return {
      steps,
      finalState: { table: [dp.map(v => v === Infinity ? -1 : v)], result, coins, amount }
    };
  }
}

export const dpAlgorithms = [
  new FibonacciDP(),
  new KnapsackDP(),
  new LCSDP(),
  new LISDP(),
  new ClimbStairsDP(),
  new CoinChangeDP(),
];
