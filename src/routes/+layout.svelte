<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import Footer from '$components/page/Footer.svelte';
	import Navbar from '$components/page/navigation/Navbar.svelte';

	import '../app.postcss';

	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: any;
	}

	let { data, children }: Props = $props();
	let { session, supabase } = data;

	let isDarkMode = false;

	onMount(() => {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			isDarkMode = true;
			document.documentElement.classList.add('dark');
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			isDarkMode = e.matches;
			if (isDarkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
		const { data: authData } = supabase.auth.onAuthStateChange((_: any, newSession: any) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => authData.subscription.unsubscribe();
	});
</script>

<div class="app-container flex h-screen flex-col">
	<Navbar />
	<main class="flex-1 overflow-y-auto">
		{@render children?.()}
	</main>
	<Footer />
</div>

<style lang="postcss">
	:global(html, body) {
		@apply m-0 h-full p-0;
	}
</style>
