import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { SearchPage } from './search-page';

describe('SearchPage Integration Tests', () => {
	let mockIntersectionObserver: any;
	let mockObserve: any;
	let intersectionCallbacks: Set<any>;

	beforeAll(() => {
		intersectionCallbacks = new Set();
		mockObserve = vi.fn();

		mockIntersectionObserver = vi.fn().mockImplementation(callback => {
			intersectionCallbacks.add(callback);
			return {
				observe: mockObserve,
				unobserve: vi.fn(),
				disconnect: vi.fn(),
			};
		});

		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			configurable: true,
			value: mockIntersectionObserver,
		});
	});

	beforeEach(() => {
		vi.clearAllTimers();
		intersectionCallbacks.clear();
		mockObserve.mockClear();
		mockIntersectionObserver.mockClear();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	const triggerIntersection = (isIntersecting = true) => {
		const callback = Array.from(intersectionCallbacks)[0];
		if (callback) {
			callback([{ isIntersecting }]);
		}
	};

	describe('Empty State', () => {
		it('shows empty state when no search query is entered', () => {
			renderWithProviders(<SearchPage />);

			expect(screen.getByText('GitHub Repository Search')).toBeInTheDocument();
			expect(screen.getByText('Search for GitHub repositories')).toBeInTheDocument();
			expect(screen.getByTestId('state-display-empty')).toBeInTheDocument();
			expect(screen.getByText('Start searching for repositories')).toBeInTheDocument();
			expect(
				screen.getByText('Enter a search term to find GitHub repositories')
			).toBeInTheDocument();
		});

		it('shows empty state after clearing search input', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');

			await userEvent.type(searchInput, 'react');
			await userEvent.clear(searchInput);

			await waitFor(() => {
				expect(screen.getByTestId('state-display-empty')).toBeInTheDocument();
			});
		});

		it('hides empty state when user enters search query', async () => {
			renderWithProviders(<SearchPage />);

			expect(screen.getByTestId('state-display-empty')).toBeInTheDocument();

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.queryByTestId('state-display-empty')).not.toBeInTheDocument();
			});

			expect(await screen.findByTestId('repository-list-skeleton')).toBeInTheDocument();
		});
	});

	describe('No Results State', () => {
		it('shows no results state when API returns empty results', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'no-results');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-no-results')).toBeInTheDocument();
			});

			expect(screen.getByText('No repositories found')).toBeInTheDocument();
			expect(
				screen.getByText('Try adjusting your search terms or search for something else.')
			).toBeInTheDocument();
		});

		it('shows loading state before showing no results', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'no-results');

			await screen.findByTestId('repository-list-skeleton');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-no-results')).toBeInTheDocument();
			});

			expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
		});
	});

	describe('Error State', () => {
		it('shows error state when API request fails', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'error');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-error')).toBeInTheDocument();
			});

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
			expect(
				screen.getByText('An error occurred while fetching repositories. Please try again.')
			).toBeInTheDocument();
		});

		it('shows Try Again button in error state', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'error');

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
			});
		});

		it('shows loading state before showing error', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'error');

			await screen.findByTestId('repository-list-skeleton');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-error')).toBeInTheDocument();
			});

			expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
		});
	});

	describe('Search Input Behavior', () => {
		it('triggers search after debounce delay', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await screen.findByTestId('repository-list-skeleton');

			await waitFor(() => {
				expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
			});
		});

		it('shows different states for different search terms', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');

			await userEvent.type(searchInput, 'no-results');
			await waitFor(() => {
				expect(screen.getByTestId('state-display-no-results')).toBeInTheDocument();
			});

			await userEvent.clear(searchInput);
			await userEvent.type(searchInput, 'error');
			await waitFor(() => {
				expect(screen.getByTestId('state-display-error')).toBeInTheDocument();
			});
		});

		it('does not trigger search for whitespace-only input', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, '   ');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-empty')).toBeInTheDocument();
			});

			expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
		});

		it('cancels previous search when typing new query', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');

			await userEvent.type(searchInput, 'first');
			await userEvent.clear(searchInput);
			await userEvent.type(searchInput, 'no-results');

			await waitFor(() => {
				expect(screen.getByTestId('state-display-no-results')).toBeInTheDocument();
			});
		});
	});

	describe('Success State', () => {
		it('shows repository results when search is successful', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await screen.findByTestId('repository-list-skeleton');

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			});

			expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
			expect(screen.queryByTestId('state-display-empty')).not.toBeInTheDocument();
			expect(screen.queryByTestId('state-display-error')).not.toBeInTheDocument();
			expect(screen.queryByTestId('state-display-no-results')).not.toBeInTheDocument();
		});

		it('displays repository information correctly', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
			});

			expect(
				screen.getByText('The library for web and native user interfaces.')
			).toBeInTheDocument();
			expect(screen.getByText('220 000')).toBeInTheDocument();
			expect(screen.getByText('JavaScript')).toBeInTheDocument();

			const avatars = screen.getAllByTestId('repository-owner-avatar');
			expect(avatars).toHaveLength(2);

			const links = screen.getAllByTestId('repository-full-name');
			expect(links[0]).toHaveAttribute('href', 'https://github.com/facebook/react');
			expect(links[0]).toHaveAttribute('target', '_blank');
		});

		it('shows multiple repositories from search results', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
				expect(screen.getByText('vuejs/vue')).toBeInTheDocument();
			});

			expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			expect(screen.getAllByTestId('repository-owner-avatar')).toHaveLength(2);
		});

		it('handles repositories without description or language', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('vuejs/vue')).toBeInTheDocument();
			});

			const descriptions = screen.queryAllByTestId('repository-description');
			const languages = screen.queryAllByTestId('repository-language');

			expect(descriptions.length).toBeLessThan(2);
			expect(languages.length).toBeGreaterThan(0);
		});

		it('transitions from loading to results correctly', async () => {
			renderWithProviders(<SearchPage />);

			expect(screen.getByTestId('state-display-empty')).toBeInTheDocument();

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			expect(await screen.findByTestId('repository-list-skeleton')).toBeInTheDocument();
			expect(screen.queryByTestId('state-display-empty')).not.toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
			});

			expect(screen.queryByTestId('repository-list-skeleton')).not.toBeInTheDocument();
			expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument();
		});
	});

	describe('Infinite Scroll', () => {
		it('sets up intersection observer when showing results', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
			});

			expect(mockIntersectionObserver).toHaveBeenCalled();
			expect(mockObserve).toHaveBeenCalled();
			expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument();
		});

		it('loads next page when sentinel intersects', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
			});

			expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);

			triggerIntersection(true);

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(3);
			});

			expect(screen.getByText('angular/angular')).toBeInTheDocument();
		});

		it('shows loading skeleton while fetching next page', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getByText('facebook/react')).toBeInTheDocument();
			});

			triggerIntersection(true);

			expect(await screen.findByTestId('repository-item-skeleton')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.queryByTestId('repository-item-skeleton')).not.toBeInTheDocument();
			});
		});

		it('appends new results to existing list in correct order', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			});

			const initialResults = screen.getAllByTestId('repository-full-name');
			expect(initialResults[0]).toHaveTextContent('facebook/react');
			expect(initialResults[1]).toHaveTextContent('vuejs/vue');

			triggerIntersection(true);

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(3);
			});

			const allResults = screen.getAllByTestId('repository-full-name');
			expect(allResults[0]).toHaveTextContent('facebook/react');
			expect(allResults[1]).toHaveTextContent('vuejs/vue');
			expect(allResults[2]).toHaveTextContent('angular/angular');
		});

		it('does not load more when intersection is false', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			});

			triggerIntersection(false);

			await new Promise(resolve => setTimeout(resolve, 500));

			expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			expect(screen.queryByTestId('repository-item-skeleton')).not.toBeInTheDocument();
		});

		it('stops loading when no more pages available', async () => {
			renderWithProviders(<SearchPage />);

			const searchInput = screen.getByRole('textbox');
			await userEvent.type(searchInput, 'react');

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(2);
			});

			triggerIntersection(true);

			await waitFor(() => {
				expect(screen.getAllByTestId('repository-full-name')).toHaveLength(3);
			});

			triggerIntersection(true);

			await new Promise(resolve => setTimeout(resolve, 500));

			expect(screen.getAllByTestId('repository-full-name')).toHaveLength(3);
			expect(screen.queryByTestId('repository-item-skeleton')).not.toBeInTheDocument();
		});
	});
});
