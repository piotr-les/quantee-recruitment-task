import type { RequestHandler } from 'msw';
import { healthCheckMutationStubs } from '../hooks/use-health-check-mutation/use-health-check-mutation.stubs';

export const handlers: RequestHandler[] = [...healthCheckMutationStubs];
