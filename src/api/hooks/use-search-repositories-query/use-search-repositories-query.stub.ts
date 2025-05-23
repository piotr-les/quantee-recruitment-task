import { http, HttpResponse, RequestHandler, delay } from 'msw';
import { GITHUB_API_URL } from '@api/axios-config';
import { SEARCH_REPOSITORIES_ENDPOINT } from './use-search-repositories-query';
import {
	searchRepositoriesQuerySuccessMock,
	searchRepositoriesQueryEmptyMock,
	searchRepositoriesQueryPage2Mock,
} from './use-search-repositories-query.mocks';

export const searchRepositoriesQueryStub: RequestHandler = http.get(
	`${GITHUB_API_URL}${SEARCH_REPOSITORIES_ENDPOINT}`,
	async ({ request }) => {
		await delay(300);

		const url = new URL(request.url);
		const query = url.searchParams.get('q') || '';
		const page = parseInt(url.searchParams.get('page') || '1');

		if (query === 'no-results') {
			return HttpResponse.json(searchRepositoriesQueryEmptyMock);
		}

		if (query === 'error') {
			return HttpResponse.json({ message: 'API rate limit exceeded' }, { status: 403 });
		}

		if (page === 1) {
			return HttpResponse.json(searchRepositoriesQuerySuccessMock);
		}

		if (page === 2) {
			return HttpResponse.json(searchRepositoriesQueryPage2Mock);
		}

		return HttpResponse.json({
			total_count: 65,
			incomplete_results: false,
			items: [],
		});
	}
);
