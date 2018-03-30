/**
 * @author Jacinto Mba
 * @since May 30th 2017
 */

'use strict';

let Airports = require('./airports');
let airports = Airports();

let start;
let stop;

airports.init()
.then(() => {
  console.log('Starting process');
  start = new Date().getTime();
  return airports.parseFile();
})
.then(() => {
  console.log('Finished process');
  stop = new Date().getTime();
  let elapse = stop - start;
  console.log(`
  ====================================
  Process completed in ${elapse}ms
  ====================================
  `);
  airports.tearDown();
  setTimeout(() => {
    process.exit(0);
  }, 3000);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});