# Requires
caterpillar = require "#{__dirname}/../out/lib/caterpillar"

# Create
logger = new caterpillar.Logger()
logger.setLevel(if '-d' in process.argv then 7 else 6)
# level 7 is the debug level, which will output the debug line
# set it to level 6 or higher, to hide debug messages and ignore the debug line

# Logs
for own name,code of logger.config.levels
	logger.log name, "this is #{name} and is level #{code}"

# Standard
logger.log ''
logger.log 'this is awesome'
logger.log 'this','is','awesome'

# Colors
cliColor = caterpillar.cliColor
logger.log ''
logger.log 'this is', cliColor.magenta.bold.italic.underline('awesome')

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