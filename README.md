# useDebounce

A tiny, fully tested React hook for debouncing functions. Written in TypeScript, with automatic cleanup on unmount and a `.cancel()` escape hatch.

## Installation

There's no package published yet, so drop `src/useDebounce.ts` straight into your project:

```bash
curl -o src/hooks/useDebounce.tsx https://github.com/mehrabbahramian/react-use-debounce/blob/master/src/useDebounce.tsx
```

Or just copy-paste the file. It has no dependencies beyond `react`.

## API

```ts
function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): {
  (...args: Args): void;
  cancel: () => void;
};
```

| Parameter  | Type                          | Description                                                   |
| ---------- | ----------------------------- | --------------------------------------------------------------|
| `callback` | `(...args: Args) => void`     | The function to debounce. Always calls the latest version.    |
| `delay`    | `number`                      | Delay in milliseconds. Negative or `NaN` values fall back to `0`. |

Returns a debounced function. Calling it repeatedly resets the timer, so only the last call in a burst runs. The returned function also has a `.cancel()` method to stop a pending call.

## Basic usage

```tsx
import { useState } from "react";
import { useDebounce } from "./useDebounce";

function FilterInput() {
  const [term, setTerm] = useState("");

  const debouncedFilter = useDebounce((value: string) => {
    console.log("filtering by", value);
  }, 300);

  return (
    <input
      value={term}
      onChange={(event) => {
        setTerm(event.target.value);
        debouncedFilter(event.target.value);
      }}
    />
  );
}
```

## Examples

The [`examples/`](./examples) directory has four runnable patterns:

| File | Demonstrates |
| ---- | ------------- |
| [`SearchInput.tsx`](./examples/SearchInput.tsx) | Debouncing a search box so it doesn't fire an API call on every keystroke |
| [`WindowResizeLogger.tsx`](./examples/WindowResizeLogger.tsx) | Debouncing a native browser event listener, with proper `removeEventListener` + `.cancel()` cleanup |
| [`AutoSaveForm.tsx`](./examples/AutoSaveForm.tsx) | Debounced autosave with a manual "cancel pending save" button |
| [`SubmitButtonGuard.tsx`](./examples/SubmitButtonGuard.tsx) | Using debounce to guard a button against rapid repeat clicks |

## Testing

The hook ships with a full test suite covering rapid calls, unmount cleanup, changing callbacks/delays mid-flight, invalid delay values, and the `.cancel()` method.

```bash
npm install
npm test
```

## License

MIT — feel free to swap this out if you'd rather use a different license for your repo.
