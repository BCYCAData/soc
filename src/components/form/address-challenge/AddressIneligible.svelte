<script lang="ts">
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	type Props = {
		streetaddress: string;
		suburb: string;
	};

	let { streetaddress, suburb }: Props = $props();

	const searchAddress = `${streetaddress}, ${suburb}`;
	const encodedRef = encodeURIComponent(`SOC Address not eligible: '${searchAddress}'`);
	let subjectUrl = $derived(`mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`);
</script>

<div class="text-center">
	<div class="mt-1 rounded-lg bg-error-50" aria-live="polite" role="alert">
		<p class="text-scale-5 m-1 text-center font-semibold">
			Unfortunately {searchAddress}
		</p>
		<p class="m-1 text-center">
			is not part of any of the communities we are engaging with at the moment.
		</p>
		<p>If you would like more information:</p>
	</div>

	<div class="mt-5">
		<a
			class="text-scale-4 mt-5 max-w-80 cursor-pointer space-y-3 rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 hover:bg-secondary-500 hover:underline sm:max-w-96 md:max-w-full"
			href={subjectUrl}
			rel="noopener noreferrer">Tap here to send us an email</a
		>
	</div>
</div>
