import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './app';
import { renderWithProviders } from './test/test-utils';

describe('App', () => {
	it('renders GitHub Repository Search title and subtitle', () => {
		renderWithProviders(<App />);
		expect(screen.getByText('GitHub Repository Search')).toBeInTheDocument();
		expect(screen.getByText('Search for GitHub repositories')).toBeInTheDocument();
	});
});
