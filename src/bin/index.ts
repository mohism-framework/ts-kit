#!/usr/bin/env node
require('colors');

import { resolve } from 'path';
import Command from '@mohism/cli-wrapper/dist/libs/command.class';
import TsKit from '../commands/tskit.action';

const pkg = require('../../package.json');

// init
const instance = new Command({
  name: Object.keys(pkg.bin || {})[0],
  root: resolve(`${__dirname}/../..`),
  home: process.env.HOME || '/tmp',
  version: pkg.version,
});

// register
instance.add('tskit', TsKit);

// run
instance.run();
