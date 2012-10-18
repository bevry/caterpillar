# Requires
util = require('util')
try
	cliColor = require('cli-color')
catch err
	cliColor = null

# Formatter
class Formatter
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
		level: 7

	constructor: (config) ->
		# Apply config
		config or= {}
		config[key] ?= value	for own key,value of @config
		@config = config

	getLevel: ->
		@config.level ? null

	setLevel: (level) ->
		@config.level = level
		@

	padLeft: (padding,size,msg) ->
		# Prepare
		padding = String(padding)
		msg = String(msg)

		# Handle
		if msg.length < size
			for i in [0...size-msg.length]
				msg = padding+msg

		# Return
		msg

	padRight: (padding,size,msg) ->
		# Prepare
		padding = String(padding)
		msg = String(msg)

		# Handle
		if msg.length < size
			for i in [0...size-msg.length]
				msg += padding

		# Return
		msg

	details: (levelCode, levelName, args) ->
		# Prepare
		date = @getDate()
		{file,line,method} = @getLineInfo()
		color = @getColor(levelCode)

		# Handle
		parts = []
		for value, index in args
			parts[index] =
				if typeof value is 'string'
					value
				else
					util.inspect value, false, 10
		message = parts.join ' '

		# Return
		{date,file,line,method,color,levelName,message}

	format: (levelCode,levelName,args) ->
		# Prepare
		{date,className,line,levelName,message} = @details levelCode, levelName, args
		# Return
		if @config.level is 7
			# Debug
			message = "[#{date}] [#{className}: #{line}] "+@padLeft(' ', 10, "#{levelName}:")+" #{message}"
		else
			# Normal
			message = @padLeft(' ', 10, "#{levelName}:")+" #{message}"

	getColor: (levelCode) ->
		# Return
		color =
			if @config.colors
				@config.colors[levelCode]
			else
				false

	getDate: ->
		# Prepare
		now      = new Date()
		year     = now.getFullYear()
		month    = @padLeft '0', 2, now.getMonth() + 1
		date     = @padLeft '0', 2, now.getDate()
		hours    = @padLeft '0', 2, now.getHours()
		minutes  = @padLeft '0', 2, now.getMinutes()
		seconds  = @padLeft '0', 2, now.getSeconds()
		ms       = @padLeft '0', 3, now.getMilliseconds()

		# Return
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
				continue  if line.indexOf(__dirname) isnt -1 or line.indexOf(' at ') is -1
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
class ConsoleFormatter extends Formatter
	format: (levelCode,levelName,args) ->
		# Prepare
		{date,file,line,method,color,levelName,message} = @details(levelCode, levelName, args)

		# Check
		if !message
			message
		else
			# Mappings
			color = color and cliColor?[color] or (str) -> str
			levelName = color(levelName+':')

			# Formatters
			debugFormatter = false #cliColor.white
			messageFormatter = color and cliColor?.bold

			# Message
			messageString = "#{levelName} #{message}"
			messageString = messageFormatter(messageString)  if messageFormatter

			#
			if @config.level is 7
				# Debug Information
				seperator = '\n    → '
				debugString = "[#{date}] [#{file}:#{line}] [#{method}]"
				debugString = lineFormatter(debugString)  if debugFormatter

				# Result
				message = "#{messageString}#{seperator}#{debugString}"
			else
				# Result
				message = messageString


# Export
module.exports = {
	cliColor,
	Formatter,
	ConsoleFormatter
}