import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { StateDisplay } from './state-display';

describe('StateDisplay', () => {
	describe('StateDisplay.Empty', () => {
		it('renders default empty state', () => {
			renderWithProviders(<StateDisplay.Empty />);

			expect(screen.getByText('Start searching for repositories')).toBeInTheDocument();
			expect(
				screen.getByText('Enter a search term to find GitHub repositories')
			).toBeInTheDocument();
		});

		it('allows overriding default props', () => {
			const customTitle = 'Custom empty title';
			const customDescription = 'Custom empty description';

			renderWithProviders(
				<StateDisplay.Empty title={customTitle} description={customDescription} />
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('does not render action button by default', () => {
			renderWithProviders(<StateDisplay.Empty />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('renders action button when provided', async () => {
			const mockAction = vi.fn();
			const actionText = 'Custom Action';

			renderWithProviders(
				<StateDisplay.Empty actionText={actionText} onAction={mockAction} />
			);

			const button = screen.getByRole('button', { name: actionText });
			expect(button).toBeInTheDocument();

			await userEvent.click(button);
			expect(mockAction).toHaveBeenCalledOnce();
		});
	});

	describe('StateDisplay.Error', () => {
		it('renders default error state', () => {
			renderWithProviders(<StateDisplay.Error />);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
			expect(
				screen.getByText('An error occurred while fetching repositories. Please try again.')
			).toBeInTheDocument();
		});

		it('does not render button by default when no onAction provided', () => {
			renderWithProviders(<StateDisplay.Error />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('renders "Try Again" button when onAction is provided', async () => {
			const mockAction = vi.fn();

			renderWithProviders(<StateDisplay.Error onAction={mockAction} />);

			const button = screen.getByRole('button', { name: 'Try Again' });
			expect(button).toBeInTheDocument();

			await userEvent.click(button);
			expect(mockAction).toHaveBeenCalledOnce();
		});

		it('allows overriding default props', () => {
			const customTitle = 'Custom error title';
			const customDescription = 'Custom error description';
			const customActionText = 'Retry Now';
			const mockAction = vi.fn();

			renderWithProviders(
				<StateDisplay.Error
					title={customTitle}
					description={customDescription}
					actionText={customActionText}
					onAction={mockAction}
				/>
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: customActionText })).toBeInTheDocument();
		});

		it('does not render button when onAction is not provided', () => {
			renderWithProviders(<StateDisplay.Error onAction={undefined} />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});
	});

	describe('StateDisplay.NoResults', () => {
		it('renders default no results state', () => {
			renderWithProviders(<StateDisplay.NoResults />);

			expect(screen.getByText('No repositories found')).toBeInTheDocument();
			expect(
				screen.getByText('Try adjusting your search terms or search for something else.')
			).toBeInTheDocument();
		});

		it('allows overriding default props', () => {
			const customTitle = 'Custom no results title';
			const customDescription = 'Custom no results description';

			renderWithProviders(
				<StateDisplay.NoResults title={customTitle} description={customDescription} />
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('does not render action button by default', () => {
			renderWithProviders(<StateDisplay.NoResults />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('renders action button when provided', async () => {
			const mockAction = vi.fn();
			const actionText = 'Clear Search';

			renderWithProviders(
				<StateDisplay.NoResults actionText={actionText} onAction={mockAction} />
			);

			const button = screen.getByRole('button', { name: actionText });
			expect(button).toBeInTheDocument();

			await userEvent.click(button);
			expect(mockAction).toHaveBeenCalledOnce();
		});
	});

	describe('Common behavior', () => {
		it('renders custom icon when provided', () => {
			const customIcon = <div data-testid="custom-icon">Custom Icon</div>;

			renderWithProviders(<StateDisplay.Empty icon={customIcon} />);

			expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
		});

		it('handles missing actionText but present onAction gracefully', () => {
			const mockAction = vi.fn();

			renderWithProviders(<StateDisplay.Empty onAction={mockAction} />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('handles present actionText but missing onAction gracefully', () => {
			renderWithProviders(<StateDisplay.Empty actionText="Some Action" />);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});
	});
});
