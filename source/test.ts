import { Logger, Filter, Human, Browser, LogEntry } from './index.js'
import { PassThrough } from 'stream'
import { suite } from 'kava'
import { equal, deepEqual } from 'assert-helpers'
import { ok } from 'assert'

// Prepare
function cleanChangingLogger(item: any) {
	item = JSON.parse(item)
	item.date = item.date.replace(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
		'date'
	)
	try {
		if (item.file.includes('test.js') === false)
			ok(false, 'file info was not as expected')
		if (item.method.includes('testCaller') === false)
			ok(false, 'method info was not as expected')
		if (item.line === -1) ok(false, 'line info was not found')
		if (item.char === -1) ok(false, 'char info was not found')
	} catch (err) {
		console.error(item)
		throw err
	}
	item.file = 'file'
	item.line = 'line'
	item.char = 'char'
	item.method = 'method'
	return item
}
function cleanChangingHuman(item: string) {
	item = item
		.replace(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}Z\]/, 'date')
		.replace(/\[.+?:\d+:\d+\]/, 'file:line:char')
		.replace(/\[.+?\]/, 'method')
	return item
}

// Test
suite('caterpillar', function (suite) {
	suite('logger', function (suite, test) {
		const logger = new Logger({ lineLevel: 7 })
		const output = new PassThrough()
		const actual: string[] = []
		const expected: string[] = [
			'{"date":"2013-05-07T11:12:43.982Z","args":["this is emergency and is level 0"],"levelNumber":0,"levelName":"emergency","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.986Z","args":["this is alert and is level 1"],"levelNumber":1,"levelName":"alert","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is critical and is level 2"],"levelNumber":2,"levelName":"critical","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is error and is level 3"],"levelNumber":3,"levelName":"error","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is warning and is level 4"],"levelNumber":4,"levelName":"warning","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is notice and is level 5"],"levelNumber":5,"levelName":"notice","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.989Z","args":["this is info and is level 6"],"levelNumber":6,"levelName":"info","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.990Z","args":["this is debug and is level 7"],"levelNumber":7,"levelName":"debug","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is emerg and is level 0"],"levelNumber":0,"levelName":"emergency","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is crit and is level 2"],"levelNumber":2,"levelName":"critical","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is err and is level 3"],"levelNumber":3,"levelName":"error","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is warn and is level 4"],"levelNumber":4,"levelName":"warning","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is note and is level 5"],"levelNumber":5,"levelName":"notice","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
			'{"date":"2013-05-07T11:12:43.995Z","args":["this is unknown and is level 6"],"levelNumber":6,"levelName":"info","line":"1","char":"20","method":"testCaller","file":"my/test.js"}',
		]

		output.on('data', function (chunk) {
			actual.push(chunk.toString())
		})

		test('should pipe correctly', function () {
			logger.pipe(output)
		})

		test('should log messages', function testCaller() {
			const levels = logger.levels
			for (const name in levels) {
				if (levels.hasOwnProperty(name)) {
					const number = levels[name]
					const message = `this is ${name} and is level ${number}`
					logger.log(name, message)
				}
			}
			logger.log('this is unknown and is level 6')
		})

		test('should provide the expected output', function (done) {
			output.on('end', function () {
				const actualCleaned = actual.map(cleanChangingLogger)
				const expectedCleaned = expected.map(cleanChangingLogger)
				console.dir(actualCleaned)
				console.dir(expectedCleaned)
				equal(actualCleaned.length, expectedCleaned.length, 'lengths')
				actualCleaned.forEach(function (result, index) {
					deepEqual(result, expectedCleaned[index], 'results')
				})
				done()
			})
			logger.end()
		})
	})

	suite('filter', function (suite, test) {
		const logger = new Logger()
		const filter = new Filter({ filterLevel: 5 })
		const output = new PassThrough()
		const result: LogEntry[] = []

		output.on('data', function (chunk) {
			result.push(JSON.parse(chunk.toString()))
		})

		test('should pipe correctly', function () {
			logger.pipe(filter).pipe(output)
		})

		test('should log messages', function testCaller() {
			logger.log(5, 'first')
			logger.log(6, 'second') // this one should be excluded
			logger.log(5, 'third')
		})

		test('should provide the expected output', function (done) {
			output.on('end', function () {
				equal(result.length, 2, 'length')
				equal(result[0].args[0], 'first')
				equal(result[1].args[0], 'third')
				done()
			})
			logger.end()
		})
	})

	suite('human', function (suite) {
		suite('instantiation', function (suite, test) {
			test('should instantiate correctly', function () {
				const human = new Human()
				equal(human.color, true, 'default color was applied correctly')
			})
			test('should instantiate correctly, with config', function () {
				const human = new Human({ color: false })
				equal(human.color, false, 'custom color was applied correctly')
			})
		})

		function addSuite(
			name: string,
			config: { color?: boolean; lineLevel?: number },
			expected: string[],
			cleaner?: typeof cleanChangingHuman
		) {
			suite(name, function (suite, test) {
				const logger = new Logger(config)
				const human = new Human(config)
				const output = new PassThrough()
				let actual: string[] = []
				if (cleaner) expected = expected.map(cleaner)

				output.on('data', function (chunk) {
					actual.push(chunk.toString())
				})

				test('should pipe correctly', function () {
					logger.pipe(human).pipe(output)
				})

				test('should log messages', function () {
					const levels = logger.levels
					Object.keys(levels).forEach(function testCaller(name) {
						const code = levels[name]
						const message = `this is ${name} and is level ${code}`
						logger.log(name, message)
					})
				})

				test('should provide the expected output', function (done) {
					output.on('end', function () {
						if (cleaner) actual = actual.map(cleaner)
						equal(actual.length, expected.length, 'length was expected')
						actual.forEach(function (result, index) {
							equal(result, expected[index], 'result was expected')
						})
						done()
					})
					logger.end()
				})
			})
		}

		addSuite('logging without colors', { color: false }, [
			'emergency: this is emergency and is level 0\n',
			'alert: this is alert and is level 1\n',
			'critical: this is critical and is level 2\n',
			'error: this is error and is level 3\n',
			'warning: this is warning and is level 4\n',
			'notice: this is notice and is level 5\n',
			'info: this is info and is level 6\n',
			'debug: this is debug and is level 7\n',
			'emergency: this is emerg and is level 0\n',
			'critical: this is crit and is level 2\n',
			'error: this is err and is level 3\n',
			'warning: this is warn and is level 4\n',
			'notice: this is note and is level 5\n',
		])

		addSuite('logging with colors', {}, [
			'\u001b[31memergency:\u001b[39m this is emergency and is level 0\n',
			'\u001b[31malert:\u001b[39m this is alert and is level 1\n',
			'\u001b[31mcritical:\u001b[39m this is critical and is level 2\n',
			'\u001b[31merror:\u001b[39m this is error and is level 3\n',
			'\u001b[33mwarning:\u001b[39m this is warning and is level 4\n',
			'\u001b[33mnotice:\u001b[39m this is notice and is level 5\n',
			'\u001b[32minfo:\u001b[39m this is info and is level 6\n',
			'\u001b[32mdebug:\u001b[39m this is debug and is level 7\n',
			'\u001b[31memergency:\u001b[39m this is emerg and is level 0\n',
			'\u001b[31mcritical:\u001b[39m this is crit and is level 2\n',
			'\u001b[31merror:\u001b[39m this is err and is level 3\n',
			'\u001b[33mwarning:\u001b[39m this is warn and is level 4\n',
			'\u001b[33mnotice:\u001b[39m this is note and is level 5\n',
		])

		addSuite(
			'logging with colors',
			{ lineLevel: 7 },
			[
				'\u001b[31memergency:\u001b[39m this is emergency and is level 0\n    \u001b[2m→ [2013-05-06 20:39:46.119] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31malert:\u001b[39m this is alert and is level 1\n    \u001b[2m→ [2013-05-06 20:39:46.120] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31mcritical:\u001b[39m this is critical and is level 2\n    \u001b[2m→ [2013-05-06 20:39:46.120] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31merror:\u001b[39m this is error and is level 3\n    \u001b[2m→ [2013-05-06 20:39:46.121] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[33mwarning:\u001b[39m this is warning and is level 4\n    \u001b[2m→ [2013-05-06 20:39:46.121] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[33mnotice:\u001b[39m this is notice and is level 5\n    \u001b[2m→ [2013-05-06 20:39:46.122] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[32minfo:\u001b[39m this is info and is level 6\n    \u001b[2m→ [2013-05-06 20:39:46.122] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[32mdebug:\u001b[39m this is debug and is level 7\n    \u001b[2m→ [2013-05-06 20:39:46.123] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31memergency:\u001b[39m this is emerg and is level 0\n    \u001b[2m→ [2013-05-06 20:39:46.123] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31mcritical:\u001b[39m this is crit and is level 2\n    \u001b[2m→ [2013-05-06 20:39:46.124] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[31merror:\u001b[39m this is err and is level 3\n    \u001b[2m→ [2013-05-06 20:39:46.124] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[33mwarning:\u001b[39m this is warn and is level 4\n    \u001b[2m→ [2013-05-06 20:39:46.125] [my/test.js:1:20] [testCaller]\u001b[22m\n',
				'\u001b[33mnotice:\u001b[39m this is note and is level 5\n    \u001b[2m→ [2013-05-06 20:39:46.126] [my/test.js:1:20] [testCaller]\u001b[22m\n',
			],
			cleanChangingHuman
		)
	})

	// Test
	suite('human', function (suite) {
		suite('instantiation', function (suite, test) {
			test('should instantiate correctly', function () {
				const browser = new Browser()
				equal(browser.color, true, 'default color was applied correctly')
			})

			test('should instantiate correctly, with config', function () {
				const browser = new Browser({ color: false })
				equal(browser.color, false, 'custom color was applied correctly')
			})
		})

		function addSuite(
			name: string,
			config: { color?: boolean; lineLevel?: number },
			expected: string[],
			cleaner?: typeof cleanChangingHuman
		) {
			suite(name, function (suite, test) {
				const logger = new Logger(config)
				const human = new Human(config)
				const browser = new Browser(config)
				const output = new PassThrough()
				let actual: string[] = []
				if (cleaner) expected = expected.map(cleaner)

				output.on('data', function (chunk) {
					actual.push(chunk.toString())
				})

				test('should pipe correctly', function () {
					logger.pipe(human).pipe(browser).pipe(output)
				})

				test('should log messages', function () {
					const levels = logger.levels
					Object.keys(levels).forEach(function testCaller(name) {
						const code = levels[name]
						const message = `this is ${name} and is level ${code}`
						logger.log(name, message)
					})
				})

				test('should provide the expected output', function (done) {
					output.on('end', function () {
						if (cleaner) actual = actual.map(cleaner)
						equal(actual.length, expected.length, 'length was expected')
						actual.forEach(function (result, index) {
							equal(result, expected[index], 'result was expected')
						})
						done()
					})
					logger.end()
				})
			})
		}

		addSuite(
			'logging without colors in debug mode',
			{ color: false, lineLevel: 7 },
			[
				'["emergency: this is emergency and is level 0\\n    → [2013-05-06 20:41:13.973] [my/test.js:1:20] [testCaller]"]',
				'["alert: this is alert and is level 1\\n    → [2013-05-06 20:41:13.978] [my/test.js:1:20] [testCaller]"]',
				'["critical: this is critical and is level 2\\n    → [2013-05-06 20:41:13.978] [my/test.js:1:20] [testCaller]"]',
				'["error: this is error and is level 3\\n    → [2013-05-06 20:41:13.979] [my/test.js:1:20] [testCaller]"]',
				'["warning: this is warning and is level 4\\n    → [2013-05-06 20:41:13.979] [my/test.js:1:20] [testCaller]"]',
				'["notice: this is notice and is level 5\\n    → [2013-05-06 20:41:13.980] [my/test.js:1:20] [testCaller]"]',
				'["info: this is info and is level 6\\n    → [2013-05-06 20:41:13.980] [my/test.js:1:20] [testCaller]"]',
				'["debug: this is debug and is level 7\\n    → [2013-05-06 20:41:13.981] [my/test.js:1:20] [testCaller]"]',
				'["emergency: this is emerg and is level 0\\n    → [2013-05-06 20:41:13.982] [my/test.js:1:20] [testCaller]"]',
				'["critical: this is crit and is level 2\\n    → [2013-05-06 20:41:13.982] [my/test.js:1:20] [testCaller]"]',
				'["error: this is err and is level 3\\n    → [2013-05-06 20:41:13.982] [my/test.js:1:20] [testCaller]"]',
				'["warning: this is warn and is level 4\\n    → [2013-05-06 20:41:13.983] [my/test.js:1:20] [testCaller]"]',
				'["notice: this is note and is level 5\\n    → [2013-05-06 20:41:13.983] [my/test.js:1:20] [testCaller]"]',
			],
			cleanChangingHuman
		)

		addSuite(
			'logging with colors in debug mode',
			{ lineLevel: 7 },
			[
				'["%c%s%c this is emergency and is level 0\\n    %c%s%c","color:red","emergency:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.550] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is alert and is level 1\\n    %c%s%c","color:red","alert:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.551] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is critical and is level 2\\n    %c%s%c","color:red","critical:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.551] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is error and is level 3\\n    %c%s%c","color:red","error:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.552] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is warning and is level 4\\n    %c%s%c","color:orange","warning:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.552] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is notice and is level 5\\n    %c%s%c","color:orange","notice:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.553] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is info and is level 6\\n    %c%s%c","color:green","info:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.553] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is debug and is level 7\\n    %c%s%c","color:green","debug:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.554] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is emerg and is level 0\\n    %c%s%c","color:red","emergency:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.554] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is crit and is level 2\\n    %c%s%c","color:red","critical:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.555] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is err and is level 3\\n    %c%s%c","color:red","error:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.555] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is warn and is level 4\\n    %c%s%c","color:orange","warning:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.556] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
				'["%c%s%c this is note and is level 5\\n    %c%s%c","color:orange","notice:","color:default; font:default; text-decoration:default","color:lightGray","→ [2013-05-06 21:17:14.556] [my/test.js:1:20] [testCaller]","color:default; font:default; text-decoration:default"]',
			],
			cleanChangingHuman
		)
	})
})
