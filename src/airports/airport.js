'use strict'

const FEET = 0.3048
const COLLECTION = 'airports'

const _ = require('lodash')
const fp = require('highland')

const indexize = async (db) => {
  try {
    await db.createIndex(COLLECTION, {icao: 1}, {name: "ICAOIndex", unique: true})
    console.log('Name index created');
  } catch (e) {
    throw e
  }
}

const getMeters = x => Math.floor(Number(x) * FEET)

const parseAirport = ([type, icao, name, lat, lon, elev, ta], rwys) => Object.freeze({
  icao: icao,
  name: name,
  lat: Number(lat),
  lon: Number(lon),
  elevation: Number(elev),
  ta: Number(ta),
  runways: rwys
})

const parseRunway = ([type, name, hdg, len, wid, hasIls, ils, unused, lat, lon, elev]) => Object.freeze({
  name: name,
  hdg: Number(hdg),
  length: getMeters(len),
  width: getMeters(wid),
  ils: hasIls === '1' ? ils : null,
  lat: Number(lat),
  lon: Number(lon),
  elevation: Number(elev)
})

const process = ([airport, ...runways]) => parseAirport(
  airport.split(','),
  runways.map(x => parseRunway(x.split(',')))
)

const parse = x => processBlocks(splitBlocks(x))

const splitBlocks = x => x.split('\n\n').map(x => x.split('\n'))

const processBlocks = xs => xs.map(x => process(x))

const save = async (db, data) => {
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

/**
 * Airport model interface
 */
module.exports = { 
  indexize,
  parseAirport,
  parseRunway,
  parse,
  splitBlocks,
  process,
  save
}