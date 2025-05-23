import type { SearchRepositoriesResponse } from './use-search-repositories-query';

export const mockRepository = {
	id: 1,
	name: 'react',
	full_name: 'facebook/react',
	html_url: 'https://github.com/facebook/react',
	description: 'The library for web and native user interfaces.',
	stargazers_count: 220000,
	language: 'JavaScript',
	owner: {
		login: 'facebook',
		avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
	},
};

export const searchRepositoriesQuerySuccessMock: SearchRepositoriesResponse = {
	total_count: 65,
	incomplete_results: false,
	items: [
		mockRepository,
		{
			id: 2,
			name: 'vue',
			full_name: 'vuejs/vue',
			html_url: 'https://github.com/vuejs/vue',
			description:
				'This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core',
			stargazers_count: 210000,
			language: 'TypeScript',
			owner: {
				login: 'vuejs',
				avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
			},
		},
	],
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
		{
			id: 3,
			name: 'angular',
			full_name: 'angular/angular',
			html_url: 'https://github.com/angular/angular',
			description: 'Deliver web apps with confidence',
			stargazers_count: 95000,
			language: 'TypeScript',
			owner: {
				login: 'angular',
				avatar_url: 'https://avatars.githubusercontent.com/u/139426?v=4',
			},
		},
	],
};
