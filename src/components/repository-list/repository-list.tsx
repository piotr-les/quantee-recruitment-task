import { Box } from '@mui/material';
import type { InfiniteData } from '@tanstack/react-query';
import type { SearchRepositoriesResponse } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';
import { RepositoryItem } from '@components/repository-item/repository-item';
import { RepositoryItemSkeleton } from '@components/repository-item-skeleton/repository-item-skeleton';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll/use-infinite-scroll';

export interface RepositoryListProps {
	data: InfiniteData<SearchRepositoriesResponse, number>;
	isFetchingNextPage?: boolean;
	hasNextPage?: boolean;
	onFetchNextPage: () => void;
}

export const RepositoryList = ({
	data,
	isFetchingNextPage = false,
	hasNextPage = false,
	onFetchNextPage,
}: RepositoryListProps) => {
	const allRepositories = data.pages.flatMap(page => page.items);

	const { ref } = useInfiniteScroll({
		onIntersect: onFetchNextPage,
		hasNextPage,
		enabled: !isFetchingNextPage,
	});

	return (
		<Box sx={{ mt: 3 }}>
			{allRepositories.map(repository => (
				<RepositoryItem key={repository.id} repository={repository} />
			))}

			{isFetchingNextPage && <RepositoryItemSkeleton />}

			<div ref={ref} data-testid="infinite-scroll-sentinel" />
		</Box>
	);
};
