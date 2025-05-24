import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { InfiniteData } from '@tanstack/react-query';
import { renderWithProviders } from '@test/test-utils';
import { RepositoryList } from './repository-list';
import { RepositoryMockFactory } from '@mocks/factories/repository-mock-factory';
import type {
	SearchRepositoriesResponse,
	Repository,
} from '@api-hooks/use-search-repositories-query/use-search-repositories-query';

describe('RepositoryList', () => {
	const mockOnFetchNextPage = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		RepositoryMockFactory.reset();

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

	const createMockInfiniteData = (
		pages: SearchRepositoriesResponse[]
	): InfiniteData<SearchRepositoriesResponse, number> => ({
		pages,
		pageParams: pages.map((_, index) => index + 1),
	});

	const createMockPage = (
		repositories: Repository[],
		totalCount = 100
	): SearchRepositoriesResponse => ({
		total_count: totalCount,
		incomplete_results: false,
		items: repositories,
	});

	it('renders repositories from multiple pages in correct order', () => {
		const page1Repos = [
			RepositoryMockFactory.create({ id: 1, full_name: 'user/first-repo' }),
			RepositoryMockFactory.create({ id: 2, full_name: 'user/second-repo' }),
		];
		const page2Repos = [RepositoryMockFactory.create({ id: 3, full_name: 'user/third-repo' })];

		const mockData = createMockInfiniteData([
			createMockPage(page1Repos),
			createMockPage(page2Repos),
		]);

		renderWithProviders(
			<RepositoryList data={mockData} onFetchNextPage={mockOnFetchNextPage} />
		);

		const repositoryElements = screen.getAllByTestId('repository-full-name');
		expect(repositoryElements).toHaveLength(3);
		expect(repositoryElements[0]).toHaveTextContent('user/first-repo');
		expect(repositoryElements[1]).toHaveTextContent('user/second-repo');
		expect(repositoryElements[2]).toHaveTextContent('user/third-repo');
	});

	it('handles empty data gracefully', () => {
		const mockData = createMockInfiniteData([createMockPage([])]);

		renderWithProviders(
			<RepositoryList data={mockData} onFetchNextPage={mockOnFetchNextPage} />
		);

		expect(screen.queryByTestId('repository-full-name')).not.toBeInTheDocument();
		expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument();
	});

	it('shows loading skeleton when fetching next page', () => {
		const repositories = RepositoryMockFactory.createMany(2);
		const mockData = createMockInfiniteData([createMockPage(repositories)]);

		renderWithProviders(
			<RepositoryList
				data={mockData}
				onFetchNextPage={mockOnFetchNextPage}
				isFetchingNextPage={true}
			/>
		);

		expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
		expect(screen.getByTestId('repository-item-skeleton')).toBeInTheDocument();
	});

	it('hides loading skeleton when not fetching', () => {
		const repositories = RepositoryMockFactory.createMany(2);
		const mockData = createMockInfiniteData([createMockPage(repositories)]);

		renderWithProviders(
			<RepositoryList
				data={mockData}
				onFetchNextPage={mockOnFetchNextPage}
				isFetchingNextPage={false}
			/>
		);

		expect(screen.queryByTestId('repository-item-skeleton')).not.toBeInTheDocument();
	});

	it('handles mixed empty and filled pages correctly', () => {
		const repositories = RepositoryMockFactory.createMany(2);
		const mockData = createMockInfiniteData([
			createMockPage([]),
			createMockPage(repositories),
			createMockPage([]),
		]);

		renderWithProviders(
			<RepositoryList data={mockData} onFetchNextPage={mockOnFetchNextPage} />
		);

		expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
		repositories.forEach(repo => {
			expect(screen.getByText(repo.full_name)).toBeInTheDocument();
		});
	});
});
