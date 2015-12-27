const
fs = require('fs'),
filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}
fs.exists(filename, function(exists) {
  if (!exists) {
    console.log("File '"+filename+"' does not exist.");
    process.exit(1);
  }
});

fs.watch(filename, function() {
  console.log("File " + filename + " just changed!");
});

console.log("Now watching " + filename + " for changes...");
