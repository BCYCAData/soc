<script>
	import Footer from '$components/page/Footer.svelte';
	import Navbar from '$components/page/navigation/Navbar.svelte';
	import '../app.postcss';
	import { onMount } from 'svelte';

	let isDarkMode = false;

	onMount(() => {
		// Check for user's preferred color scheme
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			isDarkMode = true;
			document.documentElement.classList.add('dark');
		}

		// Listen for changes in color scheme preference
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			isDarkMode = e.matches;
			if (isDarkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	});
</script>

<div class="app-container">
	<Navbar />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style lang="postcss">
	:global(html, body) {
		@apply m-0 h-full p-0;
	}

	.app-container {
		@apply flex min-h-full flex-col;
	}

	.fixed-header {
		@apply fixed left-0 right-0 top-0 z-10 bg-surface-100 dark:bg-surface-800;
	}

	.fixed-header nav {
		@apply flex items-center justify-between;
	}

	.fixed-header ul {
		@apply m-0 flex list-none gap-4 p-0;
	}

	main {
		@apply mb-16 mt-16 flex-grow p-4; /* Adjust mt-16 and mb-16 based on your header/footer height */
	}

	.fixed-footer {
		@apply fixed bottom-0 left-0 right-0 bg-primary-600 p-4 text-center dark:bg-surface-800;
	}
</style>
