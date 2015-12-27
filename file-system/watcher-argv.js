const
fs = require('fs'),
filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}
if (!fs.exists(filename)){
  console.log("The file '"+filename+"' does not exists.");
  process.exit(1);
}
fs.watch(filename, function() {
    console.log("File " + filename + " just changed!");
});

console.log("Now watching " + filename + " for changes...");
