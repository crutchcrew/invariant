import {
	InvariantError,
	createInvariant as looseCreateInvariant,
	invariant as looseInvariant,
} from "./index"

type ErrorConstructor<E extends Error = Error> = new (message: string) => E
type ConsoleMethodName = "debug" | "log" | "warn" | "error"

export interface Invariant extends Pick<Console, ConsoleMethodName> {
	(condition: boolean, message?: string | (() => string)): asserts condition
}

export const createInvariant: <E extends Error>(ErrorClass: ErrorConstructor<E>) => Invariant =
	looseCreateInvariant

export const invariant: Invariant = looseInvariant

export { InvariantError }
