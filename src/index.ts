/**
 * A tiny invariant utility with custom error class support, lazy messages,
 * and TypeScript type narrowing.
 *
 * @module
 */

/**
 * Error thrown by {@linkcode invariant} when its condition is falsy.
 *
 * Extends the built-in `Error` with `framesToPop = 1` so the `invariant`
 * call site itself is omitted from the stack trace.
 */
export class InvariantError extends Error {
	framesToPop = 1
	override name = "InvariantError"

	constructor(message: string) {
		super(message)
		Object.setPrototypeOf(this, InvariantError.prototype)
	}
}

type ErrorConstructor<E extends Error = Error> = new (message: string) => E
type ConsoleMethodName = "debug" | "log" | "warn" | "error"

/**
 * An assertion function that throws when `condition` is falsy, narrowing its
 * type to truthy when it isn't. Also exposes `debug`, `log`, `warn`, and
 * `error` methods that delegate to the matching `console` methods.
 */
export interface Invariant extends Pick<Console, ConsoleMethodName> {
	(condition: unknown, message?: string | (() => string)): asserts condition
}

/**
 * Creates an {@linkcode Invariant} function that throws `ErrorClass` instead
 * of {@linkcode InvariantError} when its condition is falsy.
 *
 * @example
 * ```ts
 * class HttpError extends Error {
 *   name = "HttpError"
 * }
 *
 * const invariant = createInvariant(HttpError)
 * invariant(response.ok, `Request failed: ${response.status}`)
 * ```
 *
 * @param ErrorClass The error class to construct and throw when the
 * condition is falsy. It must accept a single `message` string.
 * @returns A new {@linkcode Invariant} function bound to `ErrorClass`.
 */
export function createInvariant<E extends Error>(ErrorClass: ErrorConstructor<E>): Invariant {
	function invariant(condition: unknown, message?: string | (() => string)): asserts condition {
		if (condition) return

		const msg = typeof message === "function" ? message() : message
		throw new ErrorClass(msg ?? "Invariant Violation")
	}

	return Object.assign(invariant, {
		debug: (...args: Parameters<Console["debug"]>) => console.debug(...args),
		log: (...args: Parameters<Console["log"]>) => console.log(...args),
		warn: (...args: Parameters<Console["warn"]>) => console.warn(...args),
		error: (...args: Parameters<Console["error"]>) => console.error(...args),
	})
}

/**
 * Asserts that `condition` is truthy, throwing {@linkcode InvariantError}
 * otherwise and narrowing the type of `condition` on success.
 *
 * @example
 * ```ts
 * const user: User | null = getUser()
 * invariant(user, "User not found")
 * console.log(user.name) // user is narrowed to User
 * ```
 */
export const invariant: Invariant = createInvariant(InvariantError)
