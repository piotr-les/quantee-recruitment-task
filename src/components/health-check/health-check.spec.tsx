import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/test-utils';
import { HealthCheck } from './health-check';

describe('HealthCheck', () => {
	it('renders health check button', () => {
		renderWithProviders(<HealthCheck />);

		expect(screen.getByTestId('health-check-button')).toBeInTheDocument();
		expect(screen.getByText('Test GitHub API Connection')).toBeInTheDocument();
	});

	it('shows loading state when button is clicked', async () => {
		renderWithProviders(<HealthCheck />);

		const button = screen.getByTestId('health-check-button');
		await userEvent.click(button);

		expect(await screen.findByText('Testing API...')).toBeInTheDocument();
		expect(button).toBeDisabled();
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});

	it('shows success message when API call succeeds', async () => {
		renderWithProviders(<HealthCheck />);

		const button = screen.getByTestId('health-check-button');
		await userEvent.click(button);

		await screen.findByTestId('success-alert');

		expect(screen.getByText('✅ GitHub API connection successful!')).toBeInTheDocument();
		expect(screen.getByText(/Practicality beats purity./)).toBeInTheDocument();
	});
});
