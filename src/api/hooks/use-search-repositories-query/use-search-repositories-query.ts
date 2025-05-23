import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { githubApi } from '@api/axios-config';

export interface Repository {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	stargazers_count: number;
	language: string | null;
	owner: {
		login: string;
		avatar_url: string;
	};
}

export interface SearchRepositoriesResponse {
	total_count: number;
	incomplete_results: boolean;
	items: Repository[];
}

export interface SearchRepositoriesParams {
	query: string;
	page?: number;
	per_page?: number;
}

export interface SearchRepositoriesError {
	message: string;
	status?: number;
}

export const SEARCH_REPOSITORIES_ENDPOINT = '/search/repositories' as const;

export const SEARCH_REPOSITORIES_QUERY_KEY = 'searchRepositories' as const;

const FIVE_MINUTES = 5 * 60 * 1000;

const searchRepositoriesQueryFn = async ({
	query,
	page,
	per_page,
}: SearchRepositoriesParams): Promise<SearchRepositoriesResponse> => {
	const { data } = await githubApi.get<SearchRepositoriesResponse>(
		SEARCH_REPOSITORIES_ENDPOINT,
		{
			params: {
				q: query,
				page: page || 1,
				per_page: per_page || 30,
			},
		}
	);
	return data;
};

export const useSearchRepositoriesQuery = (query: string, per_page: number = 30) => {
	return useInfiniteQuery<
		SearchRepositoriesResponse,
		SearchRepositoriesError,
		InfiniteData<SearchRepositoriesResponse, number>,
		(string | number)[],
		number
	>({
		queryKey: [SEARCH_REPOSITORIES_QUERY_KEY, query, per_page],
		queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
			searchRepositoriesQueryFn({ query, page: pageParam, per_page }),
		enabled: !!query.trim(),
		getNextPageParam: (lastPage, allPages) => {
			const totalFetched = allPages.reduce((sum, page) => sum + page.items.length, 0);
			return totalFetched < lastPage.total_count ? allPages.length + 1 : undefined;
		},
		initialPageParam: 1,
		staleTime: FIVE_MINUTES,
	});
};
