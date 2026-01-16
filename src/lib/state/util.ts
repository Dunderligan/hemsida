import { getContext, setContext } from 'svelte';

/**
 * Defines a type-safe Svelte context with the given key.
 * The return value is an object with methods to get and set the context.
 *
 * This is useful for state you want to share with the whole page, and mainly used on the admin pages.
 * It's usually paired with a class (T) that re-exports the get and set functions as static methods.
 */
// TODO: replace this with https://svelte.dev/docs/svelte/context#Type-safe-context
export function defineContext<T>(key: string) {
	return {
		get: () => getContext<T>(key),
		set: (value: T) => setContext(key, value)
	};
}
