/**
 * @author Jacinto Mba
 * @since May 30th 2017
 */

'use strict'

const airports = require('./airports');

(async () => {
  try {
    const db = await airports.init()
    console.log('Starting process')
    const start = new Date().getTime()
    await airports.parseFile(db)
    console.log('Finished process')
    const stop = new Date().getTime()
    let elapse = stop - start
    console.log(`
    ====================================
    Process completed in ${elapse}ms
    ====================================
    `)
    setTimeout(() => process.exit(0), 3000)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
})()