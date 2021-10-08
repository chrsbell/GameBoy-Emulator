import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import Emulator from 'Emulator/index';
import Input from 'Input/index';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPU from 'PPU/index';

const BENCHMARKS_ENABLED = false;

let times = {};

/**
 * Utility function to *roughly* benchmark/debug the emulator.
 */
const logBenchmarks = () => {
  Object.entries(times).forEach(([group, functions]) => {
    console.log(
      `%cPerformance of ${group}:`,
      'color:#8217ab; font-weight: bold'
    );
    console.table(functions);
  });
  console.log('------------------------------------');
  times = {};
};

const benchmark = context => {
  if (BENCHMARKS_ENABLED) {
    const methods = {};
    Object.entries(context).forEach(([k, v]) => {
      methods[k] = v;
    });
    for (const method in context) {
      if (typeof methods[method] === 'function') {
        context[method] = benchmarkFunction(context, method);
      }
    }
  }
};

const benchmarkFunction = (context, funcName) => {
  const func = context[funcName];
  if (BENCHMARKS_ENABLED) {
    const className = context ? context.constructor.name : 'Helpers';
    return (...args) => {
      // benchmark random calls
      const t1 = performance.now();
      const value = func(...args);
      const t2 = performance.now();
      if (!times[className]) times[className] = {};
      if (!times[className][funcName])
        times[className][funcName] = {
          averageCallTime: t2 - t1,
          elapsedMilliseconds: t2 - t1,
          numberOfCalls: 1,
        };
      else {
        const {elapsedMilliseconds, numberOfCalls} = times[className][funcName];
        times[className][funcName].elapsedMilliseconds += t2 - t1;
        times[className][funcName].numberOfCalls += 1;
        times[className][funcName].averageCallTime =
          elapsedMilliseconds / numberOfCalls;
      }
      return value;

      // return func(...args);
    };
  }
  return func;
};

export default benchmark;
export {logBenchmarks, benchmark, benchmarkFunction};
