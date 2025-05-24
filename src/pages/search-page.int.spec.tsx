import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { SearchPage } from './search-page';

describe('SearchPage Integration Tests', () => {
	beforeAll(() => {
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

	beforeEach(() => {
		vi.clearAllTimers();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

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
});
