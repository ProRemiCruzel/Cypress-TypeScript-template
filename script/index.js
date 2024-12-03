/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const { Command } = require('commander');
const { bootstrap: bootstrapSwitchEnv } = require('./switch-env');

const program = new Command();
bootstrapSwitchEnv(program);
program.parse();
