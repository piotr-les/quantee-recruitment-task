import axios from 'axios';

export const GITHUB_API_URL = 'https://api.github.com';

export const githubApi = axios.create({
	baseURL: GITHUB_API_URL,
	timeout: 10000,
	headers: {
		Accept: 'application/vnd.github.v3+json',
	},
});

githubApi.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 403) {
			console.warn('GitHub API rate limit exceeded');
		}
		return Promise.reject(error);
	}
);
