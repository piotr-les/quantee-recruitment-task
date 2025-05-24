import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '@test/test-utils';
import { RepositoryItem } from './repository-item';
import { RepositoryMockFactory } from '@mocks/factories/repository-mock-factory';

describe('RepositoryItem', () => {
	beforeEach(() => {
		RepositoryMockFactory.reset();
	});

	describe('Repository link', () => {
		it('renders repository name as clickable external link', () => {
			const repository = RepositoryMockFactory.create({
				full_name: 'facebook/react',
				html_url: 'https://github.com/facebook/react',
			});

			renderWithProviders(<RepositoryItem repository={repository} />);

			const link = screen.getByTestId('repository-full-name');
			expect(link).toHaveTextContent('facebook/react');
			expect(link).toHaveAttribute('href', 'https://github.com/facebook/react');
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Owner avatar', () => {
		it('displays owner avatar with correct src and alt attributes', () => {
			const repository = RepositoryMockFactory.create({
				owner: {
					login: 'facebook',
					avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
				},
			});

			renderWithProviders(<RepositoryItem repository={repository} />);

			const avatar = screen.getByTestId('repository-owner-avatar').firstChild;
			expect(avatar).toHaveAttribute(
				'src',
				'https://avatars.githubusercontent.com/u/69631?v=4'
			);
			expect(avatar).toHaveAttribute('alt', 'facebook');
		});
	});

	describe('Repository description', () => {
		it('displays description when present', () => {
			const repository = RepositoryMockFactory.create({
				description: 'A JavaScript library for building user interfaces',
			});

			renderWithProviders(<RepositoryItem repository={repository} />);

			expect(screen.getByTestId('repository-description')).toHaveTextContent(
				'A JavaScript library for building user interfaces'
			);
		});

		it('does not render description element when description is null', () => {
			const repository = RepositoryMockFactory.createWithoutDescription();

			renderWithProviders(<RepositoryItem repository={repository} />);

			expect(screen.queryByTestId('repository-description')).not.toBeInTheDocument();
		});
	});

	describe('Stars count', () => {
		it('formats star counts correctly for different numbers', () => {
			const testCases = [
				{ count: 0, expected: '0' },
				{ count: 1234, expected: '1234' },
				{ count: 12345, expected: '12 345' },
				{ count: 1567890, expected: '1 567 890' },
			];

			testCases.forEach(({ count, expected }) => {
				const repository = RepositoryMockFactory.create({ stargazers_count: count });
				const { unmount } = renderWithProviders(<RepositoryItem repository={repository} />);

				expect(screen.getByTestId('repository-stars')).toHaveTextContent(expected);
				unmount();
			});
		});

		describe('Programming language', () => {
			it('displays language as chip when present', () => {
				const repository = RepositoryMockFactory.create({
					language: 'TypeScript',
				});

				renderWithProviders(<RepositoryItem repository={repository} />);

				expect(screen.getByTestId('repository-language')).toHaveTextContent('TypeScript');
			});

			it('does not render language chip when language is null', () => {
				const repository = RepositoryMockFactory.createWithoutLanguage();

				renderWithProviders(<RepositoryItem repository={repository} />);

				expect(screen.queryByTestId('repository-language')).not.toBeInTheDocument();
			});
		});

		describe('Edge cases', () => {
			it('handles repository with only required fields', () => {
				const repository = RepositoryMockFactory.createWithoutDescriptionAndLanguage({
					full_name: 'user/minimal-repo',
					stargazers_count: 1,
				});

				renderWithProviders(<RepositoryItem repository={repository} />);

				expect(screen.getByTestId('repository-full-name')).toHaveTextContent(
					'user/minimal-repo'
				);
				expect(screen.getByTestId('repository-stars')).toHaveTextContent('1');
				expect(screen.getByTestId('repository-owner-avatar')).toBeInTheDocument();
				expect(screen.queryByTestId('repository-description')).not.toBeInTheDocument();
				expect(screen.queryByTestId('repository-language')).not.toBeInTheDocument();
			});
		});
	});
});
