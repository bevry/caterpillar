# Import
extendr = require('extendr')
stream = require('stream')
util = require('util')
try
	cliColor = require('cli-color')
catch err
	cliColor = null

# Human
class Human extends stream.Transform
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

	constructor: (opts) ->
		@setConfig(opts)
		super

	pipe: (child) ->
		if child.setConfig?(@config) then @on('config', child.setConfig)
		super

	setConfig: (opts) =>
		@config = extendr.deepExtend({}, @config, opts)
		@

	getConfig: -> @config

	_transform: (chunk, encoding, next) =>
		entry = JSON.parse(chunk.toString())
		message = @format(entry)
		return next(null, message)

	getColor: (levelCode) ->
		# Determine
		color =
			if @config.colors
				@config.colors[levelCode]
			else
				false

		# Return
		return color

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

	formatArguments: (args) ->
		# Handle
		parts = []
		for value,index in args
			parts[index] =
				if typeof value is 'string'
					value
				else
					util.inspect value, false, 10
		text = parts.join(' ')

		# Return
		return text

	formatDate: (now) ->
		# Prepare
		now      = new Date(now)
		year     = now.getFullYear()
		month    = @padLeft('0', 2, now.getMonth() + 1)
		date     = @padLeft('0', 2, now.getDate())
		hours    = @padLeft('0', 2, now.getHours())
		minutes  = @padLeft('0', 2, now.getMinutes())
		seconds  = @padLeft('0', 2, now.getSeconds())
		ms       = @padLeft('0', 3, now.getMilliseconds())

		# Apply
		result = "#{year}-#{month}-#{date} #{hours}:#{minutes}:#{seconds}.#{ms}"

		# Return
		return result

	format: (entry) =>
		# Prepare
		entry.color = @getColor(entry.levelCode)
		entry.timestamp = @formatDate(entry.date)
		entry.text = @formatArguments(entry.args)
		result = null

		# Check
		if entry.text
			# Formatters
			colorFormatter = entry.color and cliColor?[entry.color] or (str) -> str
			debugFormatter = false #cliColor.white
			messageFormatter = colorFormatter and cliColor?.bold

			# Message
			levelName = colorFormatter(entry.levelName+':')
			messageString = "#{levelName} #{entry.text}"
			messageString = messageFormatter(messageString)  if messageFormatter

			# Level
			if @config.level is 7
				# Debug Information
				seperator = '\n    → '
				debugString = "[#{entry.timestamp}] [#{entry.file}:#{entry.line}] [#{entry.method}]"
				debugString = lineFormatter(debugString)  if debugFormatter

				# Result
				result = "#{messageString}#{seperator}#{debugString}\n"
			else
				# Result
				result = messageString+'\n'

		# Return
		return result

# Filter
class Filter extends stream.Transform
	config:
		level: 6

	constructor: (opts) ->
		@setConfig(opts)
		super

	pipe: (child) ->
		if child.setConfig?(@config) then @on('config', child.setConfig)
		super

	setConfig: (opts) =>
		@config = extendr.deepExtend({}, @config, opts)
		@

	getConfig: -> @config

	_transform: (chunk, encoding, next) =>
		entry = JSON.parse(chunk.toString())
		message = @format(entry)
		message = JSON.stringify(message)  if message
		return next(null, message)

	format: (entry) ->
		return null  if entry.levelCode > @config.level
		return entry

# Export
module.exports = {
	cliColor
	Human
	Filter
}