<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { CommunityMondrookProfileData } from '$lib/types';

	interface Props {
		communityMondrookProfile: CommunityMondrookProfileData;
		communityMondrookInformationOptions?: { value: string; lable: string }[];
	}

	let { communityMondrookProfile = $bindable(), communityMondrookInformationOptions = [] }: Props =
		$props();

	let localCommunityMondrookProfile = $state({ ...communityMondrookProfile });

	$effect(() => {
		if (communityMondrookProfile) {
			Object.assign(communityMondrookProfile, localCommunityMondrookProfile);
		}
	});
</script>

<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	What Mondrook Community information would be useful to you?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityMondrookProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#each communityMondrookInformationOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="information_sheet_choices"
					type="checkbox"
					bind:group={localCommunityMondrookProfile.information_sheet_choices}
					{value}
				/>
				<label
					class="font-Poppins text-scale-6 ml-2 font-medium text-orange-900"
					for="information_sheet_choices">{lable}</label
				>
			</div>
		{/each}
	</div>

	<TextAreaInput
		headingClass="unstyled mb-1 text-scale-6 font-semibold text-surface-950"
		headingText="Is there other information which you would find useful?"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-300 sm:text-scale-5"
		nameText="other_information_sheet"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={localCommunityMondrookProfile.other_information_sheet}
	/>
{/if}
