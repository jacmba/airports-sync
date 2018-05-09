/**
 * Test airport model
 */

'use strict';

const assert = require('assert')
const {parse} = require('../src/airports/airport')

suite('Airport model tests', () => {

  //----------------------------------------------------------------------------
  test('Parse airport data', () => {
    const data = 'A,LEMD,ADOLFO SUAREZ MADRID,40.472222,-3.560833,1998,13000,0,13700,0'
    const airport = parse(data)
    assert.strictEqual(airport.icao, 'LEMD')
    assert.strictEqual(airport.name, 'ADOLFO SUAREZ MADRID')
    assert.strictEqual(airport.lat, 40.472222)
    assert.strictEqual(airport.lon, -3.560833)
    assert.strictEqual(airport.elevation, 1998)
    assert.strictEqual(airport.ta, 13000)
  });

  //----------------------------------------------------------------------------
  test('Parse runway data', () => {
    const rwy = parse('R,36L,1,13711,197,0,0.000,0,40.492589,-3.574622,1985,3.00,50,1,0')
    assert.strictEqual(rwy.name, '36L', 'Runway name should be 36L')
    assert.strictEqual(rwy.hdg, 1, 'Runway heading should be 1')
    assert.strictEqual(rwy.length, 4179, 'Runway should be 4179 meters length')
    assert.strictEqual(rwy.width, 60, 'Runway should be 60 meters width')
    assert.strictEqual(rwy.ils, null, 'Runway ILS freq should be null')
    assert.strictEqual(rwy.lat, 40.492589, 'Latitude should be 40.492589')
    assert.strictEqual(rwy.lon, -3.574622, 'Longitude should be -3.574622')
    assert.strictEqual(rwy.elevation, 1985, 'Elevation should be 1985')
  })
})