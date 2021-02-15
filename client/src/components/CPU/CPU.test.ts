import { Runner, Delegate } from './z80-test/src';
import DelegateImpl from './z80-test/tests/Test';
import CPU from '.';
import Memory from '../Memory';

/*class CPUDelegate implements Delegate {
  private cpu: CPU;
  constructor(cpu: CPU) {
    this.cpu = cpu;
  }
  startNewTest(name: string): void {}

  setRegister(register: Register, value: number): void;

  getRegister(register: Register): number;

  run(tStateCount: number): CpuEvent[];

  writeMemory(address: number, value: number): void;

  readMemory(address: number): number;

  getTStateCount(): number;
}*/

test('Initializes CPU', () => {
  // Demo of how to run the test.
  const delegate = new DelegateImpl();
  const runner = new Runner(delegate);
  // Whether to check that the number of t-states is correct.
  runner.checkTStates = false;
  // Whether to check that the event list is correct.
  runner.checkEvents = false;
  runner.loadTests();
  runner.runAll();
  for (const error of runner.errors) {
    console.log(error);
  }
  console.log(
    `Passed ${runner.successfulTests} of ${runner.tests.size} (${Math.round(
      (runner.successfulTests * 100) / runner.tests.size
    )}%) with ${runner.errors.length} errors`
  );
  // const CPURunner = new Runner();
  expect(CPU).toBeDefined();
});
