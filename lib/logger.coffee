# Requires
{Transport,ConsoleTransport} = require("#{__dirname}/transport.coffee")

# Logger
class Logger
	config:
		autoFlush: true # (true or false) whether or not to auto flush after each message
		transports: null # (Transport, object, array or false)
		level: 7
		levels:
			emergency: 0
			alert: 1
			critical: 2
			error: 3
			warning: 4
			notice: 5
			info: 6
			debug: 7

			emerg: 0
			crit: 2
			err: 3
			warn: 4
			note: 5

			default: 6
		
	messages: []
	formatter: null
	transports: []

	constructor: (config) ->
		# Prepare
		@messages = []
		@transports = []
		
		# Apply config
		config or= {}
		config[key] ?= value	for own key,value of @config

		# Apply levels
		levels = {}
		levels[key] ?= value	for own key,value of config.levels
		config.levels = levels

		# Apply transports
		unless config.transports
			config.transports = new ConsoleTransport
		unless config.transports instanceof Array
			config.transports = [config.transports]
		for transport in config.transports
			if transport instanceof Transport
				@transports.push transport
			else if transport
				@transports.push new ConsoleTransport transport
		delete config.transports

		# Level
		@setLevel(config.level)  if config.level

		# Apply config
		@config = config

	getLevel: ->
		@config.level ? null
	
	setLevel: (level) ->
		# Apply
		@config.level = level
		for transport in @transports
			transport.setLevel(level)
		
		# Chain
		@
	
	getLevelCode: (name) ->
		# Return
		@config.levels[name] ? null
	
	getLevelName: (code) ->
		# Try to treturn the levelName
		for own key,value of @config.levels
			if value is code
				return key
		
		# else return
		null

	log: (level, args...) ->
		# Log the entry
		if typeof level is 'number'
			levelCode = level
			levelName = @getLevelName levelCode
		else
			levelName = level
			levelCode = @getLevelCode levelName
			levelName = @getLevelName levelCode
			unless levelCode?
				levelCode = @getLevelCode 'default'
				levelName = @getLevelName levelCode
				args.unshift(level)
		
		# Write the entry?
		if @config.autoFlush
			@write levelCode,levelName,args
		else
			@messages.push {levelCode,levelName,args}
		
		# Chain
		@
	
	flush: ->
		# Write messages
		for {levelCode,levelName,args} in @messages
			@write levelCode,levelName,args

		# Chain
		@
	
	write: (levelCode,levelName,args) ->
		# Write the message
		for transport in @transports
			transport.write levelCode,levelName,args
		
		# Chain
		@


# Export
module.exports = {
	Logger
}