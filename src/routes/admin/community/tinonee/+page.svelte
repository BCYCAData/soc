<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();

	let { tinoneeAdminData } = $derived(data);
	async function sendMailchimpEmail(event: SubmitEvent) {
		event.preventDefault();
		try {
			const response = await fetch('/api/emails/mailchimp', {
				method: 'GET'
			});
			// Handle response from server here
		} catch (err) {
			console.error('Error', err);
		}
	}
</script>

<svelte:head>
	<title>External Community Administration</title>
</svelte:head>

<div>
	<h1>This will probably contain information about how to use the contained pages</h1>
	<form onsubmit={sendMailchimpEmail}>
		<button
			type="submit"
			class="mt-4 w-1/4 rounded-full bg-orange-500 py-2 text-center text-base text-stone-100 hover:bg-orange-700 focus:outline-none"
		>
			Send Email to Selected
		</button>
	</form>
</div>
