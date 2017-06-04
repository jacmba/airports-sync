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
});