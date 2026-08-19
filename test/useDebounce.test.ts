import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../src/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("calls the callback after the specified delay", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current("value");
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("value");
  });

  it("only invokes the callback once for rapid successive calls, using the last arguments", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current("first");
      result.current("second");
      result.current("third");
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });

  it("resets the timer on every call within the delay window", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current("a");
      jest.advanceTimersByTime(200);
      result.current("b");
      jest.advanceTimersByTime(200);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("b");
  });

  it("supports multiple arguments", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    act(() => {
      result.current(1, "two", { three: 3 });
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledWith(1, "two", { three: 3 });
  });

  it("always calls the most recently provided callback", () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = renderHook(({ cb }) => useDebounce(cb, 200), {
      initialProps: { cb: first },
    });

    act(() => {
      result.current("x");
    });

    rerender({ cb: second });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("x");
  });

  it("clears the pending call on unmount and never invokes the callback", () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current("value");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("exposes a cancel method that prevents the pending call", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current("value");
      result.current.cancel();
      jest.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("treats a negative delay as zero instead of throwing", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, -50));

    act(() => {
      result.current("value");
      jest.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledWith("value");
  });

  it("treats a NaN delay as zero instead of throwing", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, NaN));

    act(() => {
      result.current("value");
      jest.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledWith("value");
  });

  it("does not throw when the callback is not a function", () => {
    const { result } = renderHook(() => useDebounce(undefined as unknown as () => void, 100));

    expect(() => {
      act(() => {
        result.current();
        jest.advanceTimersByTime(100);
      });
    }).not.toThrow();
  });

  it("keeps the same debounced function reference across re-renders when the delay is unchanged", () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useDebounce(callback, 300));

    const firstReference = result.current;
    rerender();
    const secondReference = result.current;

    expect(firstReference).toBe(secondReference);
  });

  it("cancels a previously scheduled call when the delay changes before it fires", () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(({ delay }) => useDebounce(callback, delay), {
      initialProps: { delay: 300 },
    });

    act(() => {
      result.current("first");
    });

    rerender({ delay: 100 });

    act(() => {
      result.current("second");
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });
});
