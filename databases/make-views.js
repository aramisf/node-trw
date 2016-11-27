#!/usr/bin/env node
'use strict';
const
    async = require('async'),
    request = require('request'),
    views = require('./lib/views.js');

async.waterfall([
    // get the existing design doc (if present)
    (next) => {
        request.get('http://couchdb:5984/books/_design/books', next);
    },
    // create a new design doc or use existing
    (res, body, next) => {
        if (res.statusCode === 200) {
            next(null, JSON.parse(body));
        } else if (res.statusCode === 404) {
            next(null, { views: {} });
        }
    },
    // add views to document and submit
    (doc, next) => {
        Object.keys(views).forEach((name) => {
            doc.views[name] = views[name];
        });

        request({
            method: 'PUT',
            url: 'http://couchdb:5984/books/_design/books', json: doc
        }, next);
    }
    ],
    (err, res, body) => {
        if (err) { throw err; }
        console.log(res.statusCode, body);
    }
);