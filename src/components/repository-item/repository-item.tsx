import { Card, CardContent, Box, Typography, Avatar, Stack, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { Repository } from '@api-hooks/use-search-repositories-query/use-search-repositories-query';

export interface RepositoryItemProps {
	repository: Repository;
}

export const RepositoryItem = ({ repository }: RepositoryItemProps) => {
	return (
		<Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
			<CardContent>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
					<Avatar
						src={repository.owner.avatar_url}
						alt={repository.owner.login}
						sx={{ width: 48, height: 48 }}
					/>

					<Box sx={{ flex: 1 }}>
						<Typography
							variant="h6"
							component="a"
							href={repository.html_url}
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								textDecoration: 'none',
								color: 'primary.main',
								'&:hover': { textDecoration: 'underline' },
							}}>
							{repository.full_name}
						</Typography>

						{repository.description ? (
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
								{repository.description}
							</Typography>
						) : null}

						<Stack direction="row" spacing={2} alignItems="center">
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
								<StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
								<Typography variant="body2" color="text.secondary">
									{repository.stargazers_count.toLocaleString()}
								</Typography>
							</Box>

							{repository.language ? (
								<Chip label={repository.language} size="small" variant="outlined" />
							) : null}
						</Stack>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};
