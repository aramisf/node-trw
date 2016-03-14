// Bidirectional Messaging
// Solving the firt-joiner problem: when the worker process is so fast, that
// it handles all the incoming connections, and the other worker processess
// do not get any assignment.

// Create a Node.js program that uses the cluster and zmq modules and does the
// following.
// The master process should
// • Create a PUSH socket and bind it to an IPC endpoint—this socket will be
// for sending jobs to the workers.
// • Create a PULL socket and bind to a different IPC endpoint—this socket
// will receive messages from workers.
// • Keep a count of ready workers (initialized to 0).
// • Listen for messages on the PULL socket, and
// – If the message is a ready message, increment the ready counter, or
// – If the message is a result message, output it to the console.
// • Spin up three worker processes.
// • When the ready counter reaches 3, send thirty job messages out through
// the PUSH socket.
// Each worker process should
// • Create a PULL socket and connect it to the master’s PUSH endpoint.
// • Create a PUSH socket and connect it to the master’s PULL endpoint.
// • Listen for messages on the PULL socket, and
// – Treat this as a job and respond by sending a result message out on the
// PUSH socket.
// • Send a ready message out on the PUSH socket.
// Result messages should include at least the process ID of the worker. This
// way you can inspect the console output and confirm that the workload is
// being balanced among the worker processes.

// Push
const
  zmq = require('zmq'),
  pusher = zmq.socket('push');
  // wait until pullers are connected and ready, then send 100 jobs ...
  for (let i = 0; i < 100; i++) {
    pusher.send(JSON.stringify({
      details: "details about this job."
    });
  }

// Pull
const
  zmq = require('zmq'),
  puller = zmq.socket('pull');
  // connect to the pusher, announce readiness to work, then wait for work ...
  puller.on('message', function(data) {
    let job = JSON.parse(data.toString());
    // do the work described in the job
  });