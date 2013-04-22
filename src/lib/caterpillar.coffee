# Import
extendr = require('extendr')

# Export
module.exports = extendr.extend({}, require('./logger'), require('./formatter'))