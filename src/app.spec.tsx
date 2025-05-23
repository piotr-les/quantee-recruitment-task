import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
	it('renders without crashing', () => {
		render(<App />);
		expect(screen.getByText('Initial content')).toBeInTheDocument();
	});
});
