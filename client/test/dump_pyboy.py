import os
import sys
import io
from pyboy.utils import IntIOWrapper
from pyboy import PyBoy

dirname = os.path.dirname(__file__)
out_dir = os.path.join(dirname, "generated")

def runCPUTest(rom_path, rom_name):
    print("Generating expected for " + rom_name)
    rom_file = os.path.join(rom_path, rom_name)
    pyboy = PyBoy(rom_file, bootrom_file=None, disable_renderer=False, sound=False)

    pyboy.set_emulation_speed(0)
    state_file = os.path.join(dirname, "generated", rom_name + ".state")
    if os.path.exists(state_file):
      os.remove(state_file)
    cpu_state = IntIOWrapper(
        open(state_file, "wb")
    )
    while not pyboy.tick(cpu_state):
        pass
    pyboy.stop()
    print("Finished")


def main():
    # Create generated dir
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
    # Dir pointing to cpu instruction test gameboy roms
    cpu_test_dir = os.path.join(dirname, "gb-test-roms", "cpu_instrs", "individual")
    # runCPUTest(cpu_test_dir, "tetris.gb")
    # runCPUTest(cpu_test_dir, "opus5.gb")
    # runCPUTest(cpu_test_dir, "01-special.gb")
    # runCPUTest(cpu_test_dir, "02-interrupts.gb")
    # runCPUTest(cpu_test_dir, "03-op sp,hl.gb")
    # runCPUTest(cpu_test_dir, "04-op r,imm.gb")
    # runCPUTest(cpu_test_dir, "05-op rp.gb")
    # runCPUTest(cpu_test_dir, "06-ld r,r.gb")
    # # runCPUTest(cpu_test_dir, "07-jr,jp,call,ret,rst.gb")
    # runCPUTest(cpu_test_dir, "08-misc instrs.gb")
    # runCPUTest(cpu_test_dir, "09-op r,r.gb")
    # runCPUTest(cpu_test_dir, "10-bit ops.gb")
    # runCPUTest(cpu_test_dir, "bios.gb")


if __name__ == "__main__":
    main()
