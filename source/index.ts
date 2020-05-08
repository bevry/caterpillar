'use strict'

const Transform = require('./transform')
const Logger = require('./logger')
const create = Logger.create.bind(Logger)
module.exports = { Transform, Logger, create }
