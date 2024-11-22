<script lang="ts">
	import MessageInput from '$components/form/inputs/MessageInput.svelte';

	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	// Types
	interface Props {
		data: PageData;
	}

	// Props
	let { data }: Props = $props();

	// State Management
	let message = $state('');
	let messageContext = $state('both');
	let haveMessage = $state(false);

	// Effects
	$effect(() => {
		const words = message.trim().split(/\s+/);
		haveMessage = message.length > 4 && words.length > 1;
	});

	const handleSubmit: SubmitFunction = ({ formData, action }) => {
		console.log('Client: Submitting form to:', action);
		console.log('Client: Form data:', Object.fromEntries(formData));

		return async ({ result }) => {
			console.log('Client: Received result:', result);
		};
	};
</script>

<form
	method="POST"
	class="card bg-orange-50 p-4"
	action="?/sendMessageToAllUsers"
	use:enhance={handleSubmit}
>
	<MessageInput {message} {messageContext} />
	<input type="hidden" name="message" value={message} />
	<input type="hidden" name="messageContext" value={messageContext} />
	<button
		type="submit"
		class="rounded-md border border-transparent bg-tertiary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
	>
		Send Message
	</button>
</form>
