/**
 * Test airport model
 */

'use strict';

const assert = require('assert')
const ap = require('../src/airports/airport')
const fs = require('fs')

const MOCK = __dirname + '/mock.txt'

suite('Airport model tests', () => {

  test('Parse airport data', () => {
    const data = 'A,LEMD,ADOLFO SUAREZ MADRID,40.472222,-3.560833,1998,13000,0,13700,0'
    const airport = ap.parseAirport(data.split(','))
    assert.strictEqual(airport.icao, 'LEMD')
    assert.strictEqual(airport.name, 'ADOLFO SUAREZ MADRID')
    assert.strictEqual(airport.lat, 40.472222)
    assert.strictEqual(airport.lon, -3.560833)
    assert.strictEqual(airport.elevation, 1998)
    assert.strictEqual(airport.ta, 13000)
  });

  test('Parse runway data', () => {
    const data = 'R,36L,1,13711,197,0,0.000,0,40.492589,-3.574622,1985,3.00,50,1,0'
    const rwy = ap.parseRunway(data.split(','))
    assert.strictEqual(rwy.name, '36L', 'Runway name should be 36L')
    assert.strictEqual(rwy.hdg, 1, 'Runway heading should be 1')
    assert.strictEqual(rwy.length, 4179, 'Runway should be 4179 meters length')
    assert.strictEqual(rwy.width, 60, 'Runway should be 60 meters width')
    assert.strictEqual(rwy.ils, null, 'Runway ILS freq should be null')
    assert.strictEqual(rwy.lat, 40.492589, 'Latitude should be 40.492589')
    assert.strictEqual(rwy.lon, -3.574622, 'Longitude should be -3.574622')
    assert.strictEqual(rwy.elevation, 1985, 'Elevation should be 1985')
  })

  test('Load and parse mock file in blocks', () => {
    const content = fs.readFileSync(MOCK, 'utf8')
    const blocks = ap.splitBlocks(content)
    assert.strictEqual(blocks.length, 2)
    assert.strictEqual(blocks[0].length, 5)
    assert.strictEqual(blocks[1].length, 3)
  })

  test('Process block airport array =>', () => {
    const x = [
      'A,GCLP,GRAN CANARIA,27.931944,-15.386667,78,6000,0,10100,0',
      'R,03L,26,10171,148,1,109.900,26,27.918867,-15.392342,78,3.00,53,1,0',
      'R,03R,26,10171,148,0,0.000,0,27.918181,-15.390350,69,3.00,50,1,0',
      'R,21L,206,10171,148,0,0.000,0,27.944219,-15.378847,27,3.00,50,1,0',
      'R,21R,206,10171,148,1,110.700,206,27.944911,-15.380831,33,3.00,54,1,0'
    ]

    const y = ap.process(x)
    
    assert.strictEqual(y.icao, 'GCLP')
    assert.strictEqual(y.name, 'GRAN CANARIA')
    assert.strictEqual(y.runways.length, 4)
    assert.strictEqual(y.runways[0].name, '03L')
  })

  test('Full pipeline process', () => {
    const x = fs.readFileSync(__dirname + '/mock.txt', 'utf8')
    const y = ap.parse(x)
    assert.strictEqual(y.length, 2)
    assert.strictEqual(y[0].icao, 'GCLP')
    assert.strictEqual(y[1].icao, 'GCRR')
    assert.strictEqual(y[1].runways.length, 2)
    assert.strictEqual(y[1].runways[1].name, '21')
  })
})