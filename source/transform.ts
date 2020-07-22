/** Something that we can write to. */
type Writable = {
	write(chunk: any): any
	end?(cb?: () => void): void
	close?(): Promise<void> | void
}

/**
 * Transform.
 * This is a helper for our transforms to be able to process the written log data more easily.
 * All the need to do is extend this class and add their own `format` method.
 * @param args forwarded to {@link Logger#setConfig}
 * @example
 * ``` javascript
 * import {inspect} from 'util'
 * import {Logger, Transform} from 'caterpillar'
 * class Pretty extends Transform {
 * 	format (entry) {
 * 		return inspect(entry, {colors: true})
 * 	}
 * }
 * new Logger()
 * 	.pipe(new Pretty())
 * 	.pipe(process.stdout)
 * 	.log('note', 'cool times', 5)
 * ```
 */
export class Transform implements Writable {
	/** Where is this Transform piping to? */
	private pipes: Array<Writable> = []

	/**
	 * Format the current entry representation.
	 * Your transformer should extend this.
	 */
	format(message: any): any {
		return message
	}

	/** Pipe future log entries into a caterpillar transform or a stream. */
	pipe<T extends Writable>(to: T) {
		this.pipes.push(to)
		return to
	}

	/** Maintain a write queue such that multiple Deno writes do not stall */
	private writer = Promise.resolve()

	/** Write to the child pipes. */
	write(chunk: any) {
		// format now, so that we have the correct stack
		const data = this.format(chunk)
		// exclude filtered entries
		if (data == null) return this.writer
		// now delegate back to the pipe
		this.writer = this.writer.then(async () => {
			// pipe to child transforms and streams
			for (const pipe of this.pipes) {
				if (pipe instanceof Transform) {
					// compatibility with caterpillar transforms
					await pipe.write(data)
				} else {
					const str = typeof data === 'string' ? data : JSON.stringify(data)
					if (typeof TextEncoder !== 'undefined') {
						// compatibility with deno and later node streams
						await pipe.write(new TextEncoder().encode(str))
					} else {
						// compatibility with earlier node streams
						await pipe.write(str)
					}
				}
			}
		})
		return this.writer
	}

	/** Close the child pipes. */
	async close(): Promise<void> {
		await Promise.all(
			this.pipes.map((pipe) => {
				if (pipe.close) {
					return pipe.close()
				} else if (pipe.end) {
					return new Promise(function (resolve) {
						pipe.end!(resolve)
					})
				} else {
					return Promise.resolve()
				}
			})
		)
	}

	/* Callback alias for close */
	end(cb?: () => void) {
		const p = this.close()
		if (cb) p.finally(cb)
	}
}
