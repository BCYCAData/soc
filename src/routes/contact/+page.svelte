<script lang="ts">
	import { page } from '$app/stores';

	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	const reference: string = $page.url.searchParams.get('subject') ?? '';
	const subjectText: string = `subject=${encodeURIComponent(reference)}`;
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<section class="container mx-auto flex h-full max-w-3xl flex-col items-center">
	{#if reference?.startsWith('SOC Address not found:')}
		<header class="text-center">
			<h1 class="mt-5">{reference}</h1>
		</header>
		<div class="mt-5">
			<a
				class="text-scale-4 mt-5 max-w-80 cursor-pointer space-y-3 rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 hover:underline"
				href="mailto:{PUBLIC_CONTACT_EMAIL}?{subjectText}">Tap here to send us an email</a
			>
		</div>
	{:else}
		<div class="text-center">
			<h3>If you want to be more involved</h3>
			<h3>please call</h3>
			<div class="mt-5">
				<h4>
					<span class="text-scale-6 text-orange-600">Helen</span>
					<span>on</span>
					<span>0424 515 963</span>
				</h4>
				<h3>or</h3>
				<h4>
					<span class="text-scale-6 text-orange-600">Christine</span>
					<span>on</span>
					<span>0488 288 661</span>
				</h4>
			</div>

			<h1
				class=" text-scale-4 mt-5 max-w-80 cursor-pointer rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 no-underline hover:underline"
			>
				<span>
					<a
						aria-label="Send us an email about the SOC address not found"
						class="text-scale-4 mt-5 max-w-80 cursor-pointer space-y-3 rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 hover:underline"
						href="mailto:{PUBLIC_CONTACT_EMAIL}?{subjectText}"
					>
						Tap here to send us an email
					</a>
				</span>
			</h1>
		</div>
	{/if}
</section>
