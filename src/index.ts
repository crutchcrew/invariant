const genericMessage = "Invariant Violation"

const {
	setPrototypeOf = function (obj: any, proto: any) {
		obj.__proto__ = proto
		return obj
	},
} = Object as any

export class InvariantError extends Error {
	framesToPop = 1
	name = genericMessage

	constructor(message?: string) {
		super(message ?? genericMessage)
		setPrototypeOf(this, InvariantError.prototype)
	}
}

type ErrorConstructor<E extends Error = Error> = new (message?: string) => E

export function createInvariant<E extends Error>(ErrorClass: ErrorConstructor<E>) {
	return function invariant(condition: any, message?: string | (() => string)): asserts condition {
		if (!condition) {
			const msg = typeof message === "function" ? message() : message
			throw new ErrorClass(msg)
		}
	}
}

export const invariant = createInvariant(InvariantError)
