'use strict';

const FEET = 0.3048;
const COLLECTION = 'airports';

let _ = require('lodash');

/**
 * Airport model class
 */
class Airport {
  //----------------------------------------------------------------------------
  /**
   * @constructor
   */
  constructor(db) {
    this.db = db;

    this.clear();
  }

  //----------------------------------------------------------------------------
  destroy() {
    this.db.close();
  }

  //----------------------------------------------------------------------------
  indexize() {
    return new Promise((resolve, reject) => {
      this.db.
      createIndex(COLLECTION, {icao: 1}, {name: "ICAOIndex", unique: true})
      .then(() => {
        console.log('Name index created');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  //----------------------------------------------------------------------------
  /**
   * Clean airport info
   */
  clear() {
    this.name = null;
    this.icao = null;
    this.lat = 0;
    this.lon = 0;
    this.elevation = 0;
    this.ta = 0;
    this.runways = [];
  }

  //----------------------------------------------------------------------------
  /**
   * Parse raw information
   * @param {string} data - Input raw airport or runway data
   */
  parse(data) {
    let info = data.split(',');

    // Airport info
    if(info[0] === 'A') {
      console.log('Parsing airport info');
      this.icao = info[1];
      this.name = info[2];
      this.lat = Number(info[3]);
      this.lon = Number(info[4]);
      this.elevation = Number(info[5]);
      this.ta = Number(info[6]);
    } else if(info[0] === 'R') {
      console.log('Parsing runway info');
      let rwy = {
        name: info[1],
        hdg: Number(info[2]),
        length: Math.floor(Number(info[3]) * FEET),
        width: Math.floor(Number(info[4]) * FEET),
        ils: info[5] === '1' ? info[6] : null,
        lat: Number(info[8]),
        lon: Number(info[9]),
        elevation: Number(info[10])
      };

      this.runways.push(rwy);
    } else {
      console.error(`Unknown data "${data}"`);
    }
  }

  //----------------------------------------------------------------------------
  save() {
    let obj = _.toPlainObject(this);
    delete obj.db;
    console.log(`Saving ${JSON.stringify(obj.icao)}`);
    this.db.collection(COLLECTION).updateOne({
      icao: obj.icao
    }, {
      $set: obj
    }, {
      upsert: true
    })
    .then(() => {
      console.log(`Airport ${obj.icao} saved`);
    })
    .catch(err => {
      console.error(`Error saving airport ${obj.icao}: ${err}`);
    });
  }
}

module.exports = Airport;