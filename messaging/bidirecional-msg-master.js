'use strict';
const
  cluster       = require('cluster'),
  zmq           = require('zmq'),
  readyCounter  = 0;

if (cluster.isMaster) {
  let
    pushSock  = zmq.socket('push').bind('ipc://to_workers.ipc'),
    pullSock  = zmq.socket('pull').bind('ipc://from_workers.ipc');

  // listen for messages on a pull socket
  //   - if msg == 'ready' -> readyCounter++
  //   - if msg == 'result' -> console.log(msg)
  pullSock.on('ready', function (){
    readyCounter++;
  });

  pullSock.on('result', function (msg){
    console.log(msg);
  })

  // spin up 3 workers
  // keep a count of ready workers
  for (let i = 0; i < 3; i++) {
    var worker = cluster.fork();
    worker.on('ready', function(){
      readyCounter++;
    })
    if (readyCounter == 3) {
      cluster.emit('ok'); // signal to send 30 job msgs out throught the PUSH socket
    }
  }

  // register worker 'ready' warning
  cluster.on('online', function(worker) {
    readyCounter++;
    console.log('Worker ' + worker.process.pid + ' is online.');
    pushSock.emit('ready');
  });

  // readyCounter == 3 ? send 30 job msgs to the push socket: null
  cluster.on('ok', function(){
    for (var i = 0; i < 30; i++) {
      pushSock.send('msg', JSON.stringify({
        msg: "Superprofundo in the early eve of your day",
        pid: process.pid
      }));
    }
  });
}
else {
  // create PULL socket and connect to master PUSH
  // create PUSH socket and connect to master PULL
  let
    pushSock  = zmq.socket('push').bind('ipc://from_workers.ipc'),
    pullSock  = zmq.socket('pull').bind('ipc://to_workers.ipc');

  // listen for msg on the PULL socket
  //   - treat this as job and respond by sending a result message out on the PUSH socket
  pullSock.on('msg', function(err,data) {
    pushSock.send('result', {data: "Sample text"});
  })
  // send a ready message out on the PUSH socket
  // * send at least worker pid on result messages
  process.on('online', function (err, data) {
    pushSock.send('ready', JSON.stringify({
      msg: "I'm ready, madafaca!",
      pid: process.pid
    }));
  })
}