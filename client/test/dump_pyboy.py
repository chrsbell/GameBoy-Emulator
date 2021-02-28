import os
import sys
import io
from pyboy import PyBoy

dirname = os.path.dirname(__file__)

def main():
  if len(sys.argv) >= 2:
    rom = sys.argv[1];
    out_dir = os.path.join(dirname, 'generated')
    rom_dir = os.path.join(out_dir, rom)
    if not os.path.exists(rom_dir):
      os.makedirs(rom_dir)

    bootrom_file=os.path.join(dirname, '..', '..', 'public', 'roms', 'bios.bin')
    pyboy = PyBoy(os.path.join(dirname, '..', '..', 'public', 'roms', rom), bootrom_file=None, disable_renderer=False, sound=False)
    f = open(os.path.join(dirname, 'generated', rom, 'save.state'), 'wb')
    for i in range(100):
      # save_state(f, pyboy.mb)
      pyboy.save_state(f)
      pyboy.tick();
  else:
    print('Number of arguments:', len(sys.argv), 'arguments.')
    print ('Argument List:', str(sys.argv))
    print('Invalid number of arguments for PyBoy.')

if __name__ == "__main__":
  main()
