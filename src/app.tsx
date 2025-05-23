import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SearchPage } from './pages/search-page';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

export const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SearchPage />
			</ThemeProvider>
		</QueryClientProvider>
	);
};
