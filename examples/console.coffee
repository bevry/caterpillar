# Requires
catepillar = require "#{__dirname}/../lib/caterpillar.coffee"

# Create
logger = new catepillar.Logger
	transports:
		level: 7
		formatter:
			module: module

# Logs
for own name,code of logger.config.levels
	logger.log name, "this is #{name}"

# Standard
logger.log 'this is awesome'

# Grouping
logger.config.autoFlush = false
logger.log ''
logger.log 'one'
logger.log 'two'
logger.log 'three'
setTimeout(
	-> logger.flush()
	3000
)