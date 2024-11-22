<script lang="ts">
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';

	interface Props {
		message: string;
		messageContext: string;
	}

	let { message = $bindable(), messageContext = $bindable() }: Props = $props();
</script>

<div class="flex items-center">
	<label class="flex flex-grow flex-col items-start">
		<p>Enter the message here:</p>
		<input
			class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
			name="inputMessage"
			type="text"
			placeholder="Message"
			bind:value={message}
		/>
	</label>
	<EnumOptionSelect bind:messageContext header="Pick a context:" />
</div>
<div class="mt-2">
	<p class="text-sm text-gray-600">Message will appear in: {messageContext}</p>
</div>
