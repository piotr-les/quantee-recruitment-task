import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useSearchRepositoriesQuery } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';
import { SearchInput } from '@components/search-input/search-input';

export const SearchPage = () => {
	const [query, setQuery] = useState('');

	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchRepositoriesQuery(query);

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
					onQueryChange={setQuery}
					placeholder="Search repositories..."
					debounceMs={500}
				/>

				{isLoading && <Typography>Loading...</Typography>}
				{isError && <Typography color="error">Error: {error?.message}</Typography>}

				{data && (
					<Box>
						<Typography variant="body2" sx={{ mb: 2 }}>
							Found {data.pages[0]?.total_count} repositories ({data.pages.length} pages
							loaded)
						</Typography>

						{hasNextPage && (
							<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
								{isFetchingNextPage ? 'Loading more...' : 'Load More'}
							</button>
						)}
					</Box>
				)}
			</Box>
		</Container>
	);
};
