"use strict";
var
net = require('net'),
ldj = require('./ldj2.js'),
// ldj = require('./robust_ldj.js'),
netClient = net.connect({ port: 5432 }),
ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {

  if (message.type === 'watching') {
    console.log("Now watching: " + message.file);
  } else if (message.type === 'changed') {
    console.log(
    "File '" + message.file + "' changed at " + new Date(message.timestamp)
    );
  } else if (message.type == 'error') {
    console.log(
    "Error '" + message.name + "' occurred with message '"+message.text+"'"
    );
  } else {
    throw Error("Unrecognized message type: " + message.type);
  }
});
