/**
 * @author Jacinto Mba
 * @since May 30th 2017
 */

'use strict';

let Airports = require('./airports');
let airports = Airports();

airports.init()
.then(() => {
  airports.parseFile();
})
.catch(err => {
  console.error(err);
});