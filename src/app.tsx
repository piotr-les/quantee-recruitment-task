import { Container, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
				<Container maxWidth="lg">
					<Box sx={{ py: 4 }}>
						<Typography variant="h3" component="h1" gutterBottom align="center">
							GitHub Repository Search
						</Typography>
						<Typography variant="subtitle1" align="center" color="text.secondary">
							Search for GitHub repositories
						</Typography>
					</Box>
				</Container>
			</ThemeProvider>
		</QueryClientProvider>
	);
};
