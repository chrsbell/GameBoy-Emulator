import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import Emulator from 'Emulator/index';
import {forEach} from 'lodash';
import Memory from 'Memory/index';
import PPU from 'PPU/index';

interface benchmarkTimes {
  // the context
  [key: string]: {
    // the function
    [key: string]: {
      averageCallTime: number;
      elapsedMilliseconds: number;
      numberOfCalls: number;
    };
  };
}

const times: benchmarkTimes = {};

/**
 * Utility function to benchmark the emulator.
 */
const logBenchmarks = (): void => {
  forEach(times, (functions: unknown, group: unknown) => {
    console.log(
      `%cPerformance of ${group}:`,
      'color:#8217ab; font-weight: bold'
    );
    console.table(functions);
  });
};

type classTypes = CanvasRenderer | Emulator | Memory | PPU | CPU;

const benchmark = <T extends classTypes>(
  context: T,
  funcName: string = ''
): any => {
  const func = context[funcName];
  if (benchmarksEnabled) {
    const className = context ? context.constructor.name : 'Helpers';
    return (...args: Array<unknown>): any => {
      // benchmark random calls
      if (Math.random() * 1000 <= 5) {
        const t1 = performance.now();
        // funcName = 'object' as const;
        const value = func(...args);
        const t2 = performance.now();
        if (!times[className]) times[className] = {};
        if (!times[className][funcName]) {
          times[className][funcName] = {
            averageCallTime: t2 - t1,
            elapsedMilliseconds: t2 - t1,
            numberOfCalls: 1,
          };
        } else {
          const {elapsedMilliseconds, numberOfCalls} = times[className][
            funcName
          ];
          times[className][funcName].elapsedMilliseconds += t2 - t1;
          times[className][funcName].numberOfCalls += 1;
          times[className][funcName].averageCallTime =
            elapsedMilliseconds / numberOfCalls;
        }
        return value;
      }
      return func(...args);
    };
  }
  return func;
};

const benchmarksEnabled = true;

export default benchmark;
export {logBenchmarks, benchmarksEnabled};
