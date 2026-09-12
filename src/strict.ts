/**
 * A stricter variant of the default invariant that requires an actual
 * `boolean` condition instead of accepting any truthy/falsy value, catching
 * accidental non-boolean checks at the type level.
 *
 * @module
 */

import {
	InvariantError,
	createInvariant as looseCreateInvariant,
	invariant as looseInvariant,
} from "./index"

type ErrorConstructor<E extends Error = Error> = new (message: string) => E
type ConsoleMethodName = "debug" | "log" | "warn" | "error"

/**
 * Same as the default `Invariant`, but requires a `boolean` condition
 * instead of accepting any value.
 */
export interface Invariant extends Pick<Console, ConsoleMethodName> {
	(condition: boolean, message?: string | (() => string)): asserts condition
}

/**
 * Strictly-typed version of `createInvariant` — same runtime behavior as
 * the default export, narrowed to a `boolean` condition.
 */
export const createInvariant: <E extends Error>(ErrorClass: ErrorConstructor<E>) => Invariant =
	looseCreateInvariant

/**
 * Strictly-typed version of `invariant` — same runtime behavior as the
 * default export, narrowed to a `boolean` condition.
 *
 * @example
 * ```ts
 * import { invariant } from "@crutchcrew/invariant/strict"
 *
 * invariant(user !== null, "User not found") // boolean condition
 * ```
 */
export const invariant: Invariant = looseInvariant

export { InvariantError }
