import { Box } from '@mui/material';
import type { InfiniteData } from '@tanstack/react-query';
import type { SearchRepositoriesResponse } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';
import { RepositoryItem } from '@components/repository-item/repository-item';
import { RepositoryItemSkeleton } from '@components/repository-item-skeleton/repository-item-skeleton';

export interface RepositoryListProps {
	data: InfiniteData<SearchRepositoriesResponse, number>;
	isFetchingNextPage?: boolean;
}

export const RepositoryList = ({ data, isFetchingNextPage = false }: RepositoryListProps) => {
	const allRepositories = data.pages.flatMap(page => page.items);

	return (
		<Box sx={{ mt: 3 }}>
			{allRepositories.map(repository => (
				<RepositoryItem key={repository.id} repository={repository} />
			))}

			{isFetchingNextPage && <RepositoryItemSkeleton />}
		</Box>
	);
};
