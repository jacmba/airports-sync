'use strict'

const FEET = 0.3048
const COLLECTION = 'airports'

let _ = require('lodash')

/**
 * Airport model functions
 */
module.exports = {

  //----------------------------------------------------------------------------
  async indexize(db) {
    try {
      await db.createIndex(COLLECTION, {icao: 1}, {name: "ICAOIndex", unique: true})
      console.log('Name index created');
    } catch (e) {
      throw e
    }
  },

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
  },

  //----------------------------------------------------------------------------
  /**
   * Parse raw information
   * @param {string} data - Input raw airport or runway data
   */
  parse(data) {
    const parseAirport = ([icao, name, lat, lon, elev, ta]) => Object.freeze({
      icao: icao,
      name: name,
      lat: Number(lat),
      lon: Number(lon),
      elevation: Number(elev),
      ta: Number(ta)
    })

    const parseRunway = ([name, hdg, len, wid, hasIls, ils, unused, lat, lon, elev]) => Object.freeze({
      name: name,
      hdg: Number(hdg),
      length: getMeters(len),
      width: getMeters(wid),
      ils: hasIls === 1 ? ils : null,
      lat: Number(lat),
      lon: Number(lon),
      elevation: Number(elev)
    })

    const getMeters = x => Math.floor(Number(x) * FEET)

    const process = ([type, ...body]) => {
      if(type === 'A') return parseAirport(body)
      else if (type === 'R') return parseRunway(body)
      else console.error(`Unknown data type "${type}"`); return {}
    }

    return process(data.split(','))
  },

  //----------------------------------------------------------------------------
  async save(db, data) {
    console.log(`Saving ${JSON.stringify(data.icao)}`);

    try {
      await this.db.collection(COLLECTION).updateOne({
        icao: data.icao
      }, {
        $set: data
      }, {
        upsert: true
      })
      console.log(`Airport ${data.icao} saved`)
    } catch (e) {
      console.error(`Error saving airport ${data.icao}: ${e}`)
    }
  }
}