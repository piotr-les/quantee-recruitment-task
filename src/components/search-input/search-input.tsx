import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export interface SearchInputProps {
	onQueryChange: (query: string) => void;
	defaultValue: string;
	placeholder?: string;
	debounceMs?: number;
}

export const SearchInput = ({
	onQueryChange,
	placeholder = 'Search repositories...',
	debounceMs = 500,
	defaultValue,
}: SearchInputProps) => {
	const [inputValue, setInputValue] = useState(defaultValue ?? '');

	useEffect(() => {
		const timer = setTimeout(() => {
			onQueryChange(inputValue.trim());
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [inputValue, onQueryChange, debounceMs]);

	return (
		<TextField
			fullWidth
			label="Search repositories"
			placeholder={placeholder}
			value={inputValue}
			onChange={e => setInputValue(e.target.value)}
		/>
	);
};
