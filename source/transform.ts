import { deep } from 'extendr'
import { Transform as _Transform } from 'stream'

interface Configuration {
	[key: string]: any
}

interface ConfigurableStream extends NodeJS.WritableStream {
	setConfig?: (...configs: object[]) => void
}

/**
 * Transform.
 * This is a helper for our transforms to be able to process the written log data more easily.
 * All the need to do is extend this class and add their own `format` method.
 * @param args forwarded to {@link Logger#setConfig}
 * @example
 * class Pretty extends require('caterpillar').Transform {
 * 	format (entry) {
 * 		return require('util').inspect(entry, {colors: true})
 * 	}
 * }
 * require('caterpillar').create()
 * 	.pipe(Pretty.create())
 * 	.pipe(process.stdout)
 * 	.log('note', 'cool times', 5)
 */
export default class Transform extends _Transform {
	constructor(...args: any) {
		super(...args)
		this._config = this.getInitialConfig()
		this.setConfig(...args)
	}

	_config: Configuration

	// ===================================
	// Generic Differences
	// This code is shared but different between Logger and Transform

	/**
	 * Get the initial configuration option.
	 * Use this to add default/initial configuration to your class.
	 * @returns {Configuration}
	 */
	getInitialConfig() {
		return {}
	}

	/**
	 * Alternative way of creating an instance of the class without having to use the `new` keyword.
	 * Useful when creating the class directly from `require` statements.
	 */
	static create(...args: any) {
		return new this(...args)
	}

	// ===================================
	// Generic
	// This code is shared between Logger and Transform

	/**
	 * Get the current configuration object for this instance.
	 */
	getConfig(): Configuration {
		return this._config
	}

	/**
	 * Apply the specified configurations to this instance's configuration via deep merging.
	 * @param configs
	 * @example
	 * setConfig({a: 1}, {b: 2})
	 * getConfig()  // {a: 1, b: 2}
	 */
	setConfig(...configs: Configuration[]) {
		deep(this._config, ...configs)
		this.emit('config', ...configs)
		return this
	}

	/**
	 * Pipe this data to some other writable stream.
	 * If the child stream also has a `setConfig` method, we will ensure the childs configuration is kept consistent with parents.
	 * @param child stream to be piped to
	 * @returns the result of the pipe operation
	 */
	pipe<T extends ConfigurableStream>(child: T): T {
		if (typeof child.setConfig !== 'undefined') {
			child.setConfig(this.getConfig())
			const listener = child.setConfig.bind(child)
			this.on('config', listener)
			child.once('close', () => this.removeListener('config', listener))
		}
		return super.pipe(child)
	}

	// ===================================
	// Transform

	/**
	 * Transform the written buffer into data we can format
	 * @private
	 * @param chunk
	 * @param encoding
	 * @param next
	 */
	_transform(
		chunk: Buffer | string,
		encoding: string,
		next: (error?: Error | null, message?: string) => any
	) {
		let message = chunk.toString()

		try {
			message = this.format(message)
		} catch (err) {
			return next(err)
		}

		if (message && typeof message === 'object') {
			message = JSON.stringify(message)
		}

		return next(null, message)
	}

	/**
	 * Format the written data into whatever we want.
	 * Here is where our transformers work with the written data to enhance it.
	 * By default (without any other transformers at work) this will be a stringified {@link LogEntry}.
	 * @param message
	 */
	format(message: string): any {
		return message
	}
}
