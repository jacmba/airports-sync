/**
 * Test airport model
 */

'use strict';

let assert = require('assert');
let Airport = require('../src/airports/airport');

let airport;

describe('Airport model tests', () => {
  //----------------------------------------------------------------------------
  before(() => {
    airport = new Airport();
  });

  //----------------------------------------------------------------------------
  it('airport should not be a null or undefined object', () => {
    assert.notStrictEqual(airport, null);
    assert.notStrictEqual(airport, undefined);
  });

  //----------------------------------------------------------------------------
  it('airport should have clean info', () => {
    assert.strictEqual(airport.icao, null, 'ICAO should be null');
    assert.strictEqual(airport.name, null, 'Name should be null');
    assert.strictEqual(airport.lat, 0, 'Latitude should be 0');
    assert.strictEqual(airport.lon, 0, 'Longitude should be 0');
    assert.strictEqual(airport.elevation, 0, 'Elevation should be 0');
    assert.strictEqual(airport.runways.length, 0, 'Should have 0 runways');
    assert.strictEqual(airport.ta, 0, 'Transition altitude should be 0');
  });

  //----------------------------------------------------------------------------
  it('Parse airport data', () => {
    airport.parse('A,LEMD,ADOLFO SUAREZ MADRID,40.472222,-3.560833,1998,13000,0,13700,0');
    assert.strictEqual(airport.icao, 'LEMD');
    assert.strictEqual(airport.name, 'ADOLFO SUAREZ MADRID');
    assert.strictEqual(airport.lat, 40.472222);
    assert.strictEqual(airport.lon, -3.560833);
    assert.strictEqual(airport.elevation, 1998);
    assert.strictEqual(airport.ta, 13000);
  });

  //----------------------------------------------------------------------------
  it('Parse runway data', () => {
    airport.parse('R,36L,1,13711,197,0,0.000,0,40.492589,-3.574622,1985,3.00,50,1,0');
    let rwy = airport.runways[0];
    assert.strictEqual(airport.runways.length, 1, 'Should have 1 runway');
    assert.strictEqual(rwy.name, '36L', 'Runway name should be 36L');
    assert.strictEqual(rwy.hdg, 1, 'Runway heading should be 1');
    assert.strictEqual(rwy.length, 4179, 'Runway should be 4179 meters length');
    assert.strictEqual(rwy.width, 60, 'Runway should be 60 meters width');
    assert.strictEqual(rwy.ils, null, 'Runway ILS freq should be null');
    assert.strictEqual(rwy.lat, 40.492589, 'Latitude should be 40.492589');
    assert.strictEqual(rwy.lon, -3.574622, 'Longitude should be -3.574622');
    assert.strictEqual(rwy.elevation, 1985, 'Elevation should be 1985');
  });
});