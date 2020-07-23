/**
 * Caterpillar supports piping to anything that supports this interface.
 * Which includes:
 * - {@link Transform Caterpillar Transforms}
 * - [Deno Writer Streams](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.Writer), e.g.
 * 	- [Deno.stdout](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.stdout)
 * - [Node.js Writable Streams](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_writable_streams), e.g.
 * 	- [process.stdout](https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_stdout)
 * 	- [fs.createWriteStream](https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_createwritestream_path_options)
 * - [WhatWG Writable Streams](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
 */
export interface Pipeable {
	write(chunk: any): any
	end?(cb?: () => void): void
	close?(): Promise<void> | void
}

/**
 * Caterpillar Transform Class.
 * Provides the methods needed to provide a pipable Caterpillar Transform.
 * Such that all you need to do is write your {@link Transform.format} method.
 * It can pipe to anything that provides a {@link Pipeable.write} method.
 * @example [Writing a Custom Transform](https://repl.it/@balupton/caterpillar-custom-transform)
 */
export class Transform implements Pipeable {
	/** Where is this Transform piping to? */
	private pipes: Array<Pipeable> = []

	/**
	 * Format the received log entry representation.
	 * Your transformer should extend this.
	 */
	format(message: any): any {
		return message
	}

	/** Pipe future log entries into a caterpillar transform or a stream. */
	pipe<T extends Pipeable>(to: T) {
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
