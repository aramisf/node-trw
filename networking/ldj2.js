const
  events    = require('events'),
  util      = require('util'),
  splitter  = require('./ldj-splitter'),
  parser    = require('./ldj-parser'),
  // client constructor
  LDJClient = function(stream) {
    // Initialize necessary properties from `EventEmitter` in this instance
    events.EventEmitter.call(this);
    var self = this; // save LDJClient object
    stream.on('data', function (data) {
      parser(self,splitter(data),this); // because 'this' here refers to the
                                        // Socket object, that will be built
                                        // on line 27 of this file
    });
    // check the following to see the difference:
    // console.log("THIS: '"+this.constructor.name+"'");
    // console.log("SELF: '"+self.constructor.name+"'");
  };

// Inherit functions from `EventEmitter`'s prototype
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream){
  return new LDJClient(stream);
};
