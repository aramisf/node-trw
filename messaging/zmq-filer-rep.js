'use strict';
const
  fs = require('fs'),
  zmq = require('zmq'),
  responder = zmq.socket('rep');  // socket to reply to client requests

// handle incoming requests
responder.on('message', function(data) {

  // parse incoming message
  let request = JSON.parse(data);
  console.log('Received request to get: ' + request.path);

  // read file and reply with content
  fs.readFile(request.path, function(err, content) {
    if (err) {
      console.log('ERROR! ' + err);
      responder.send (JSON.stringify({
        error: err.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }));
    }

    else {
      console.log('Sending response content');
      responder.send(JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }));
    }
  });

});

// listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function(err) {
  console.log('Listening for zmq requesters...');
});

// close the responder when the Node process ends
process.on('SIGINT', function() {
  console.log('Shutting down...');
  responder.close();
});

process.on('SIGTERM', function() {
  console.log('Received a SIGTERM, shutting down...\\o');
  responder.close();
});

process.on('uncaughtException', function(msg){
  console.log("uncaughtException: " + msg);
  responder.close();
});
