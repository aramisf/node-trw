#!/usr/bin/env node
'use strict';

const
    async = require('async'),
    file = require('file'),
    request = require('request'),
    rdfParser = require('./lib/rdf-parser.js'),
    work = async.queue((path, done) => {

        rdfParser(path, (err, doc) => {

            const obj = {
                method: 'PUT',
                url: 'http://localhost:5984/books/' + doc._id, json: doc
            };

            request(obj, function reRequest(err, res, body) {

                if (err){
                    // Eventualmente mesmo com uma fila de requisicoes, podemos
                    // incorrer no problema de exceder os limites de conexão.
                    // Abaixo segue uma tentativa de minimizar ainda mais o problema,
                    // da p ver que com esses tratamentos extras, o sistema
                    // aguenta um pouco mais antes de dar outro erro
                    // if (err.code == 'ECONNREFUSED') {
                    //     console.error('Erro de recusa de conexao, tentando novamente');
                    //     setTimeout(() => request(obj, reRequest), 1000);
                    // }
                    // if (err.code == 'ECONNRESET') {
                    //     console.error('Erro de conexao reiniciada, aguardando 5s');
                    //     setTimeout(() => request(obj, reRequest), 5000);
                    // }
                    // Depois desses tratamentos, caimos no erro do async:
                    // /Users/aramisf/git/node-trw/databases/node_modules/async/dist/async.js:837
                    // if (fn === null) throw new Error("Callback was already called.");
                    // Error: Callback was already called.
                    // A melhor opcao para resolver esse problema seria diminuir o tamanho da fila

                    // a biblioteca async tb oferece um retry:
                    // http://caolan.github.io/async/docs.html#retry
                    // else {
                    //     console.log('MAIS UM', err)
                        throw Error(err);
                    // }
                }
                // else {
                    console.log(res.statusCode, body);
                // }
                done();
            })
        });
    }, 10);

    console.log('beginning directory walk');
    file.walk(__dirname + '/RDFs/cache', (err, dirPath, dirs, files) => {
        files.forEach((path) => {
            work.push(path);
        });
    });
