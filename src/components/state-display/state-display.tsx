import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InboxIcon from '@mui/icons-material/Inbox';
import { type ReactNode } from 'react';

export interface StateDisplayProps {
	title?: string;
	description?: string;
	icon?: ReactNode;
	actionText?: string;
	onAction?: () => void;
}

const StateDisplayBase = ({
	title,
	description,
	icon,
	actionText,
	onAction,
}: StateDisplayProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 8,
				textAlign: 'center',
			}}>
			<Box
				sx={{
					fontSize: 80,
					color: 'text.secondary',
					mb: 2,
					opacity: 0.6,
				}}>
				{icon}
			</Box>
			<Typography variant="h5" component="h2" gutterBottom color="text.primary">
				{title}
			</Typography>
			<Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
				{description}
			</Typography>
			{actionText && onAction ? (
				<Button variant="outlined" onClick={onAction}>
					{actionText}
				</Button>
			) : null}
		</Box>
	);
};

const Empty = (props: StateDisplayProps) => (
	<StateDisplayBase
		title="Start searching for repositories"
		description="Enter a search term to find GitHub repositories"
		icon={<SearchIcon sx={{ fontSize: 'inherit' }} />}
		{...props}
	/>
);

const Error = (props: StateDisplayProps) => (
	<StateDisplayBase
		title="Something went wrong"
		description="An error occurred while fetching repositories. Please try again."
		icon={<ErrorOutlineIcon sx={{ fontSize: 'inherit' }} />}
		actionText="Try Again"
		{...props}
	/>
);

const NoResults = (props: StateDisplayProps) => (
	<StateDisplayBase
		title="No repositories found"
		description="Try adjusting your search terms or search for something else."
		icon={<InboxIcon sx={{ fontSize: 'inherit' }} />}
		{...props}
	/>
);

export const StateDisplay = {
	Empty,
	Error,
	NoResults,
};
