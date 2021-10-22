const BENCHMARKS_ENABLED = false;

let times: {
  [className: string]: {
    [funcName: string]: {
      elapsedMilliseconds: number;
      numberOfCalls: number;
      averageCallTime: number;
    };
  };
} = {};

/**
 * Utility function to *roughly* benchmark/debug the emulator.
 */
const logBenchmarks = (): void => {
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

const benchmark = (context: any): void => {
  if (BENCHMARKS_ENABLED) {
    const methods: {
      [index: string]: any;
    } = {};
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

const benchmarkFunction = (context: any, funcName: string): any => {
  const func = context[funcName];
  if (BENCHMARKS_ENABLED) {
    const className = context ? context.constructor.name : 'Helpers';
    return (...args: any): any => {
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
    };
  }
  return func;
};

export default benchmark;
export {logBenchmarks, benchmark, benchmarkFunction};
