import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useInfiniteScroll } from './use-infinite-scroll';

describe('useInfiniteScroll', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			configurable: true,
			value: vi.fn(() => ({
				observe: vi.fn(),
				unobserve: vi.fn(),
				disconnect: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it('returns ref object', () => {
		const mockOnIntersect = vi.fn();

		const { result } = renderHook(() =>
			useInfiniteScroll({
				onIntersect: mockOnIntersect,
				hasNextPage: true,
			})
		);

		expect(result.current.ref).toBeDefined();
		expect(result.current.ref.current).toBe(null);
	});

	it('accepts all required and optional parameters', () => {
		const mockOnIntersect = vi.fn();

		expect(() => {
			renderHook(() =>
				useInfiniteScroll({
					onIntersect: mockOnIntersect,
					hasNextPage: true,
					rootMargin: '200px',
					threshold: 0.5,
					enabled: false,
				})
			);
		}).not.toThrow();
	});

	it('uses default values for optional parameters', () => {
		const mockOnIntersect = vi.fn();

		expect(() => {
			renderHook(() =>
				useInfiniteScroll({
					onIntersect: mockOnIntersect,
					hasNextPage: true,
				})
			);
		}).not.toThrow();
	});

	it('returns stable ref object across re-renders', () => {
		const mockOnIntersect = vi.fn();

		const { result, rerender } = renderHook(() =>
			useInfiniteScroll({
				onIntersect: mockOnIntersect,
				hasNextPage: true,
			})
		);

		const firstRef = result.current.ref;

		rerender();

		const secondRef = result.current.ref;

		expect(firstRef).toBe(secondRef);
	});
});
