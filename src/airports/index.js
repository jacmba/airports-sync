'use strict';

const FILEPATH = __dirname + '/../../data/airports.txt';
const DB_URI = `mongodb://mongo:${process.env.DB_PORT || 27017}/airports`;

let Airport = require('./airport');
let fs = require('fs');
let ReadLine = require('readline');
let Mongo = require('mongodb');

function AirportIndex () {
  let readline;
  let model;

  return {
    //--------------------------------------------------------------------------
    init() {
      return new Promise((resolve, reject) => {
        try {
          readline = ReadLine.createInterface({
            input: fs.createReadStream(FILEPATH)
          });

          Mongo.MongoClient.connect(DB_URI, (err, db) => {
            if(err) {
              return reject(err);
            }
            model = new Airport(db);

            model.indexize()
            .then(() => {
              console.log('Indexes creation completed');
              resolve();
            })
            .catch(err => {
              return reject(err);
            });
          });
        } catch(e) {
          return reject(e);
        }
      });
    },

    //--------------------------------------------------------------------------
    tearDown() {
      model.destroy();
    },

    //--------------------------------------------------------------------------
    parseFile() {
      return new Promise((resolve, reject) => {
        readline.on('line', line => {
          if(line.length === 0) {
            model.save();
            model.clear();
          } else {
            try {
              model.parse(line);
            } catch (e) {
              return reject(e);
            }
          }
        });

        readline.on('close', () => {
          resolve();
        });
      });
    }
  };
}

module.exports = AirportIndex;