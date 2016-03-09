// Parses splitted lines into JSON objects
module.exports = function (self,lines) {
  for (var line in lines) {
    try {
      self.emit('message', JSON.parse(lines[line]));
    }
    catch (err) {
      self.emit('message', {type: 'error', name: err.name, text: err.message});
    }
  }
}