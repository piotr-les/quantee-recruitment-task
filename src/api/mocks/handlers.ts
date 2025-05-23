import type { RequestHandler } from 'msw';
import { healthCheckMutationStub } from '@api-hooks/use-health-check-mutation/use-health-check-mutation.stub';
import { searchRepositoriesQueryStub } from '@api-hooks/use-search-repositories-query/use-search-repositories-query.stub';

export const handlers: RequestHandler[] = [
	healthCheckMutationStub,
	searchRepositoriesQueryStub,
];
