// this cannot be located at source/brower.ts as otherwise it would become the browser entry

// Imports
import { Transform } from '../transform.js'

/** Mapping of ANSI color codes into a CSS style */
export interface Styles {
	[key: string]: {
		/** The ANSI color code used to start the style */
		start: string
		/** The ANSI color code used to end the style */
		end: string
		/** The CSS style value */
		value: string
	}
}

/** Configuration optons for the Caterpillar Browser Transform */
export interface BrowserOptions {
	/** Use to override the default value of {@link Filter.color} */
	color?: boolean
	/** Use to override the default value of {@link Filter.console} */
	output?: boolean
	/** Use to override the default value of {@link Filter.styles} */
	styles?: Styles
}

/**
 * Convert human readable Caterpillar entries into browser compatible entries.
 * @example
 * ``` javascript
 * import { Logger, Human, Browser } from 'caterpillar'
 * const logger = new Logger()
 * logger.pipe(new Human()).pipe(new Browser())
 * logger.log('info', 'some', {data: 'oh yeah'}, 42)
 * ```
 */
export class Browser extends Transform {
	/** Whether or not we should use color. */
	public color: boolean = true

	/** Whether or not we should write to the browser console. */
	public output: boolean = true

	/** The objects that tell our browser transform how to convert terminal colours into console colours. */
	public styles: Styles = {
		red: {
			start: '31',
			end: '39',
			value: 'color:red',
		},
		yellow: {
			start: '33',
			end: '39',
			value: 'color:orange',
		},
		green: {
			start: '32',
			end: '39',
			value: 'color:green',
		},
		bright: {
			start: '1',
			end: '22',
			value: 'font-weight:bold',
		},
		dim: {
			start: '2',
			end: '22',
			value: 'color:lightGray',
		},
		italic: {
			start: '3',
			end: '23',
			value: 'font-style:italic',
		},
		underline: {
			start: '4',
			end: '24',
			value: 'text-decoration:underline',
		},
	}

	/** Create our instance and apply our configuraiton options. */
	constructor(opts?: BrowserOptions) {
		super()

		// options
		if (opts?.color != null) this.color = opts.color
		if (opts?.output != null) this.output = opts.output
		if (opts?.styles != null) this.styles = opts.styles
	}

	/**
	 * Convert a human readable Caterpillar entry into a format that browser consoles can understand.
	 * And if the `write` config property is `true` (it is by default), write the result to the browser console.
	 */
	format(message: string): string[] {
		// Prepare
		const { color, styles, output } = this

		// Replace caterpillar-human formatted entry
		/* eslint no-control-regex:0 */
		const args: string[] = []
		const result = message.replace(
			/\u001b\[([0-9]+)m(.+?)\u001b\[([0-9]+)m/g,
			function (match, start, content, end) {
				// Check
				if (color === false) return content

				// Prepare
				let matchedStyle, style

				// Find the matcing style for this combination
				for (const key in styles) {
					if (styles.hasOwnProperty(key)) {
						style = styles[key]
						if (
							String(style.start) === String(start) &&
							String(style.end) === String(end)
						) {
							matchedStyle = style
							break
						}
					}
				}

				// Check
				if (!matchedStyle) return content

				// Push the style
				args.push(matchedStyle.value)
				args.push(content)
				args.push('color:default; font:default; text-decoration:default')
				return '%c%s%c'
			}
		)

		// Final format
		const parts = [result.trim()].concat(args)

		// Write
		/* eslint no-console:0 */
		if (output) console.log(...parts)

		// Return
		return parts
	}
}

export default Browser
