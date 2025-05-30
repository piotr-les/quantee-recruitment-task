import { useCallback } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useSearchRepositoriesQuery } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';
import { SearchInput } from '@components/search-input/search-input';
import { StateDisplay } from '@components/state-display/state-display';
import { RepositoryListSkeleton } from '@components/repository-list-skeleton/repository-list-skeleton';
import { RepositoryList } from '@components/repository-list/repository-list';
import { useSearchParams } from 'react-router';

const QUERY_KEY = 'query' as const;

export const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get(QUERY_KEY) ?? '';

	const handleUrlChange = useCallback(
		(newQuery?: string) => {
			if (!newQuery) return;

			setSearchParams({
				[QUERY_KEY]: newQuery,
			});
		},
		[setSearchParams]
	);

	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchRepositoriesQuery(query);

	const hasQuery = query.trim().length > 0;
	const hasResults = data && data.pages[0]?.total_count > 0;
	const hasNoResults = data && data.pages[0]?.total_count === 0;

	const handleRetry = () => window.location.reload();

	const renderContent = () => {
		if (!hasQuery) return <StateDisplay.Empty />;
		if (isLoading) return <RepositoryListSkeleton />;
		if (isError) return <StateDisplay.Error onAction={handleRetry} />;
		if (hasNoResults) return <StateDisplay.NoResults />;
		if (hasResults)
			return (
				<RepositoryList
					data={data}
					isFetchingNextPage={isFetchingNextPage}
					hasNextPage={hasNextPage}
					onFetchNextPage={fetchNextPage}
				/>
			);
		return null;
	};

	return (
		<Container maxWidth="lg">
			<Box sx={{ py: 4 }}>
				<Typography variant="h3" component="h1" gutterBottom align="center">
					GitHub Repository Search
				</Typography>
				<Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
					Search for GitHub repositories
				</Typography>

				<SearchInput
					onQueryChange={handleUrlChange}
					defaultValue={query}
					placeholder="Search repositories..."
					debounceMs={500}
				/>

				{renderContent()}
			</Box>
		</Container>
	);
};
