# Requires
colors = require 'cli-color'
util = require 'util'

# Formatter
Formatter = class
	config:
		colors:
			0: 'red'
			1: 'red'
			2: 'red'
			3: 'red'
			4: 'yellow'
			5: 'yellow'
			6: 'green'
			7: 'green'

	constructor: (config) ->
		# Apply config
		config or= {}
		config[key] ?= value	for own key,value of @config
		@config = config

	padLeft: (padding,size,msg) ->
		padding = String(padding)
		msg = String(msg)
		if msg.length < size
			for i in [0...size-msg.length]
				msg = padding+msg
		msg

	padRight: (padding,size,msg) ->
		padding = String(padding)
		msg = String(msg)
		if msg.length < size
			for i in [0...size-msg.length]
				msg += padding
		msg

	details: (levelCode, levelName, args) ->
		date = @getDate()
		{file,line,method} = @getLineInfo()
		color = @getColor(levelCode)

		parts = []
		for value, index in args
			parts[index] =
				if typeof value is 'string'
					value
				else
					util.inspect value, false, 10
		message = parts.join ' '

		{date,file,line,method,color,levelName,message}

	format: (levelCode,levelName,args) ->
		{date,className,line,levelName,message} = @details levelCode, levelName, args
		message = "[#{date}] [#{className}: #{line}] "+@padLeft(' ', 10, "#{levelName}:")+" #{message}"

	getColor: (levelCode) ->
		color =
			if @config.colors
				@config.colors[levelCode]
			else
				false
	
	getDate: ->
		now      = new Date()
		year     = now.getFullYear()
		month    = @padLeft '0', 2, now.getMonth() + 1
		date     = @padLeft '0', 2, now.getDate()
		hours    = @padLeft '0', 2, now.getHours()
		minutes  = @padLeft '0', 2, now.getMinutes()
		seconds  = @padLeft '0', 2, now.getSeconds()
		ms       = @padLeft '0', 3, now.getMilliseconds()
		"#{year}-#{month}-#{date} #{hours}:#{minutes}:#{seconds}.#{ms}"
	
	getLineInfo: ->
		# Prepare
		result =
			line: -1
			method: 'unknown'

		# Retrieve
		try
			throw new Error()
		catch e
			lines = e.stack.split('\n')
			for line in lines
				continue  if line.indexOf('caterpillar.coffee') isnt -1 or line.indexOf(' at ') is -1
				parts = line.split(':')
				if parts[0].indexOf('(') is -1
					result.method = 'unknown'
					result.file = parts[0].replace(/^.+?\s+at\s+/, '')
				else
					result.method = parts[0].replace(/^.+?\s+at\s+/, '').replace(/\s+\(.+$/, '')
					result.file = parts[0].replace(/^.+?\(/, '')
				result.line = parts[1]
				break
		return result

# Console Formatter
ConsoleFormatter = class extends Formatter
	format: (levelCode,levelName,args) ->
		{date,file,line,method,color,levelName,message} = @details levelCode, levelName, args
		if !message 
			message
		else
			color = color and colors[color] or (str) -> str
			levelName = color(levelName+':')

			lineFormatter = false #colors.white
			messageFormatter = colors.bold

			seperator = '\n    → '
			lineString = "[#{date}] [#{file}:#{line}] [#{method}]"
			messageString = "#{levelName} #{message}"
			lineString = lineFormatter(lineString)  if lineFormatter
			messageString = messageFormatter(messageString)  if messageFormatter


			message = "#{messageString}#{seperator}#{lineString}"

# Logger
Logger = class

	config:
		autoFlush: true # (true or false) whether or not to auto flush after each message
		transports: null # (Transport, object, array or false)
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

		# Apply config
		@config = config
	
	getLevelCode: (name) ->
		@config.levels[name] ? null
	
	getLevelName: (code) ->
		for own key,value of @config.levels
			if value is code
				return key
		null

	log: (level, args...) ->
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
		
		if @config.autoFlush
			@write levelCode,levelName,args
		else
			@messages.push {levelCode,levelName,args}
	
	flush: ->
		for {levelCode,levelName,args} in @messages
			@write levelCode,levelName,args
	
	write: (levelCode,levelName,args) ->
		for transport in @transports
			transport.write levelCode,levelName,args

# Transport
Transport = class
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

	care: (levelCode) ->
		levelCode <= @config.level

	write: (levelCode,levelName,message) ->
		if @care levelCode
			message = @formatter.format levelCode,levelName,message
		else
			null

# Console Transport
ConsoleTransport = class extends Transport
	write: (levelCode,levelName,message) ->
		message = super levelCode,levelName,message
		if message?
			console.log message

# Export
module.exports = {colors,Formatter,Logger,Transport,ConsoleTransport}