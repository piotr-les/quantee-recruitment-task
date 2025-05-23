import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

const createTestQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
};

interface TestWrapperProps {
	children: ReactNode;
	queryClient?: QueryClient;
}

const TestWrapper = ({ children, queryClient }: TestWrapperProps) => {
	const client = queryClient || createTestQueryClient();

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	queryClient?: QueryClient;
}

export const renderWithProviders = (ui: ReactElement, options?: CustomRenderOptions) => {
	const { queryClient, ...renderOptions } = options || {};

	const Wrapper = ({ children }: { children: ReactNode }) => (
		<TestWrapper queryClient={queryClient}>{children}</TestWrapper>
	);

	return render(ui, { wrapper: Wrapper, ...renderOptions });
};
