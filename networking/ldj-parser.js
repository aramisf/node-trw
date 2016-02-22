// Parses splitted lines into JSON objects
function parser (self,lines) {
  for (var line in lines) {
    try {
      self.emit('message', JSON.parse(line));
    }
    catch (err) {
      self.emit('message', {type: 'error', name: err.name, text: err.message});
    }
  }
}