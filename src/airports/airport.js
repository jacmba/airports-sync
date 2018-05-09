'use strict'

/*
 * Airport parsing logic
 * Refactored with gorgeous functional style
 * So exited about that
 */

const FEET = 0.3048 // 1 feet = 0.3048 meters
const COLLECTION = 'airports' // Target database collection

const _ = require('lodash')
const { compose } = require('highland')

/**
 * Create database indexes
 * @param {object} db - Database reference object
 */
const indexize = async db => {
  try {
    await db.createIndex(COLLECTION, {icao: 1}, {name: "ICAOIndex", unique: true})
    console.log('Name index created');
  } catch (e) {
    throw e
  }
}

/**
 * Get distance in meters
 * @param {number} x - Distance in feet
 */
const getMeters = x => Math.floor(Number(x) * FEET)

/**
 * Parse airport information
 * @param {Array} param0 - Mapped input data array 
 * @param {Array} rwys - Array of processed runways
 */
const parseAirport = ([type, icao, name, lat, lon, elev, ta], rwys) => Object.freeze({
  icao: icao,
  name: name,
  lat: Number(lat),
  lon: Number(lon),
  elevation: Number(elev),
  ta: Number(ta),
  runways: rwys
})

/**
 * Parse runway information
 * @param {Array} param0 - Mapped array of input data
 */
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

/**
 * Process airport and runways information
 * @param {Array} param0 - Mapped head/tail list (head = airport, tail = runways)
 */
const process = ([airport, ...runways]) => parseAirport(
  airport.split(','),
  runways.map(x => parseRunway(x.split(',')))
)

/**
 * Transform original text data into structured airports array
 * This is the root of the transform breadcrum
 * @param {string} x - Raw text file input data
 */
const parse = x => compose(processBlocks, splitBlocks)(x)

/**
 * Convert text data into information arrays per airport
 * @param {string} x - Text data
 */
const splitBlocks = x => x.split('\n\n').map(x => x.split('\n'))

/**
 * Process separated airports arrays
 * @param {Array} xs - Arrays of splited text data
 */
const processBlocks = xs => xs.map(x => process(x))

/**
 * Store airport document in database
 * @param {object} db - Database handler
 * @param {object} data - Airport object
 */
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