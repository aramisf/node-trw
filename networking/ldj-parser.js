// Parses splitted lines into JSON objects
function parser (self,lines) {
  for line in lines {
    try {
      self.emit('message', JSON.parse(input));
    }
    catch (err) {
      self.emit('message', {type: 'error', name: err.name, text: err.message});
    }
  }
}