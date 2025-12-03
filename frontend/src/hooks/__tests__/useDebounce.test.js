import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300));
    expect(result.current).toBe('test');
  });

  test('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');
    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  test('cancels previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'third' });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'fourth' });
    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(result.current).toBe('fourth');
    });
  });

  test('handles empty string', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'test' } }
    );

    rerender({ value: '' });
    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });
});
