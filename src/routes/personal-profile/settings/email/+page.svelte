<script lang="ts">
	import { run } from 'svelte/legacy';

	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/auth/AuthSuccessMessage.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';
	import type { ActionData } from './$types';

	let heading = 'Please enter your new email address.';
	let caution = 'Make sure you enter the correct address. THERE IS NO WAY TO UNDO THIS.';
	let errorMessage = 'There was an error changing your email address';
	let successMessage = [
		'Your request has been submitted.',
		'Please check the mailbox of your old address for a confirmation email.'
	];

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();

	let validEmail: boolean = $state(false);
	$effect(() => {
		validEmail = false;
	});
	let canGo = $derived(validEmail);
</script>

<svelte:head>
	<title>Profile-Settings-Email</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl space-y-2 py-2">
	<div class="w-5/6 rounded bg-orange-50 p-6 text-gray-900 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 text-center text-2xl">Please enter your new email address.</h1>
		<form action="?/changeEmail" method="POST">
			<SetEmail bind:validEmail />
			<button
				type="submit"
				class="my-4 w-full rounded-full bg-orange-500 py-2 text-center text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Change Email Address
			</button>
		</form>
		{#if form?.success}
			<AuthSuccessMessage message={successMessage} />
		{:else if form?.error}
			<AuthErrorMessage message={errorMessage} />
		{/if}
	</div>
</div>
