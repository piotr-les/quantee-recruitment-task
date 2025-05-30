import { Alert, Button, Snackbar } from '@mui/material';
import type { RefetchOptions } from '@tanstack/react-query';

export interface ErrorAlertProps {
	isError: boolean;
	refetch: (options?: RefetchOptions) => void;
}

export const ErrorAlert = ({ isError, refetch }: ErrorAlertProps) => {
	return (
		<Snackbar
			open={isError}
			autoHideDuration={5000}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
			<Alert
				severity="error"
				action={
					<Button color="inherit" size="small" onClick={() => refetch()}>
						Try Again
					</Button>
				}>
				Failed to load repositories. Please try again.
			</Alert>
		</Snackbar>
	);
};
