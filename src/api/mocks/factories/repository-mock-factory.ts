import type { Repository } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';

export class RepositoryMockFactory {
	private static idCounter = 1;

	private static readonly baseRepository: Repository = {
		id: 1,
		name: 'example-repo',
		full_name: 'example-user/example-repo',
		html_url: 'https://github.com/example-user/example-repo',
		description: 'An example repository for testing purposes',
		stargazers_count: 100,
		language: 'JavaScript',
		owner: {
			login: 'example-user',
			avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
		},
	};

	static create(overrides: Partial<Repository> = {}): Repository {
		const id = overrides.id ?? this.idCounter++;
		const name = overrides.name ?? `repo-${id}`;
		const ownerLogin = overrides.owner?.login ?? `user-${id}`;
		const fullName = overrides.full_name ?? `${ownerLogin}/${name}`;

		return {
			...this.baseRepository,
			...overrides,
			id,
			name,
			full_name: fullName,
			html_url: overrides.html_url ?? `https://github.com/${fullName}`,
			owner: {
				login: ownerLogin,
				avatar_url:
					overrides.owner?.avatar_url ?? `https://avatars.githubusercontent.com/u/${id}?v=4`,
			},
		};
	}

	static createWithoutDescription(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			...overrides,
			description: null,
		});
	}

	static createWithoutLanguage(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			...overrides,
			language: null,
		});
	}

	static createWithoutDescriptionAndLanguage(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			...overrides,
			description: null,
			language: null,
		});
	}

	static createWithZeroStars(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			...overrides,
			stargazers_count: 0,
		});
	}

	static createWithLargeStarCount(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			...overrides,
			stargazers_count: 1567890,
		});
	}

	static createWithLongContent(overrides: Partial<Repository> = {}): Repository {
		return this.create({
			name: 'very-long-repository-name-that-might-cause-layout-issues',
			full_name:
				'organization-with-very-long-name/very-long-repository-name-that-might-cause-layout-issues',
			description:
				'This is a very long description that might cause layout issues in the UI when displayed as it contains multiple sentences and a lot of text that could potentially wrap to multiple lines.',
			owner: {
				login: 'organization-with-very-long-name',
				avatar_url: 'https://avatars.githubusercontent.com/u/99999?v=4',
			},
			...overrides,
		});
	}

	static createMany(count: number, baseOverrides: Partial<Repository> = {}): Repository[] {
		return Array.from({ length: count }, (_, index) =>
			this.create({
				...baseOverrides,
				id: baseOverrides.id ? baseOverrides.id + index : undefined,
			})
		);
	}

	static createBatch(configs: Partial<Repository>[]): Repository[] {
		return configs.map(config => this.create(config));
	}

	static reset(): void {
		this.idCounter = 1;
	}
}
