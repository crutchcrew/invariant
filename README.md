# invariant

A tiny TypeScript invariant with custom error class support.

## What is `invariant`?

An invariant function takes a value and throws if the value is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy). If the value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), execution continues and TypeScript narrows the type.

```ts
import { invariant } from "@crutchcrew/invariant"

const user: User | null = getUser()
invariant(user, "User not found")
// user is narrowed to User here
```

## Why this package

There are several invariant packages available for TypeScript:

- [ts-invariant](https://github.com/apollographql/invariant-packages) — the original inspiration for this package, maintained by the Apollo team
- [tiny-invariant](https://github.com/alexreardon/tiny-invariant) — a minimal, zero-dependency invariant by Alex Reardon
- [invariant](https://github.com/zertosh/invariant) — a port of Facebook's invariant module

All of them throw a fixed error type. If you need to throw domain-specific errors — a `NotFoundError`, a `ValidationError`, or anything else — you're left wrapping calls or rolling your own helper every time. This package provides `createInvariant` to build an invariant function that throws any error class you give it, with the same assertion narrowing and lazy message support.

## Install

Install using package manager of your choice

```sh
pnpm add @crutchcrew/invariant
bun add @crutchcrew/invariant
yarn add @crutchcrew/invariant
npm add @crutchcrew/invariant
```

## Usage

### Lazy messages

Pass a function to defer message construction and avoid unnecessary string work on hot paths:

```ts
invariant(value, () => `Expected value, got ${typeof value}`)
```

### Custom error classes

Use `createInvariant` to throw your own error type:

```ts
import { createInvariant } from "@crutchcrew/invariant"

class NotFoundError extends Error {
	name = "NotFoundError"
}

const assertFound = createInvariant(NotFoundError)

assertFound(record, "Record not found")
// throws NotFoundError
```

### Console methods

Like `ts-invariant`, the invariant function exposes `debug`, `log`, `warn`, and `error` methods that delegate to the corresponding `console` methods:

```ts
invariant.warn("Unexpected state", { detail })
invariant.error("Something went wrong")
```

## API

### `invariant(condition, message?)`

```ts
(condition: any, message?: string | (() => string)) => asserts condition
```

Throws `InvariantError` if `condition` is falsy. Narrows the type of `condition` to truthy.

### `createInvariant(ErrorClass)`

```ts
;<E extends Error>(ErrorClass: new (message: string) => E) => Invariant
```

Returns a new invariant function that throws `ErrorClass` instead of `InvariantError`.

### `InvariantError`

Default error class thrown by `invariant`. Extends `Error` with `framesToPop = 1` for cleaner stack traces.

## Development

```sh
bun install
bun test
bun run check    # fmt + lint (with type-check) in parallel
```

## Credits

The API and `InvariantError` design are based on [ts-invariant](https://github.com/apollographql/invariant-packages) by Ben Newman and the Apollo team.
