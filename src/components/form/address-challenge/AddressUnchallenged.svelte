<script lang="ts">
	import { setUpperCase } from '$lib/svelte-actions';
	import { checkStreetAddressString, checkSuburbString } from '$lib/utility';

	import Spinner from '$components/page/Spinner.svelte';

	type Props = {
		streetaddress?: string;
		suburb?: string;
	};

	let loading = false;
	let { streetaddress = '', suburb = '' }: Props = $props();

	const canGoStreet = $derived(checkStreetAddressString(streetaddress));
	const canGoSuburb = $derived(checkSuburbString(suburb));
	const canGo = $derived(canGoStreet && canGoSuburb);
</script>

{#if loading}
	<Spinner />
{/if}

<div class="w-full rounded bg-secondary-50 px-2 py-6 text-surface-950 shadow-md sm:w-5/6 sm:p-6">
	<h1 class="text-scale-6 bg-secondary-200 text-center">
		Membership is restricted to specific Communities
	</h1>
	<p class="mb-2 text-center">
		Please enter your Street Address and Suburb to check your qualification
	</p>

	<form action="/auth/signup?/validate" method="POST">
		<input
			id="streetaddress"
			type="text"
			class="form-input w-full rounded !border !border-secondary-700 p-1 sm:p-3"
			name="streetaddress"
			required={true}
			placeholder="STREET ADDRESS"
			autocomplete="street-address"
			use:setUpperCase
			style="text-transform:uppercase"
			bind:value={streetaddress}
		/>
		<div class="mt-1">
			{#if !canGoStreet && streetaddress.length > 0}
				<div
					class="text-scale-3 m-1 rounded-lg bg-error-50 p-2 text-error-700"
					role="alert"
					aria-live="polite"
				>
					<small>The address must have a number and not use abbreviations.</small>
				</div>
			{/if}
		</div>
		<div class="mt-2 flex justify-between sm:mt-4">
			<input
				id="suburb"
				type="text"
				class="form-input !w-1/2 rounded !border !border-secondary-700 p-1 sm:p-3"
				name="suburb"
				required
				placeholder="SUBURB"
				autocomplete="address-level2"
				use:setUpperCase
				style="text-transform:uppercase"
				bind:value={suburb}
			/>
			<button
				type="submit"
				class="w-1/3 cursor-pointer rounded-full bg-secondary-500 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo}
			>
				Check
			</button>
		</div>
		{#if !canGoSuburb && suburb.length > 0}
			<div
				class="text-scale-3 m-1 rounded-lg bg-error-50 p-2 text-error-700"
				role="alert"
				aria-live="polite"
			>
				<small>The suburb must not have State or Postcode.</small>
			</div>
		{/if}
	</form>
</div>
