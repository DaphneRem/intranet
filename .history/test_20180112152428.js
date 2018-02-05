// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// require('zone.js/dist/long-stack-trace-zone');
// require('zone.js/dist/proxy.js');
// require('zone.js/dist/sync-test');
// require('zone.js/dist/jasmine-patch');
// require('zone.js/dist/async-test');
// require('zone.js/dist/fake-async-test');
// const getTestBed  = require('@angular/core/testing').getTestBed;
// const BrowserDynamicTestingModule  = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
// const platformBrowserDynamicTesting  = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;



import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};





// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const contextApps = require.context('./apps', true, /\.spec\.ts$/);
// And load the modules.
contextApps.keys().map(contextApps);

const contextLibs = require.context('./libs', true, /\.spec\.ts$/);
// And load the modules.
contextLibs.keys().map(contextLibs);

// Finally, start Karma to run the tests.
__karma__.start();
