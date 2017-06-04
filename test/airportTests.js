/**
 * Test airport model
 */

'use strict';

let assert = require('assert');
let Airport = require('../src/airports/Airport');

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
    //assert.strictEqual(airport.runways.length, 1, '')
  });
});