import { join } from 'path';
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import socTheme from './src/soc-theme'

/** @type {import('tailwindcss').Config} \*/
export default {
    darkMode:'selector',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton-svelte'), '../**/*.{html,js,svelte,ts}')
    ],
    theme: {
        extend: {},
    },
    plugins: [
        skeleton({
            themes: [ themes.pine, themes.catppuccin, themes.rose, socTheme ]
        })
    ]
}