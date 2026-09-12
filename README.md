# invariant 🔬🔨

[![npm version](https://img.shields.io/npm/v/@crutchcrew/invariant)](https://www.npmjs.com/package/@crutchcrew/invariant)
[![gzip size](https://img.shields.io/endpoint?url=https://crutchcrew.github.io/invariant/badges/size.json)](https://www.npmjs.com/package/@crutchcrew/invariant)
[![coverage](https://img.shields.io/endpoint?url=https://crutchcrew.github.io/invariant/badges/coverage.json)](https://github.com/crutchcrew/invariant/actions)
[![provenance](https://img.shields.io/badge/provenance-verified-brightgreen)](https://www.npmjs.com/package/@crutchcrew/invariant)
[![license](https://img.shields.io/npm/l/@crutchcrew/invariant)](./LICENSE)

TypeScript invariant with custom error class support — tiny as `tiny-invariant`, type-safe as `ts-invariant`, versatile as nothing else.

## How it works

An invariant function takes a value and throws if the value is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy). If the value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), execution continues and TypeScript narrows the type.

```ts
import { invariant } from "@crutchcrew/invariant"

const user: User | null = getUser()
invariant(user, "User not found")
console.log(user.name) // user is narrowed to User
```

## Why this package

|                                         | This package | [tiny-invariant](https://github.com/alexreardon/tiny-invariant) | [ts-invariant](https://github.com/apollographql/invariant-packages) | [invariant](https://github.com/zertosh/invariant) |
| --------------------------------------- | ------------ | --------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Size (gzip)**                         | ~406 B       | ~370 B                                                          | ~1.0 kB                                                             | ~1.1 kB                                           |
| **Zero Dependencies**                   | ✅           | ✅                                                              | ❌                                                                  | ❌                                                |
| **Tree-shakeable ESM**                  | ✅           | ✅                                                              | ✅                                                                  | ❌                                                |
| [**Type narrowing**](#how-it-works)     | ✅           | ✅                                                              | ✅                                                                  | ❌                                                |
| [**Strict typing**](#strict-typing)     | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |
| [**Lazy messages**](#lazy-messages)     | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |
| [**Console methods**](#console-methods) | ✅           | ❌                                                              | ✅                                                                  | ❌                                                |
| [**Invariant factory**](#custom-errors) | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |

## Install

Choose your fighter 🥊

```sh
pnpm add @crutchcrew/invariant
```

```sh
bun add @crutchcrew/invariant
```

```sh
yarn add @crutchcrew/invariant
```

```sh
npm add @crutchcrew/invariant
```

## Usage

```ts
const response = await fetch("/users/1")
invariant(response.ok, `Request failed: ${response.status}`)

const user = await response.json()
```

### Lazy messages

Pass a function to defer message construction and avoid expensive message computation

```ts
invariant(value, getExpensiveMessage)
```

### Custom errors

If you need to throw domain-specific errors — a `NotFoundError`, a `ValidationError`, or anything else — you're left wrapping calls or rolling your own helper. This package provides `createInvariant` to build an invariant function that throws any error class you give it, with the same assertion narrowing and lazy message support.

Use `createInvariant` to throw your own error type:

```ts
import { createInvariant } from "@crutchcrew/invariant"

class HttpError extends Error {
	name = "HttpError"
}

const invariant = createInvariant(HttpError)

export async function getUser(id: string) {
	const response = await fetch(`/users/${id}`)
	invariant(response.ok, `Request failed: ${response.status}`)

	return response.json()
}
```

### Console methods

The invariant function exposes `debug`, `log`, `warn`, and `error` methods that delegate to the corresponding `console` methods:

```ts
invariant.debug(`Message ${id} sent`)
invariant.log("User", user)
invariant.warn("Unexpected state", { detail })
invariant.error("Something went wrong")
```

### Strict typing

The default invariant allows to pass any value as a condition so it can check on any truthy/falsy value — objects, strings, numbers, whatever you hand it. Import from `@crutchcrew/invariant/strict` instead to require an actual `boolean`, catching accidental truthy/falsy checks at the type level:

```ts
import { invariant } from "@crutchcrew/invariant/strict"

invariant(user !== null, "User not found") // ✅ boolean condition
invariant(user, "User not found") // ❌ type error: User | null is not assignable to boolean
```

It's the same runtime as the regular invariant — just a stricter type layer — so `createInvariant` and `InvariantError` are also available from `/strict`.

## API

### `invariant(condition, message?)`

```ts
// default
(condition: any, message?: string | (() => string)) => asserts condition
// strict
(condition: boolean, message?: string | (() => string)) => asserts condition
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

The API and `InvariantError` design are based on [ts-invariant](https://github.com/apollographql/invariant-packages) by Ben Newman and the Apollo team. The `/strict` entry point is inspired by [ts-tiny-invariant](https://github.com/iyegoroff/ts-tiny-invariant) by Igor Yegoroff.
