'use strict'

const FILEPATH = __dirname + '/../../data/airports.txt'
const DB_URI = `mongodb://mongo:${process.env.DB_PORT || 27017}/airports`

const model = require('./airport')
const fs = require('fs')
const { compose } = require('highland')
const Mongo = require('mongodb')

module.exports = {

  init() {
    return new Promise((resolve, reject) => {

      Mongo.MongoClient.connect(DB_URI, (err, db) => {
        if(err) {
          return reject(err)
        }

        model.indexize(db)
        .then(() => {
          console.log('Indexes creation completed')
          resolve(db)
        })
        .catch(err => {
          return reject(err)
        })
      })
    })
  },

  async parseFile(db) {
    const f = compose(model.parse, fs.readFileSync)
    return await Promise.all(f(FILEPATH, 'utf8').map(x => model.save(db, x)))
  }
}