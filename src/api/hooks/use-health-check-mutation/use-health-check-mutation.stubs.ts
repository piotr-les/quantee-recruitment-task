import { http, HttpResponse, RequestHandler, delay } from 'msw';
import { GITHUB_API_URL } from '../../axios-config';
import { HEALTH_CHECK_ENDPOINT } from './use-health-check-mutation';
import { healthCheckMutationSuccessMock } from './use-health-check-mutation.mocks';

export const healthCheckMutationStubs: RequestHandler[] = [
	http.get(`${GITHUB_API_URL}${HEALTH_CHECK_ENDPOINT}`, async () => {
		await delay(200);
		return HttpResponse.text(healthCheckMutationSuccessMock, {
			status: 200,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		});
	}),
];
