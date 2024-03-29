# `GameBoy Emulator`

## About

A gameboy emulator in TypeScript. This was a massive undertaking and is on the backburner for now. Right now it can load the bios and render background tiles. There are a few issues with interrupt handling and timing. Here are some of the resources I used:

- https://gbdev.io/pandocs/
- https://gekkio.fi/files/gb-docs/gbctr.pdf
- http://imrannazar.com/How-Emulators-Work:-a-presentation
- https://gbdev.io/gb-opcodes/optables/
- http://imrannazar.com/content/files/jsgb.z80.js

[Trello board](https://app.gitkraken.com/glo/board/YCdEVytKOgBi1bHO)

## Features

- [x] WebGL based
- [x] Basic ROM support
- [ ] Remappable keyboard input
- [ ] Sound
- [ ] Support for loading/saving states on server
- [x] Optimized rendering to image texture
- [ ] UI
- [x] Non-MBC support
- [ ] All MBC up to MBC3 supported

## Usage

Check `pacakge.json` for available commands.
