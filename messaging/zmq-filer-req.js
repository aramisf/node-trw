"use strict";
const
  zmq = require('zmq'),
  filename = process.argv[2],
  requester = zmq.socket('req');  // create request endpoint

// handle replies from responder
requester.on("message", function(data) {
  let response = JSON.parse(data);
  console.log("Received response:", response);
});

requester.connect("tcp://localhost:5433");

for (var i = 0; i < 5; i++) {

  // send request for content
  console.log('Sending request ' + i + ' for ' + filename);

  requester.send(JSON.stringify({
    path: filename
  }));
}