import { Button, Box, Alert, Typography, CircularProgress } from '@mui/material';
import Error from '@mui/icons-material/Error';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useHealthCheckMutation } from '../../api/hooks/use-health-check-mutation/use-health-check-mutation';

const LoadingState = () => (
	<Box display="flex" justifyContent="center" sx={{ py: 2 }}>
		<CircularProgress data-testid="loading-spinner" />
	</Box>
);

const SuccessState = ({ message }: { message: string }) => (
	<Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }} data-testid="success-alert">
		<Typography variant="body1">✅ GitHub API connection successful!</Typography>
		<Typography variant="body2" color="text.secondary">
			Zen message: "{message}"
		</Typography>
	</Alert>
);

const ErrorState = ({ errorMessage }: { errorMessage: string }) => (
	<Alert severity="error" icon={<Error />} sx={{ mb: 2 }} data-testid="error-alert">
		<Typography variant="body1">❌ GitHub API connection failed: {errorMessage}</Typography>
	</Alert>
);

export const HealthCheck = () => {
	const { mutate, isPending, isSuccess, isError, error, data } = useHealthCheckMutation();

	const handleHealthCheck = () => mutate();

	const buttonText = isPending ? 'Testing API...' : 'Test GitHub API Connection';

	return (
		<Box sx={{ textAlign: 'center', py: 2 }}>
			<Button
				variant="contained"
				onClick={handleHealthCheck}
				disabled={isPending}
				sx={{ mb: 2 }}
				data-testid="health-check-button">
				{buttonText}
			</Button>

			{isPending && <LoadingState />}

			{isSuccess && data && <SuccessState message={data.message} />}

			{isError && <ErrorState errorMessage={error?.message} />}
		</Box>
	);
};
