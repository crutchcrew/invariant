import { describe, it, expect, mock } from "bun:test"

import { invariant, createInvariant, InvariantError, type Invariant } from "./index"

describe("InvariantError", () => {
	it("is an instance of Error", () => {
		const error = new InvariantError("test")
		expect(error).toBeInstanceOf(Error)
		expect(error).toBeInstanceOf(InvariantError)
	})

	it("has correct name and framesToPop", () => {
		const error = new InvariantError("test")
		expect(error.name).toBe("InvariantError")
		expect(error.framesToPop).toBe(1)
	})

	it("uses provided message", () => {
		const error = new InvariantError("custom message")
		expect(error.message).toBe("custom message")
	})
})

describe("invariant", () => {
	it("does not throw for truthy conditions", () => {
		expect(() => invariant(true)).not.toThrow()
		expect(() => invariant(1)).not.toThrow()
		expect(() => invariant("non-empty")).not.toThrow()
		expect(() => invariant({})).not.toThrow()
	})

	it("throws InvariantError for falsy conditions", () => {
		expect(() => invariant(false)).toThrow(InvariantError)
		expect(() => invariant(0)).toThrow(InvariantError)
		expect(() => invariant("")).toThrow(InvariantError)
		expect(() => invariant(null)).toThrow(InvariantError)
		expect(() => invariant(undefined)).toThrow(InvariantError)
	})

	it("includes the provided message", () => {
		expect(() => invariant(false, "something went wrong")).toThrow("something went wrong")
	})

	it("supports lazy message via function", () => {
		expect(() => invariant(false, () => "lazy message")).toThrow("lazy message")
	})

	it("does not evaluate lazy message when condition is truthy", () => {
		const messageFn = mock(() => "should not be called")
		invariant(true, messageFn)
		expect(messageFn).not.toHaveBeenCalled()
	})
})

describe("invariant console methods", () => {
	for (const method of ["debug", "log", "warn", "error"] as const) {
		it(`invariant.${method} delegates to console.${method}`, () => {
			const original = console[method]
			const fn = mock()
			console[method] = fn
			try {
				invariant[method]("hello", 42)
				expect(fn).toHaveBeenCalledWith("hello", 42)
			} finally {
				console[method] = original
			}
		})
	}
})

describe("createInvariant", () => {
	class CustomError extends Error {
		constructor(message?: string) {
			super(message)
			this.name = "CustomError"
		}
	}

	it("returns a function that throws the custom error class", () => {
		const customInvariant: Invariant = createInvariant(CustomError)
		expect(() => customInvariant(false, "custom")).toThrow(CustomError)
	})

	it("passes the message to the custom error", () => {
		const customInvariant: Invariant = createInvariant(CustomError)
		try {
			customInvariant(false, "detailed message")
		} catch (e) {
			expect(e).toBeInstanceOf(CustomError)
			expect((e as CustomError).message).toBe("detailed message")
			expect((e as CustomError).name).toBe("CustomError")
		}
	})

	it("does not throw for truthy conditions", () => {
		const customInvariant: Invariant = createInvariant(CustomError)
		expect(() => customInvariant(true)).not.toThrow()
	})

	it("supports lazy message with custom errors", () => {
		const customInvariant: Invariant = createInvariant(CustomError)
		expect(() => customInvariant(false, () => "lazy custom")).toThrow("lazy custom")
	})

	it("works with built-in error classes", () => {
		const typeInvariant: Invariant = createInvariant(TypeError)
		expect(() => typeInvariant(false, "type error")).toThrow(TypeError)
		expect(() => typeInvariant(false, "type error")).toThrow("type error")
	})
})
