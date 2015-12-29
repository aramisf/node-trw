const
  events = require('events'),
  util = require('util'),
  // client constructor
  LDJClient = function(stream) {
    // Initialize necessary properties from `EventEmitter` in this instance
    events.EventEmitter.call(this);
    var
      self = this,
      buffer = '';

    stream.on('data', function(data) {
      buffer += data;
      var boundary = buffer.indexOf('\n');
      //console.log('received data');
      while (boundary !== -1) {
        var input = buffer.substr(0, boundary);
        buffer = buffer.substr(boundary + 1);
        self.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });
  };

// Inherit functions from `EventEmitter`'s prototype
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream){
  return new LDJClient(stream);
};
