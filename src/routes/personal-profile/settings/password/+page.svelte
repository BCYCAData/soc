<script lang="ts">
	import { run } from 'svelte/legacy';

	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/auth/AuthSuccessMessage.svelte';
	import SetPassword from '$components/form/auth/SetPassword.svelte';
	import type { ActionData } from './$types';

	let heading = 'Please enter your new password.';
	let errorMessage = 'There was an error changing your password';
	let successMessage = ['Your password has been changed'];

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();

	let validPassword: boolean = $state(false);
	$effect(() => {
		validPassword = false;
	});
	let canGo = $derived(validPassword);
</script>

<svelte:head>
	<title>Profile-Settings-Password</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl space-y-2 py-2">
	<div class="w-5/6 rounded bg-orange-50 p-6 text-gray-900 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 text-center text-2xl">{heading}</h1>
		<form action="?/resetPassword" method="POST">
			<SetPassword bind:validPassword />
			<button
				type="submit"
				class="my-4 w-full rounded-full bg-orange-500 py-2 text-center text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Update Password
			</button>
		</form>
		{#if form?.success}
			<AuthSuccessMessage message={successMessage} />
		{:else if form?.error}
			<AuthErrorMessage message={errorMessage} />
		{/if}
	</div>
</div>
