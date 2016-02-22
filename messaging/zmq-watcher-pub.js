'use strict';
const
  fs = require('fs'),
  zmq = require('zmq'),
  publisher = zmq.socket('pub'), // create publisher endpoint
  filename = process.argv[2];

fs.watch(filename, function(){

  publisher.send(JSON.stringify({ // send message to any subscribers
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  }));
});

// listen on TCP port 5432
publisher.bind('tcp://*:5432', function(err) {
  console.log('Listening for zmq subscribers...');
});