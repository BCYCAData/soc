<script lang="ts">
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};

	let { form }: Props = $props();
	let email = $state();
	let password = $state();
	let errorMessage = form?.error ?? '';
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-secondary-100 p-6 text-surface-950 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-4 text-center text-2xl">Welcome Back</h1>
		<form action="?/signin" method="POST">
			<input
				id="email"
				type="email"
				class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
				name="email"
				required={true}
				placeholder="Email"
				autocomplete="email"
				bind:value={email}
			/>
			<input
				id="password"
				type="password"
				class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
				name="password"
				required={true}
				placeholder="Password"
				autocomplete="current-password"
				bind:value={password}
			/>
			<div class="mb-4 text-center">
				<a href="/auth/requestresetpassword" class="font-semibold text-orange-900 hover:underline">
					&gt&gt&gt Forgot Your Password ? &lt&lt&lt
				</a>
			</div>
			{#if errorMessage !== ''}
				<AuthErrorMessage message={errorMessage} />
			{/if}
			<button
				type="submit"
				class="text-scale-6 w-full rounded-full bg-secondary-500 py-2 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none"
			>
				Sign In
			</button>
		</form>
	</div>
	<div class="mt-6 text-surface-950">
		Not registered?
		<a
			href="/auth/signup"
			class="my-1 rounded-full bg-secondary-500 px-5 py-1 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none"
		>
			Create an Account
		</a>
	</div>
</div>
