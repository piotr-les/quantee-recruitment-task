import { Card, CardContent, Box, Skeleton, Stack } from '@mui/material';

export const RepositoryItemSkeleton = () => {
	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
					<Skeleton variant="circular" width={48} height={48} />

					<Box sx={{ flex: 1 }}>
						<Skeleton variant="text" width="60%" height={32} />

						<Skeleton variant="text" width="85%" height={24} sx={{ mt: 1 }} />

						<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
							<Skeleton variant="text" width={80} height={20} />
							<Skeleton variant="text" width={100} height={20} />
						</Stack>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};
