# Import
{expect} = require('chai')
joe = require('joe')
{Transform,Logger} = require('../../')
{PassThrough} = require('readable-stream')

# Prepare
cleanChanging = (item) ->
	item = JSON.parse(item)
	item.date = item.date.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, 'date')
	item.file = item.file.replace(/^[\/\\].+$/, 'file')
	item.line = item.file.replace(/^\d{1,}$/, 'line')
	item.method = item.method.replace(/^[\d\w\.\_\-\<\>]+$/, 'method')
	return item

# Test
joe.describe 'caterpillar', (describe,it) ->

	describe 'transform', (describe,it) ->
		transform = null

		it 'should instantiate correctly', ->
			transform = new Transform()

		it 'get config should work', ->
			expect(transform.getConfig()).to.eql(transform.config)

		it 'should set configuration correctly', ->
			transform.setConfig(level:5)
			expect(transform.getConfig().level).to.eql(5)

		it 'should set configuration correctly via constructor', ->
			transform = new Transform(level:4)
			expect(transform.getConfig().level).to.eql(4)

		it 'should pass configuration to the child via constructor', ->
			transform = new Transform(level:3)
			transform2 = new Transform()
			transform.pipe(transform2)
			expect(transform2.getConfig().level).to.eql(3)

		it 'should pass configuration to the child via set config after the fact', ->
			transform = new Transform()
			transform2 = new Transform()
			transform.pipe(transform2)
			transform.setConfig(level:2)
			expect(transform2.getConfig().level).to.eql(2)


	describe 'logging', (describe,it) ->
		logger = new Logger()
		output = new PassThrough()
		actual = []
		expected =
			[ '{"date":"2013-05-07T11:12:43.982Z","args":["this is emergency and is level 0"],"levelNumber":0,"levelName":"emergency","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.986Z","args":["this is alert and is level 1"],"levelNumber":1,"levelName":"alert","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is critical and is level 2"],"levelNumber":2,"levelName":"critical","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is error and is level 3"],"levelNumber":3,"levelName":"error","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is warning and is level 4"],"levelNumber":4,"levelName":"warning","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is notice and is level 5"],"levelNumber":5,"levelName":"notice","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.989Z","args":["this is info and is level 6"],"levelNumber":6,"levelName":"info","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.990Z","args":["this is debug and is level 7"],"levelNumber":7,"levelName":"debug","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is emerg and is level 0"],"levelNumber":0,"levelName":"emergency","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is crit and is level 2"],"levelNumber":2,"levelName":"critical","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is err and is level 3"],"levelNumber":3,"levelName":"error","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is warn and is level 4"],"levelNumber":4,"levelName":"warning","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is note and is level 5"],"levelNumber":5,"levelName":"notice","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.993Z","args":["this is default and is level 6"],"levelNumber":6,"levelName":"info","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.995Z","args":["this is unknown and is level 6"],"levelNumber":6,"levelName":"info","line":"91","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}' ]

		# Clean
		expected = expected.map(cleanChanging)

		output.on 'data', (chunk) ->
			actual.push chunk.toString()

		it 'should pipe correctly', ->
			logger.pipe(output)

		it 'should log messages', ->
			for own name,code of Logger::config.levels
				message = "this is #{name} and is level #{code}"
				logger.log(name, message)
			logger.log('this is unknown and is level 6')

		it 'should provide the expected output', (done) ->
			output.on 'end', ->
				actual = actual.map(cleanChanging)
				expect(actual.length, 'lengths').to.equal(expected.length)
				for result,index in actual
					expect(result, 'results').to.deep.equal(expected[index])
				done()
			logger.end()
