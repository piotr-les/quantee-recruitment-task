import { Container, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export const App = () => {
	return (
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
	);
};
