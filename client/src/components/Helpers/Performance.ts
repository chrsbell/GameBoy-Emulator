type benchmarkTimes = {
  [key: string]: {
    elapsed: number;
    calledTimes: number;
  };
};

const times: benchmarkTimes = {};

const getBenchmarks = () => times;

const benchmark = (func: Function) => {
  return (...args: any) => {
    if (Math.random() * 1000 <= 5) {
      const t1 = performance.now();
      const value = func(...args);
      const t2 = performance.now();
      if (!times[func.name]) {
        times[func.name] = {elapsed: t2 - t1, calledTimes: 1};
      } else {
        times[func.name].elapsed += t2 - t1;
        times[func.name].calledTimes += 1;
      }
      return value;
    }
    return func(...args);
  };
};

const benchmarksEnabled = true;

export default benchmark;
export {getBenchmarks, benchmarksEnabled};
