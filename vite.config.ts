/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': '/src',
			'@api': '/src/api',
			'@api-hooks': '/src/api/hooks',
			'@components': '/src/components',
			'@mocks': '/src/api/mocks',
			'@test': '/src/test',
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
	},
});
