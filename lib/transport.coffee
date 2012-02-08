# Requires
{Formatter,ConsoleFormatter} = require("#{__dirname}/formatter.coffee")

# Transport
class Transport
	config:
		level: 7
		formatter: null # (Formatter, object or false)
	
	constructor: (config) ->
		# Apply config
		config or= {}
		config[key] ?= value	for own key,value of @config
		
		# Apply formater
		if config.formatter instanceof Formatter
			@formatter = config.formatter
		else
			@formatter = new ConsoleFormatter config.formatter
		delete config.formatter

		# Apply config
		@config = config

	getLevel: ->
		@config.level ? null
	
	setLevel: (level) ->
		# Apply
		@config.level = level
		@formatter.setLevel(level)  if @formatter
		
		# Chain
		@
	
	care: (levelCode) ->
		levelCode <= @config.level

	write: (levelCode,levelName,message) ->
		if @care levelCode
			message = @formatter.format levelCode,levelName,message
		else
			null

# Console Transport
class ConsoleTransport extends Transport
	write: (levelCode,levelName,message) ->
		message = super levelCode,levelName,message
		if message?
			console.log message

# Export
module.exports = {
	Transport,
	ConsoleTransport
}