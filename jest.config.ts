import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    coverageReporters: ['lcov', 'text', 'html'],
};

export default config;
