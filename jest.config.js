module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    'App/index': ['<rootDir>/client/src/components/App/index'],
    'CanvasRenderer/index': [
      '<rootDir>/client/src/components/CanvasRenderer/index',
    ],
    'Emulator/index': ['<rootDir>/client/src/components/Emulator/index'],
    'GLRenderer/index': ['<rootDir>/client/src/components/GLRenderer/index'],
    'Input/index': ['<rootDir>/client/src/components/Input/index'],
    'Interrupts/index': ['<rootDir>/client/src/components/Interrupts/index'],
    'Memory/index': ['<rootDir>/client/src/components/Memory/index'],
    'Memory/Cartridge': [
      '<rootDir>/client/src/components/Memory/Cartridge/index',
    ],
    'Memory/PPUBridge': ['<rootDir>/client/src/components/Memory/PPUBridge'],
    'PPU/index': ['<rootDir>/client/src/components/PPU/index'],
    'PPUBridge/index': ['<rootDir>/client/src/components/PPUBridge/index'],
    'helpers/index': ['<rootDir>/client/src/helpers/index'],
    'CPU/index': ['<rootDir>/client/src/components/CPU/index'],
  },
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
};
