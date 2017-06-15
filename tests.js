require('core-js/es7/reflect');
require('zone.js/dist/zone-node.js');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');

require('ts-node/register');

const Jasmine = require('jasmine');
const runner = new Jasmine();
global.jasmine = runner.jasmine;

require('zone.js/dist/jasmine-patch.js');

// Stuff in the `testing` folder needs to import stuff from @angular-redux instead of '../src'
// or bad things happen when users of this package try to use MockNgRedux etc. This bit of code
// gets the unit test process to alias `import '@angular-redux/store'` to `import `../src` during
// our unit test execution.
const tsconfigPaths = require('tsconfig-paths');
tsconfigPaths.register({
  baseUrl: '.',
  paths: { '@angular-redux/store': [''] },
});

const { getTestBed } = require('@angular/core/testing');
const { ServerTestingModule, platformServerTesting } = require('@angular/platform-server/testing');

getTestBed().initTestEnvironment(ServerTestingModule, platformServerTesting());

runner.loadConfig({
  spec_dir: '.',
  spec_files: [ '**/*.spec.ts' ]
});

runner.execute();
