<script lang="ts">
	import MessagesTable from '$components/form/tables/MessagesTable.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	import type { ColumnDefinition } from 'tabulator-tables';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface MessagesTableComponent {
		downloadSelected: () => void;
		clearSelection: () => void;
	}

	interface Props {
		action: string;
		isSelectionEmpty: boolean;
		currentMessages?: MessagesTableComponent;
		appMessagesColumns: ColumnDefinition[];
		appMessagesData: any[];
	}

	let {
		action,
		isSelectionEmpty = $bindable(),
		currentMessages = $bindable(),
		appMessagesColumns,
		appMessagesData
	}: Props = $props();

	let selectedIDs: string[] = $state([]);
	let selectedRows: any[] = $state([]);

	console.log('appMessagesData', appMessagesData);

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			console.log('result', result);
			if (result.type === 'success') {
				currentMessages?.clearSelection();
				await invalidateAll();
			}
		};
	};
</script>

<form method="POST" class="card bg-orange-50 p-4" {action} use:enhance={handleSubmit}>
	<div class="table-container">
		<MessagesTable
			{appMessagesColumns}
			{appMessagesData}
			bind:isSelectionEmpty
			bind:selectedIDs
			bind:selectedRows
			bind:this={currentMessages}
			downloadFileName="current_messages_report"
		/>
	</div>

	<div class="flex justify-end gap-4">
		<input type="hidden" name="revoke_ids" value={selectedIDs.join(',')} />
		<button
			type="submit"
			formaction="?/revokeMessages"
			class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isSelectionEmpty}
		>
			Revoke Selected
		</button>
	</div>
</form>
