import { describe, it, expect, vi, onTestFinished } from "bun:test"

import { invariant, createInvariant, InvariantError } from "./index"

describe(InvariantError, () => {
	it("is an instance of Error", () => {
		const error = new InvariantError("test")
		expect(error).toBeInstanceOf(Error)
		expect(error).toBeInstanceOf(InvariantError)
	})

	it("has correct name and framesToPop", () => {
		expect(new InvariantError("test")).toMatchObject({
			name: "InvariantError",
			framesToPop: 1,
		})
	})

	it("uses provided message", () => {
		expect(new InvariantError("custom message")).toMatchObject({
			message: "custom message",
		})
	})
})

describe(invariant, () => {
	it.each([true, 1, "non-empty", {}] as const)("does not throw for `%j` values ", (input) => {
		expect(() => invariant(input)).not.toThrow()
	})

	it.each([false, 0, "", null, undefined])("throws InvariantError for `%j` values", (input) => {
		expect(() => invariant(input)).toThrow()
	})

	it("includes the provided message", () => {
		expect(() => invariant(false, "something went wrong")).toThrow("something went wrong")
	})

	it("supports lazy message", () => {
		expect(() => invariant(false, () => "lazy message")).toThrow("lazy message")
	})

	it("does not evaluate lazy message when condition is truthy", () => {
		const messageFn = vi.fn()
		invariant(true, messageFn)
		expect(messageFn).not.toHaveBeenCalled()
	})

	it.each(["debug", "log", "warn", "error"] as const)(
		"delegates `invariant.%s` method to console",
		(method) => {
			onTestFinished(() => {
				vi.resetAllMocks()
			})
			const fn = vi.fn()
			vi.spyOn(console, method).mockImplementationOnce(fn)
			invariant[method]("hello", 42)
			expect(fn).toHaveBeenCalledWith("hello", 42)
		},
	)
})

describe(createInvariant, () => {
	class CustomError extends Error {
		override name = "CustomError"
	}
	const customInvariant = createInvariant(CustomError)

	it("returns a function that throws the custom error class", () => {
		expect(() => customInvariant(false, "custom")).toThrow(CustomError)
	})

	it("passes the message to the custom error", () => {
		expect(() => customInvariant(false, "detailed message")).toThrow("detailed message")
	})

	it("supports lazy message with custom errors", () => {
		expect(() => customInvariant(false, () => "lazy custom")).toThrow("lazy custom")
	})

	it("does not throw for truthy conditions", () => {
		expect(() => customInvariant(true)).not.toThrow()
	})

	it("works with built-in error classes", () => {
		const typeInvariant = createInvariant(TypeError)
		expect(() => typeInvariant(false, "type error")).toThrow(TypeError)
		expect(() => typeInvariant(false, "type error")).toThrow("type error")
	})
})
