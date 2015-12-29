var buffer = '';
var lines = [];

function splitter (data) {
  buffer += data;
  var boundary = buffer.indexOf('\n');

  while (boundary !== -1) {
    lines.push(buffer.substr(0, boundary));
    buffer = buffer.substr(boundary + 1);
    boundary = buffer.indexOf('\n');
  }
  return lines;
};