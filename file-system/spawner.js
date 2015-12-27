"use strict";
const
fs = require('fs'),
spawn = require('child_process').spawn,
proc = process.argv[2],
args = process.argv.slice(3);

let result = spawn(proc, args);
result.stdout.on('data', function(data) {
  process.stdout.write(data.toString());
});

