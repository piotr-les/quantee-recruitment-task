import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
	onIntersect: () => void;
	hasNextPage: boolean;
	rootMargin?: string;
	threshold?: number;
	enabled?: boolean;
}

export const useInfiniteScroll = ({
	onIntersect,
	hasNextPage,
	rootMargin = '100px',
	threshold = 0.1,
	enabled = true,
}: UseInfiniteScrollOptions) => {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const handleIntersect = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;

			if (entry.isIntersecting && hasNextPage && enabled) {
				onIntersect();
			}
		};

		const observer = new IntersectionObserver(handleIntersect, {
			rootMargin,
			threshold,
		});

		observer.observe(sentinel);

		return () => {
			observer.unobserve(sentinel);
			observer.disconnect();
		};
	}, [onIntersect, hasNextPage, enabled, rootMargin, threshold]);

	return {
		ref: sentinelRef,
	};
};
