#!/usr/bin/env node
const program = require('commander');
const figlet = require('figlet');
const { dumpLetters, getLink } = require('../index');

console.log(figlet.textSync('Wnlk', 'ANSI Shadow'));

program
  .usage('<linkUrl>')
  .version('0.0.1')
  .option('-d, --dump', 'Dump captcha letters')
  .action(async function(cmd) {
    if (cmd.dump) {
      await dumpLetters();
      return;
    }
    if (cmd) {
      try {
        console.log('----- Get link ------------');
        const link = await getLink(cmd);
        console.log(link);
      }
      catch(e) {
        console.error(e.error || e);
      }
    }
  });

program.parse(process.argv);
