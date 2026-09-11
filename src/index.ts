const {
	setPrototypeOf = function (obj: any, proto: any) {
		obj.__proto__ = proto
		return obj
	},
} = Object as any

export class InvariantError extends Error {
	framesToPop = 1
	override name = "InvariantError"

	constructor(message: string) {
		super(message)
		setPrototypeOf(this, InvariantError.prototype)
	}
}

type ErrorConstructor<E extends Error = Error> = new (message: string) => E
type ConsoleMethodName = "debug" | "log" | "warn" | "error"

export interface Invariant extends Pick<Console, ConsoleMethodName> {
	(condition: any, message?: string | (() => string)): asserts condition
}

export function createInvariant<E extends Error>(ErrorClass: ErrorConstructor<E>): Invariant {
	function invariant(condition: any, message?: string | (() => string)): asserts condition {
		if (condition) return

		const msg = typeof message === "function" ? message() : message
		throw new ErrorClass(msg ?? "Invariant Violation")
	}

	return Object.assign(invariant, {
		debug: wrapConsoleMethod("debug"),
		log: wrapConsoleMethod("log"),
		warn: wrapConsoleMethod("warn"),
		error: wrapConsoleMethod("error"),
	})
}

function wrapConsoleMethod<M extends ConsoleMethodName>(name: M) {
	return function () {
		return console[name].apply(console, arguments as any)
	} as (typeof console)[M]
}

export const invariant: Invariant = createInvariant(InvariantError)
