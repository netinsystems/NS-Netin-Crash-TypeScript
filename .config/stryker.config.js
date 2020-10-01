module.exports = function(config) {
  config.set({
      mutate: [
          'src/**/*.ts',
          '!src/**/*.test.ts',
          '!src/**/*-test.ts',
          '!src/**/*.spec.ts',
          '!src/**/*-spec.ts',
      ],
      mutator: {
          name: 'typescript',
          excludedMutations: ['StringLiteral'],
      },
      tsconfigFile: 'tsconfig.json',
      transpilers: ['typescript'],
      packageManager: 'npm',
      reporters: ['html', 'clear-text', 'progress', 'dashboard'],
      testRunner: 'mocha',
      testFramework: 'mocha',
      allowConsoleColors: true,
      fileLogLevel: 'info',
      logLevel: 'info',
      coverageAnalysis: 'off',
      maxConcurrentTestRunners: 4,
      thresholds: {
          high: 80,
          low: 60,
          break: 40
      },
      mochaOptions: {
          // Optional mocha options
          spec: ["dist/**/*.test.js"]
      },
  });
};
