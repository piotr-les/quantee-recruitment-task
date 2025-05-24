import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { SearchInput } from './search-input';

const FAST_DEBOUNCE = 50;
const SLOW_DEBOUNCE = 150;
const WAIT_TIMEOUT = SLOW_DEBOUNCE + 50;

describe('SearchInput', () => {
	const mockOnQueryChange = vi.fn();

	afterAll(() => {
		vi.resetAllMocks();
	});

	describe('Core Debounce Logic', () => {
		it('debounces user input with default timing', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			await userEvent.type(input, 'react');

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenLastCalledWith('react');
			});
		});

		it('respects custom debounce delay configuration', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={SLOW_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'vue' } });

			await new Promise(resolve => setTimeout(resolve, FAST_DEBOUNCE));
			expect(mockOnQueryChange).not.toHaveBeenCalledWith('vue');

			await waitFor(
				() => {
					expect(mockOnQueryChange).toHaveBeenLastCalledWith('vue');
				},
				{ timeout: WAIT_TIMEOUT }
			);
		});

		it('cancels previous debounce timer when new input received', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={SLOW_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');

			fireEvent.change(input, { target: { value: 'first' } });
			await new Promise(resolve => setTimeout(resolve, FAST_DEBOUNCE));
			fireEvent.change(input, { target: { value: 'final' } });

			await waitFor(
				() => {
					expect(mockOnQueryChange).toHaveBeenLastCalledWith('final');
				},
				{ timeout: WAIT_TIMEOUT }
			);

			expect(mockOnQueryChange).not.toHaveBeenCalledWith('first');
		});

		it('initializes by calling callback with empty string', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenCalledWith('');
			});
		});
	});

	describe('Input Data Handling', () => {
		it('processes input clearing to empty string', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			await userEvent.type(input, 'test');

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenLastCalledWith('test');
			});

			await userEvent.clear(input);

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenLastCalledWith('');
			});
		});

		it('handles special characters in input', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			const specialInput = 'test@#$%^&*()';

			await userEvent.type(input, specialInput);

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenLastCalledWith(specialInput);
			});
		});

		it('handles whitespace-only input', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			await userEvent.type(input, '   ');

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenCalledWith('');
			});
		});

		it('handles whitespace wrapped input', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			await userEvent.type(input, '  abc  ');

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenCalledWith('abc');
			});
		});

		it('handles very long input strings', async () => {
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={FAST_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			const longInput = 'a'.repeat(1000);

			fireEvent.change(input, { target: { value: longInput } });

			await waitFor(() => {
				expect(mockOnQueryChange).toHaveBeenCalledWith(longInput);
			});
		});
	});

	describe('Props Configuration', () => {
		it('accepts and uses custom placeholder text', () => {
			const customPlaceholder = 'Find repositories...';
			renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} placeholder={customPlaceholder} />
			);

			expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
		});

		it('uses default placeholder when none provided', () => {
			renderWithProviders(<SearchInput onQueryChange={mockOnQueryChange} />);

			expect(screen.getByPlaceholderText('Search repositories...')).toBeInTheDocument();
		});
	});

	describe('Error Handling & Cleanup', () => {
		it('continues functioning when callback throws error', async () => {
			const errorCallback = vi.fn().mockImplementation(() => {
				throw new Error('Callback error');
			});

			expect(() => {
				renderWithProviders(
					<SearchInput onQueryChange={errorCallback} debounceMs={FAST_DEBOUNCE} />
				);
			}).not.toThrow();

			const input = screen.getByRole('textbox');

			expect(() => {
				fireEvent.change(input, { target: { value: 'test' } });
			}).not.toThrow();
		});

		it('cleans up pending timers on component unmount', () => {
			const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

			const { unmount } = renderWithProviders(
				<SearchInput onQueryChange={mockOnQueryChange} debounceMs={SLOW_DEBOUNCE} />
			);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'test' } });

			unmount();

			expect(clearTimeoutSpy).toHaveBeenCalled();
			clearTimeoutSpy.mockRestore();
		});
	});
});
