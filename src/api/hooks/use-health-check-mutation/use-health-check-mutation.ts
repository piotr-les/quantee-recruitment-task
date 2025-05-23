import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { githubApi } from '@api/axios-config';

export interface HealthCheckResponse {
	message: string;
}

export interface HealthCheckError {
	message: string;
	status?: number;
}

export const HEALTH_CHECK_ENDPOINT = '/zen' as const;

export const HEALTH_CHECK_MUTATION_KEY = 'healthCheck' as const;

const healthCheckMutationFn = async (): Promise<HealthCheckResponse> => {
	const { data } = await githubApi.get<string>(HEALTH_CHECK_ENDPOINT);

	return { message: data };
};

export const useHealthCheckMutation = (): UseMutationResult<
	HealthCheckResponse,
	HealthCheckError,
	void
> => {
	return useMutation({
		mutationKey: [HEALTH_CHECK_MUTATION_KEY],
		mutationFn: healthCheckMutationFn,
	});
};
