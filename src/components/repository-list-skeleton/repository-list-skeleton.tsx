import { Box } from '@mui/material';
import { RepositoryItemSkeleton } from '@components/repository-item-skeleton/repository-item-skeleton';

export interface RepositoryListSkeletonProps {
	count?: number;
}

export const RepositoryListSkeleton = ({ count = 5 }: RepositoryListSkeletonProps) => {
	const items = Array(count).fill(null);

	return (
		<Box sx={{ mt: 3 }} data-testid="repository-list-skeleton">
			{items.map((_, index) => (
				<RepositoryItemSkeleton key={index} />
			))}
		</Box>
	);
};
