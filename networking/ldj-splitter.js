
function splitter (data) {
  var buffer = data;
  var lines = [];
  var boundary = buffer.indexOf('\n');

  while (boundary !== -1) {
    lines.push(buffer.substr(0, boundary));
    buffer = buffer.substr(boundary + 1);
    boundary = buffer.indexOf('\n');
  }
  return lines;
};