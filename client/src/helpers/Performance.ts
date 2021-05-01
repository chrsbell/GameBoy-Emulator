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

const getBenchmarks = () => times;

const benchmark = (func: Function, context: any = null) => {
  const className = context ? context.constructor.name : 'Helpers';
  return (...args: any) => {
    // benchmark random calls
    if (Math.random() * 1000 <= 5) {
      const t1 = performance.now();
      const value = func(...args);
      const t2 = performance.now();
      if (!times[className]) times[className] = {};
      if (!times[className][func.name]) {
        times[className][func.name] = {
          averageCallTime: t2 - t1,
          elapsedMilliseconds: t2 - t1,
          numberOfCalls: 1,
        };
      } else {
        const {elapsedMilliseconds, numberOfCalls} = times[className][
          func.name
        ];
        times[className][func.name].elapsedMilliseconds += t2 - t1;
        times[className][func.name].numberOfCalls += 1;
        times[className][func.name].averageCallTime =
          elapsedMilliseconds / numberOfCalls;
      }
      return value;
    }
    return func(...args);
  };
};

const benchmarksEnabled = true;

export default benchmark;
export {getBenchmarks, benchmarksEnabled};
