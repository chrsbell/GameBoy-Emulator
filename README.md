# `GameBoy Emulator`

## About

Currently developing a Game Boy emulator using TypeScript. I'm referencing many different documentation sources for this:

- https://gbdev.io/pandocs/
- https://gekkio.fi/files/gb-docs/gbctr.pdf
- http://imrannazar.com/How-Emulators-Work:-a-presentation
- http://marc.rawer.de/Gameboy/Docs/GBCPUman.pdf
- https://gbdev.io/gb-opcodes/optables/
- http://imrannazar.com/content/files/jsgb.z80.js

## Features

- [x] WebGL 2.0 based
- [ ] Basic ROM support
- [ ] Remappable keyboard input
- [ ] Sound
- [ ] Support for loading/saving states on server
- [ ] Optimized rendering to image texture
- [ ] Nice looking UI
- [x] Non-MBC support
- [ ] All MBC up to MBC3 supported

## Installing Dependencies

This emulator should run on any modern browser with WebGL 2.0 support, install command:

```sh
npm i
```

## Usage

- Start the server using `npm start`
- Build for development using `npm run build-dev`
