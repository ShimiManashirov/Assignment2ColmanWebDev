/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["<rootDir>/jest.setup.ts"],
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/**/server.ts", "!src/swagger.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "clover", "html"],
};
