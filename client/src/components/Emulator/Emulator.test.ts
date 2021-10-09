describe('Emulator', () => {
  // const gb: Emulator = new Emulator();
  // const bios = new Uint8Array([...Array(8192).fill(1)]);
  // const rom = new Uint8Array([...Array(8192).fill(1)]);
  // const setupGb = (): void => {
  //   gb.load(bios, rom);
  // };
  // beforeEach(() => {
  //   gb.reset();
  // });
  // it('loads bios and rom files', () => {
  //   expect(setupGb()).toEqual(true);
  // });
  // it('updates', () => {
  //   setupGb();
  //   gb['cpu'].executeInstruction = jest.fn();
  //   gb['cpu'].checkInterrupts = jest.fn();
  //   gb['ppu'].buildGraphics = jest.fn();
  //   gb.update();
  //   // calls occur multiple times
  //   expect(gb['cpu'].executeInstruction).toHaveBeenCalled();
  //   expect(gb['ppu'].buildGraphics).toHaveBeenCalled();
  //   expect(gb['cpu'].checkInterrupts).toHaveBeenCalled();
  // });
});
