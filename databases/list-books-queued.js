'use strict';

const
  async = require('async'),
  file = require('file'),
  rdfParser = require('./lib/rdf-parser.js'),
  work = async.queue((path, done) => {
  	rdfParser(path, (err, doc) => {
	    console.log(doc);
			done();
		});
	}, 1000);

  console.log('beginning directory walk');
  file.walk(__dirname + '/RDFs/cache', (err, dirPath, dirs, files) => {
  	files.forEach((path) => {
  		work.push(path);
  	});
  });
