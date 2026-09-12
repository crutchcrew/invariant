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

export interface Invariant extends Pick<Console, ConsoleMethodName> {
	(condition: unknown, message?: string | (() => string)): asserts condition
}

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

export const invariant: Invariant = createInvariant(InvariantError)
