"use strict";
const
  zmq = require('zmq'),
  filename = process.argv[2],
  requester = zmq.socket('req');  // create request endpoint

// handle replies from responder
requester.on("message", function(data) {
  let response = JSON.parse(data);
  // console.log("Received response: ", response);
  console.log("Received response: ", response.pid, response.timestamp);
});

requester.connect("tcp://localhost:5433");

// send request for content
for (let i=0; i<=50; i++) {
  console.log('Sending request ' + i + ' for ' + filename);
  requester.send(JSON.stringify({
    path: filename
  }));
}

