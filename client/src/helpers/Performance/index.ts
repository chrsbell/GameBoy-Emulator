import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import Emulator from 'Emulator/index';
import Input from 'Input/index';
import InterruptService from 'Interrupts/index';
import {forEach} from 'lodash';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPU from 'PPU/index';

const BENCHMARKS_ENABLED = true;

interface timeInfo {
  [key: string]: {
    averageCallTime: number;
    elapsedMilliseconds: number;
    numberOfCalls: number;
  };
}

interface benchmarkTimes {
  // the context / function
  [key: string]: timeInfo;
}

let times: benchmarkTimes = {};

/**
 * Utility function to benchmark the emulator.
 */
const logBenchmarks = (): void => {
  forEach(times, (functions: timeInfo, group: unknown) => {
    console.log(
      `%cPerformance of ${group}:`,
      'color:#8217ab; font-weight: bold'
    );
    console.table(functions);
  });
  console.log('------------------------------------');
  times = {};
};

// This could probably be cleaned up/removed, the idea was to try to capture the conversion from each class method to a new benchmarked method.

type ClassType =
  | CanvasRenderer
  | Emulator
  | Memory
  | PPU
  | CPU
  | InterruptService
  | Input
  | PPUBridge;

type MethodType<T extends ClassType, K extends keyof T> = (
  ...args: ArgumentTypes<T, K, T[K]>
) => any;

type ArgumentTypes<T, K extends keyof T, F extends T[K]> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

const benchmark = (context: ClassType): void => {
  if (BENCHMARKS_ENABLED) {
    type contextKey = keyof typeof context;
    const methods: Record<string, MethodType<typeof context, contextKey>> = {};
    Object.entries(context).forEach(([k, v]) => {
      methods[k] = v;
    });
    for (const method in context) {
      if (typeof methods[method] === 'function') {
        context[method] = benchmarkFunction<typeof context, contextKey>(
          context,
          method
        );
      }
    }
  }
};

const benchmarkFunction = <T extends ClassType, K extends keyof T>(
  context: Record<string, MethodType<T, K>>,
  funcName: string
): MethodType<T, K> => {
  const func: MethodType<T, K> = context[funcName];
  if (BENCHMARKS_ENABLED) {
    const className = context ? context.constructor.name : 'Helpers';
    return (
      ...args: ArgumentTypes<typeof context, typeof funcName, typeof func>
    ): ReturnType<typeof func> => {
      // benchmark random calls
      // const t1 = performance.now();
      const value = func(...args);
      // const t2 = performance.now();
      // if (!times[className]) times[className] = {};
      // if (!times[className][<string>funcName]) {
      //   times[className][<string>funcName] = {
      //     averageCallTime: t2 - t1,
      //     elapsedMilliseconds: t2 - t1,
      //     numberOfCalls: 1,
      //   };
      // } else {
      //   const {elapsedMilliseconds, numberOfCalls} = times[className][
      //     <string>funcName
      //   ];
      //   times[className][funcName].elapsedMilliseconds += t2 - t1;
      //   times[className][funcName].numberOfCalls += 1;
      //   times[className][funcName].averageCallTime =
      //     elapsedMilliseconds / numberOfCalls;
      // }
      return value;

      // return func(...args);
    };
  }
  return func;
};

export default benchmark;
export {logBenchmarks, benchmark, benchmarkFunction};
