import { RepositoryMockFactory } from '@/api/mocks/factories/repository-mock-factory';
import type { SearchRepositoriesResponse } from './use-search-repositories-query';

export const mockRepository = RepositoryMockFactory.create({
	id: 1,
	name: 'react',
	full_name: 'facebook/react',
	description: 'The library for web and native user interfaces.',
	stargazers_count: 220000,
	language: 'JavaScript',
	owner: {
		login: 'facebook',
		avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
	},
});

export const mockRepositoryWithoutDescription = RepositoryMockFactory.createWithoutDescription(
	{
		id: 2,
		name: 'vue',
		full_name: 'vuejs/vue',
		stargazers_count: 210000,
		language: 'TypeScript',
		owner: {
			login: 'vuejs',
			avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
		},
	}
);

export const mockRepositoryWithoutLanguage = RepositoryMockFactory.createWithoutLanguage({
	id: 3,
	name: 'awesome-list',
	full_name: 'sindresorhus/awesome',
	description: 'Awesome lists about all kinds of interesting topics',
	stargazers_count: 180000,
	owner: {
		login: 'sindresorhus',
		avatar_url: 'https://avatars.githubusercontent.com/u/170270?v=4',
	},
});

export const mockRepositoryWithoutDescriptionAndLanguage =
	RepositoryMockFactory.createWithoutDescriptionAndLanguage({
		id: 4,
		name: 'empty-repo',
		full_name: 'testuser/empty-repo',
		stargazers_count: 5,
		owner: {
			login: 'testuser',
			avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
		},
	});

export const mockRepositoryWithZeroStars = RepositoryMockFactory.createWithZeroStars({
	id: 5,
	name: 'new-project',
	full_name: 'newdev/new-project',
	description: 'A brand new project just starting out',
	language: 'Python',
	owner: {
		login: 'newdev',
		avatar_url: 'https://avatars.githubusercontent.com/u/54321?v=4',
	},
});

export const mockRepositoryWithLargeStarCount = RepositoryMockFactory.createWithLargeStarCount(
	{
		id: 6,
		name: 'popular-lib',
		full_name: 'microsoft/vscode',
		description: 'Visual Studio Code',
		language: 'TypeScript',
		owner: {
			login: 'microsoft',
			avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
		},
	}
);

export const mockRepositoryWithLongNames = RepositoryMockFactory.createWithLongContent({
	id: 7,
	stargazers_count: 42,
	language: 'JavaScript',
});

export const searchRepositoriesQuerySuccessMock: SearchRepositoriesResponse = {
	total_count: 65,
	incomplete_results: false,
	items: [mockRepository, mockRepositoryWithoutDescription],
};

export const searchRepositoriesQueryEmptyMock: SearchRepositoriesResponse = {
	total_count: 0,
	incomplete_results: false,
	items: [],
};

export const searchRepositoriesQueryPage2Mock: SearchRepositoriesResponse = {
	total_count: 65,
	incomplete_results: false,
	items: [
		RepositoryMockFactory.create({
			id: 8,
			name: 'angular',
			full_name: 'angular/angular',
			description: 'Deliver web apps with confidence',
			stargazers_count: 95000,
			language: 'TypeScript',
			owner: {
				login: 'angular',
				avatar_url: 'https://avatars.githubusercontent.com/u/139426?v=4',
			},
		}),
	],
};

export const searchRepositoriesQueryIncompleteDataMock: SearchRepositoriesResponse = {
	total_count: 7,
	incomplete_results: false,
	items: [
		mockRepositoryWithoutDescription,
		mockRepositoryWithoutLanguage,
		mockRepositoryWithoutDescriptionAndLanguage,
		mockRepositoryWithZeroStars,
		mockRepositoryWithLargeStarCount,
		mockRepositoryWithLongNames,
	],
};
