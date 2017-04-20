module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'src/base.spec.ts' },
      { pattern: 'src/**/*.ts' },
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [ require('karma-typescript-angular2-transform') ],
      },
      compilerOptions: {
        lib: ['ES2015', 'DOM'],
      },
      coverageOptions: {
        instrumentation: true,
        threshold: {
          global: {
            statements: 70,
            branches: 70,
            functions: 60,
            lines: 70,
            excludes: [ 'src/**/*.js' ],
          },
        },
      },
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'],
  });
};
