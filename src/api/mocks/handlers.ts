import type { RequestHandler } from 'msw';
import { healthCheckMutationStubs } from '@api-hooks/use-health-check-mutation/use-health-check-mutation.stubs';

export const handlers: RequestHandler[] = [...healthCheckMutationStubs];
