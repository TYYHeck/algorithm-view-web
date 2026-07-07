import { AlgorithmStep, IAlgorithm, SortingInput, SortingState } from '../types';

abstract class SortingAlgorithm implements IAlgorithm<SortingInput, SortingState> {
  abstract name: string;
  abstract nameEn: string;
  category = 'sorting' as const;
  abstract timeComplexity: { best: string; average: string; worst: string };
  abstract spaceComplexity: string;
  abstract description: string;
  abstract code: string;
  stable?: boolean;

  abstract execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState };

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

export class BubbleSort extends SortingAlgorithm {
  name = '冒泡排序';
  nameEn = 'Bubble Sort';
  timeComplexity = { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' };
  spaceComplexity = 'O(1)';
  description = '重复遍历数组，比较相邻元素并交换顺序错误的元素，直到没有需要交换的元素为止。';
  stable = true;
  code = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push(this.createStep('compare', [j, j + 1], `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`, undefined, 5));
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push(this.createStep('swap', [j, j + 1], `交换 arr[${j}] 和 arr[${j + 1}]`, undefined, 6));
          swapped = true;
        }
      }
      sortedIndices.unshift(n - i - 1);
      steps.push(this.createStep('sorted', [...sortedIndices], `第 ${i + 1} 轮结束，arr[${n - i - 1}] 已就位`, undefined, 10));
      if (!swapped) {
        for (let k = 0; k < n - i - 1; k++) {
          if (!sortedIndices.includes(k)) sortedIndices.push(k);
        }
        steps.push(this.createStep('sorted', [...sortedIndices], '已有序，提前结束', undefined, 11));
        break;
      }
    }
    if (!sortedIndices.includes(0)) sortedIndices.push(0);
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 13));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class SelectionSort extends SortingAlgorithm {
  name = '选择排序';
  nameEn = 'Selection Sort';
  timeComplexity = { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' };
  spaceComplexity = 'O(1)';
  description = '每次从未排序部分选出最小元素，放到已排序部分的末尾。';
  stable = false;
  code = `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push(this.createStep('pivot', [minIdx], `初始最小索引: ${i}, 值: ${arr[i]}`, undefined, 4));
      for (let j = i + 1; j < n; j++) {
        steps.push(this.createStep('compare', [minIdx, j], `比较 arr[${minIdx}]=${arr[minIdx]} 和 arr[${j}]=${arr[j]}`, undefined, 6));
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push(this.createStep('pivot', [minIdx], `更新最小索引: ${j}, 值: ${arr[j]}`, undefined, 7));
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push(this.createStep('swap', [i, minIdx], `交换 arr[${i}] 和 arr[${minIdx}]`, undefined, 10));
      }
      sortedIndices.push(i);
      steps.push(this.createStep('sorted', [...sortedIndices], `arr[${i}] 已就位`, undefined, 12));
    }
    sortedIndices.push(n - 1);
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 13));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class InsertionSort extends SortingAlgorithm {
  name = '插入排序';
  nameEn = 'Insertion Sort';
  timeComplexity = { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' };
  spaceComplexity = 'O(1)';
  description = '将未排序元素逐个插入到已排序部分的正确位置。';
  stable = true;
  code = `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [0];

    steps.push(this.createStep('sorted', [0], '第一个元素默认已排序', undefined, 2));

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      steps.push(this.createStep('pivot', [i], `取出 arr[${i}]=${key} 作为待插入元素`, undefined, 4));
      
      while (j >= 0 && arr[j] > key) {
        steps.push(this.createStep('compare', [j, j + 1], `arr[${j}]=${arr[j]} > ${key}，需要后移`, undefined, 6));
        arr[j + 1] = arr[j];
        steps.push(this.createStep('overwrite', [j + 1, j], `arr[${j + 1}] = arr[${j}]`, undefined, 7));
        j--;
      }
      arr[j + 1] = key;
      steps.push(this.createStep('overwrite', [j + 1], `将 ${key} 插入到位置 ${j + 1}`, undefined, 9));
      sortedIndices.push(i);
      steps.push(this.createStep('sorted', [...sortedIndices], `前 ${i + 1} 个元素已排序`, undefined, 10));
    }
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 11));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class QuickSort extends SortingAlgorithm {
  name = '快速排序';
  nameEn = 'Quick Sort';
  timeComplexity = { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' };
  spaceComplexity = 'O(log n)';
  description = '选择基准元素，将数组分为小于和大于基准的两部分，递归排序。';
  stable = false;
  code = `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    const quickSortHelper = (low: number, high: number) => {
      if (low < high) {
        const pivotIdx = partition(low, high);
        sortedIndices.push(pivotIdx);
        steps.push(this.createStep('sorted', [...sortedIndices], `基准元素 arr[${pivotIdx}]=${arr[pivotIdx]} 已就位`, undefined, 10));
        quickSortHelper(low, pivotIdx - 1);
        quickSortHelper(pivotIdx + 1, high);
      } else if (low === high && !sortedIndices.includes(low)) {
        sortedIndices.push(low);
        steps.push(this.createStep('sorted', [...sortedIndices], `arr[${low}] 已就位`, undefined, 4));
      }
    };

    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      steps.push(this.createStep('pivot', [high], `选择基准 pivot = arr[${high}] = ${pivot}`, undefined, 13));
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push(this.createStep('compare', [j, high], `比较 arr[${j}]=${arr[j]} 和 pivot=${pivot}`, undefined, 16));
        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push(this.createStep('swap', [i, j], `交换 arr[${i}] 和 arr[${j}]`, undefined, 18));
          }
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push(this.createStep('swap', [i + 1, high], `将基准放到正确位置 ${i + 1}`, undefined, 21));
      return i + 1;
    };

    quickSortHelper(0, n - 1);
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 6));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class MergeSort extends SortingAlgorithm {
  name = '归并排序';
  nameEn = 'Merge Sort';
  timeComplexity = { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' };
  spaceComplexity = 'O(n)';
  description = '分治策略，将数组分成两半分别排序，然后合并有序数组。';
  stable = true;
  code = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    const mergeSortHelper = (left: number, right: number) => {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      steps.push(this.createStep('highlight', Array.from({ length: right - left + 1 }, (_, i) => left + i), `分割区间 [${left}, ${right}]，中点 mid = ${mid}`, undefined, 3));
      
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    };

    const merge = (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      steps.push(this.createStep('merge', Array.from({ length: right - left + 1 }, (_, i) => left + i), `合并 [${left}, ${mid}] 和 [${mid + 1}, ${right}]`, { leftArr: [...leftArr], rightArr: [...rightArr] }, 10));
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        steps.push(this.createStep('compare', [left + i, mid + 1 + j], `比较 left[${i}]=${leftArr[i]} 和 right[${j}]=${rightArr[j]}`, undefined, 12));
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          steps.push(this.createStep('overwrite', [k], `arr[${k}] = ${leftArr[i]} (来自左半部分)`, undefined, 13));
          i++;
        } else {
          arr[k] = rightArr[j];
          steps.push(this.createStep('overwrite', [k], `arr[${k}] = ${rightArr[j]} (来自右半部分)`, undefined, 15));
          j++;
        }
        if (right - left + 1 === n) sortedIndices.push(k);
        k++;
      }
      
      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push(this.createStep('overwrite', [k], `剩余左元素 arr[${k}] = ${leftArr[i]}`, undefined, 18));
        if (right - left + 1 === n) sortedIndices.push(k);
        i++;
        k++;
      }
      
      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push(this.createStep('overwrite', [k], `剩余右元素 arr[${k}] = ${rightArr[j]}`, undefined, 18));
        if (right - left + 1 === n) sortedIndices.push(k);
        j++;
        k++;
      }
    };

    mergeSortHelper(0, n - 1);
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 7));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class HeapSort extends SortingAlgorithm {
  name = '堆排序';
  nameEn = 'Heap Sort';
  timeComplexity = { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' };
  spaceComplexity = 'O(1)';
  description = '利用堆数据结构，先建大顶堆，然后依次取出堆顶元素。';
  stable = false;
  code = `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    const heapify = (size: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      steps.push(this.createStep('pivot', [i], `堆化节点 ${i}，当前最大值索引 = ${i}`, undefined, 14));

      if (left < size) {
        steps.push(this.createStep('compare', [largest, left], `比较 arr[${largest}]=${arr[largest]} 和左子 arr[${left}]=${arr[left]}`, undefined, 17));
        if (arr[left] > arr[largest]) largest = left;
      }
      if (right < size) {
        steps.push(this.createStep('compare', [largest, right], `比较 arr[${largest}]=${arr[largest]} 和右子 arr[${right}]=${arr[right]}`, undefined, 18));
        if (arr[right] > arr[largest]) largest = right;
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push(this.createStep('swap', [i, largest], `交换 arr[${i}] 和 arr[${largest}]`, undefined, 20));
        heapify(size, largest);
      }
    };

    steps.push(this.createStep('highlight', Array.from({ length: n }, (_, i) => i), '构建大顶堆', undefined, 2));
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }
    steps.push(this.createStep('highlight', Array.from({ length: n }, (_, i) => i), '大顶堆构建完成', undefined, 4));

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps.push(this.createStep('swap', [0, i], `交换堆顶 arr[0]=${arr[i]} 和末尾 arr[${i}]=${arr[0]}`, undefined, 6));
      sortedIndices.unshift(i);
      steps.push(this.createStep('sorted', [...sortedIndices], `arr[${i}] 已就位`, undefined, 7));
      heapify(i, 0);
    }
    sortedIndices.unshift(0);
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 9));

    return { steps, finalState: { array: arr, sortedIndices } };
  }
}

export class ShellSort extends SortingAlgorithm {
  name = '希尔排序';
  nameEn = 'Shell Sort';
  timeComplexity = { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)' };
  spaceComplexity = 'O(1)';
  description = '插入排序的改进版，先按增量分组进行插入排序，逐步缩小增量。';
  stable = false;
  code = `function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const sortedIndices: number[] = [];
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      steps.push(this.createStep('highlight', Array.from({ length: n }, (_, i) => i), `当前增量 gap = ${gap}`, { gap }, 3));
      
      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;
        steps.push(this.createStep('pivot', [i], `取出 arr[${i}]=${temp}，从位置 ${i} 开始向前比较`, { gap }, 6));
        
        while (j >= gap && arr[j - gap] > temp) {
          steps.push(this.createStep('compare', [j, j - gap], `arr[${j - gap}]=${arr[j - gap]} > ${temp}`, { gap }, 8));
          arr[j] = arr[j - gap];
          steps.push(this.createStep('overwrite', [j, j - gap], `arr[${j}] = arr[${j - gap}] = ${arr[j - gap]}`, { gap }, 9));
          j -= gap;
        }
        arr[j] = temp;
        steps.push(this.createStep('overwrite', [j], `将 ${temp} 插入到位置 ${j}`, { gap }, 11));
      }
      gap = Math.floor(gap / 2);
    }
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 14));

    return { steps, finalState: { array: arr, sortedIndices: Array.from({ length: n }, (_, i) => i) } };
  }
}

export class CountingSort extends SortingAlgorithm {
  name = '计数排序';
  nameEn = 'Counting Sort';
  timeComplexity = { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' };
  spaceComplexity = 'O(k)';
  description = '非比较排序，统计每个元素出现次数，然后按顺序输出。k为数据范围。';
  stable = true;
  code = `function countingSort(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const count = new Array(max - min + 1).fill(0);
  for (const num of arr) count[num - min]++;
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      arr[idx++] = i + min;
      count[i]--;
    }
  }
  return arr;
}`;

  execute(input: SortingInput): { steps: AlgorithmStep[]; finalState: SortingState } {
    const arr = [...input.array];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);

    steps.push(this.createStep('highlight', Array.from({ length: n }, (_, i) => i), `最大值 = ${max}, 最小值 = ${min}, 范围 = ${range}`, { max, min, range }, 2));

    for (let i = 0; i < n; i++) {
      count[arr[i] - min]++;
      steps.push(this.createStep('pivot', [i], `计数: ${arr[i]} -> count[${arr[i] - min}] = ${count[arr[i] - min]}`, { count: [...count] }, 5));
    }

    let idx = 0;
    for (let i = 0; i < count.length; i++) {
      while (count[i] > 0) {
        arr[idx] = i + min;
        steps.push(this.createStep('overwrite', [idx], `arr[${idx}] = ${i + min}`, { count: [...count] }, 9));
        count[i]--;
        idx++;
      }
    }
    steps.push(this.createStep('sorted', Array.from({ length: n }, (_, i) => i), '排序完成！', undefined, 12));

    return { steps, finalState: { array: arr, sortedIndices: Array.from({ length: n }, (_, i) => i) } };
  }
}

export const sortingAlgorithms = [
  new BubbleSort(),
  new SelectionSort(),
  new InsertionSort(),
  new QuickSort(),
  new MergeSort(),
  new HeapSort(),
  new ShellSort(),
  new CountingSort(),
];
