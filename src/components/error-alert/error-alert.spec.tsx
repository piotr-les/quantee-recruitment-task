import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { ErrorAlert } from './error-alert';

describe('ErrorAlert', () => {
	const mockRefetch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders when isError is true', () => {
		renderWithProviders(<ErrorAlert isError={true} refetch={mockRefetch} />);

		expect(
			screen.getByText('Failed to load repositories. Please try again.')
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
	});

	it('does not render when isError is false', () => {
		renderWithProviders(<ErrorAlert isError={false} refetch={mockRefetch} />);

		expect(
			screen.queryByText('Failed to load repositories. Please try again.')
		).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
	});

	it('calls refetch when Try Again button is clicked', async () => {
		renderWithProviders(<ErrorAlert isError={true} refetch={mockRefetch} />);

		const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
		await userEvent.click(tryAgainButton);

		expect(mockRefetch).toHaveBeenCalledOnce();
	});
});
