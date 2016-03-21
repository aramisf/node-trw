// Bidirectional Messaging
// Solving the firt-joiner problem: when the worker process is so fast, that
// it handles all the incoming connections, and the other worker processess
// do not get any assignment.

// Create a Node.js program that uses the cluster and zmq modules and does the
// following.
const
  cluster = require('cluster'),
  zmq     = require('zmq');


// The master process should
if (cluster.isMaster) {

  var
  // • Create a PUSH socket and bind it to an IPC endpoint—this socket will be
  // for sending jobs to the workers. OK
  pushSock = zmq.socket('push').bind('ipc://master_to_worker.ipc'),

  // • Create a PULL socket and bind to a different IPC endpoint—this socket
  // will receive messages from workers. OK
  pullSock = zmq.socket('pull').bind('ipc://worker_to_master.ipc'),

  // • Keep a count of ready workers (initialized to 0). OK
  readyWorkers = 0,

  sendJobs = function () {
    for (var i=1; i<=30; i++) {
      pushSock.send(JSON.stringify({
        kind: 'job',
        text: 'Job #'+i
      }))
    }
  };

  // • Listen for messages on the PULL socket, and
  // – If the message is a ready message, increment the ready counter, or OK
  pullSock.on('message', function(data){

    var msg = JSON.parse(data);

    if (msg.kind == 'ready') {

      readyWorkers++;
      // • When the ready counter reaches 3, send thirty job messages out through
      // the PUSH socket.
      if (readyWorkers == 3) sendJobs();
    }
    // – If the message is a result message, output it to the console. OK
    else if (msg.kind == 'result') {
      console.log('Result: '+msg.text);
    }
    else {
      console.log('Received: '+data); // Debbuging purposes
    };
  });

  // • Spin up three worker processes. OK
  for (var i=0; i < 3; i++) {
    cluster.fork();
  }

  // Event emitted only on master, not on worker
  cluster.on('online', function(worker) {
    console.log('Worker '+ worker.process.pid + 'just got online.');
  })
}

// Each worker process should
else {

  var
  // • Create a PULL socket and connect it to the master’s PUSH endpoint.
  // a worker pulls data from a channel where the master pushed data.
  pullSock = zmq.socket('pull').connect('ipc://master_to_worker.ipc')

  // • Create a PUSH socket and connect it to the master’s PULL endpoint.
  // a worker pushs data from a channel where the master pulled data.
  pushSock = zmq.socket('push').connect('ipc://worker_to_master.ipc');

  // • Listen for messages on the PULL socket, and
  // – Treat this as a job and respond by sending a result message out on the
  // PUSH socket.
  pullSock.on('message', function(data) {

    var msg = JSON.parse(data);

    if (msg.kind == 'job') {

      console.log(process.pid+' received job: '+msg.text+'. Sending result...');

      // Result messages should include at least the process ID of the worker. This
      // way you can inspect the console output and confirm that the workload is
      // being balanced among the worker processes.
      pushSock.send(JSON.stringify({
        kind: 'result',
        text: 'Process '+process.pid+' responding to job '+msg.text
      }));
    }

    else {
      console.log('['+process.pid+']: Unknown message kind: '+data);
    }
  })

  // • Send a ready message out on the PUSH socket.
  // Which is the last thing the program should do.
  pushSock.send(JSON.stringify({
    kind: 'ready',
    text: process.pid + ' ready, Sir!'
  }));
}