# invariant 🔬🔨

[![npm version](https://img.shields.io/npm/v/@crutchcrew/invariant)](https://www.npmjs.com/package/@crutchcrew/invariant)
[![coverage](https://img.shields.io/endpoint?url=https://crutchcrew.github.io/invariant/badges/coverage.json)](https://github.com/crutchcrew/invariant/actions)
[![gzip size](https://img.shields.io/endpoint?url=https://crutchcrew.github.io/invariant/badges/size.json)](https://www.npmjs.com/package/@crutchcrew/invariant)
[![license](https://img.shields.io/npm/l/@crutchcrew/invariant)](./LICENSE)

TypeScript invariant with custom error class support — tiny as `tiny-invariant`, type-safe as `ts-invariant`, versatile as nothing else.

## How it works

An invariant function takes a value and throws if the value is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy). If the value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), execution continues and TypeScript narrows the type.

```ts
import { invariant } from "@crutchcrew/invariant"

const user: User | null = getUser()
invariant(user, "User not found")
// user is narrowed to User here
```

## Why this package

|                                                     | This package | [tiny-invariant](https://github.com/alexreardon/tiny-invariant) | [ts-invariant](https://github.com/apollographql/invariant-packages) | [invariant](https://github.com/zertosh/invariant) |
| --------------------------------------------------- | ------------ | --------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Size (gzip)**                                     | ~448 B       | ~370 B                                                          | ~1.0 kB                                                             | ~1.1 kB                                           |
| **Type narrowing**                                  | ✅           | ✅                                                              | ✅                                                                  | ❌                                                |
| **Lazy messages**                                   | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |
| [**Invariant factory**](#createinvarianterrorclass) | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |
| **Console methods**                                 | ✅           | ❌                                                              | ✅                                                                  | ❌                                                |
| [**Strict typing**](#strict-typing)                 | ✅           | ❌                                                              | ❌                                                                  | ❌                                                |
| **Tree-shakeable ESM**                              | ✅           | ✅                                                              | ✅                                                                  | ❌                                                |
| **Zero dependencies**                               | ✅           | ✅                                                              | ❌                                                                  | ❌                                                |

## Install

```sh
pnpm add @crutchcrew/invariant
bun add @crutchcrew/invariant
yarn add @crutchcrew/invariant
npm add @crutchcrew/invariant
```

## Usage

```ts
const container = document.getElementById("root")
invariant(container, "Missing #root element")
createRoot(container).render(<StrictMode><App /></StrictMode>)
```

### Lazy messages

Pass a function to defer message construction and avoid expensive message computation

```ts
invariant(value, getExpensiveMessage)
```

### Custom error classes

If you need to throw domain-specific errors — a `NotFoundError`, a `ValidationError`, or anything else — you're left wrapping calls or rolling your own helper. This package provides `createInvariant` to build an invariant function that throws any error class you give it, with the same assertion narrowing and lazy message support.

Use `createInvariant` to throw your own error type:

```ts
// component-invariant.ts
import { createInvariant } from "@crutchcrew/invariant"

class ComponentError extends Error {
  name = "ComponentError"
}

export const invariant = createInvariant(ComponentError)

// my-component.tsx
import { invariant } from './component-invariant'

export function MyComponent() {
	const { id } = useParams()

	invariant(id, "MyComponent can be rendered only on `/notes/:id` basepath`)

	return <>...</>
}
```

### Console methods

Like `ts-invariant`, the invariant function exposes `debug`, `log`, `warn`, and `error` methods that delegate to the corresponding `console` methods:

```ts
invariant.warn("Unexpected state", { detail })
invariant.error("Something went wrong")
```

### Strict typing

The default export types `condition` as `any` so it can narrow any truthy/falsy value — objects, strings, numbers, whatever you hand it. Import from `@crutchcrew/invariant/strict` instead to require an actual `boolean`, catching accidental truthy/falsy checks at the type level, similar to [ts-tiny-invariant](https://github.com/iyegoroff/ts-tiny-invariant):

```ts
import { invariant } from "@crutchcrew/invariant/strict"

invariant(user !== null, "User not found") // ✅ boolean condition
invariant(user, "User not found") // ❌ type error: User | null is not assignable to boolean
```

It's the same runtime as the default export — just a stricter type layer — so `createInvariant` and `InvariantError` are also available from `/strict`.

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

The API and `InvariantError` design are based on [ts-invariant](https://github.com/apollographql/invariant-packages) by Ben Newman and the Apollo team. The `/strict` entry point is inspired by [ts-tiny-invariant](https://github.com/iyegoroff/ts-tiny-invariant) by Igor Yegoroff.
