#!/usr/bin/env node
'use strict';

const
    file = require('file'),
    rdfParser = require('./lib/rdf-parser.js');

console.log('beginning directory walk');

file.walk(__dirname + '/RDFs/cache', (err, dirPath, dirs, files) => {

    files.forEach((path) => {

        rdfParser(path, (err, doc) => {
            if (err) {
                throw err;
            } else {
                console.log(doc);
            }
        });
    });
});
