const
  events    = require('events'),
  util      = require('util'),
  splitter  = require('./ldj-splitter').splitter,
  parser    = require('./ldj-parser').parser,
  // client constructor
  LDJClient = function(stream) {
    // Initialize necessary properties from `EventEmitter` in this instance
    events.EventEmitter.call(this);
    stream.on('data', parser(this, splitter(data)));
  };

// Inherit functions from `EventEmitter`'s prototype
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream){
  return new LDJClient(stream);
};
