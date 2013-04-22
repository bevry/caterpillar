# Requires
caterpillar = require('../')

# Create
level = if '-d' in process.argv then 7 else 6
logger = new caterpillar.Logger({level})
filter = new caterpillar.Filter()
human  = new caterpillar.Human()
logger.pipe(filter).pipe(human).pipe(process.stdout)

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
logger.log 'this is', (cliColor?.magenta.bold.italic.underline('awesome') or 'awesome')
