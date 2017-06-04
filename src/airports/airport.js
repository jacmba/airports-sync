'use strict';

/**
 * Airport model class
 */
class Airport {
  //----------------------------------------------------------------------------
  /**
   * @constructor
   */
  constructor(db, file) {
    this.db = db;
    this.file = file;

    this.clear();
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
    }
  }
}

module.exports = Airport;