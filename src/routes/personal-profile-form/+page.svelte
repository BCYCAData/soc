<script lang="ts">
	import PersonalProfileFormContainer from '$components/form/personal-emergency-profile/PersonalProfileFormContainer.svelte';
	import ProgressBar from '$components/form/ProgressBar.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let currentActive = $state(1);
	let progressBar: ProgressBar | undefined = $state();

	const {
		steps,
		propertyId,
		communityName,
		propertyAddress,
		propertyWasRented,
		property_profile: propertyProfile,
		property_agent: propertyAgent,
		userProfile,
		user_postal_address: userPostalAddress,
		community_bcyca_profile: communityBCYCAProfile,
		community_tinonee_profile: communityTinoneeProfile,
		community_mondrook_profile: communityMondrookProfile,
		community_external_profile: communityExternalProfile,
		optionsData
	} = data;

	const handleProgress = (stepIncrement: number) => {
		progressBar?.handleProgress(stepIncrement);
	};

	const skipTo = (
		e:
			| (MouseEvent & { currentTarget: EventTarget & HTMLDivElement })
			| (KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement })
			| CustomEvent<any>
	) => {
		progressBar?.skipTo(e);
	};
</script>

<svelte:head>
	<title>Personal Profile Form</title>
</svelte:head>

<div class="mx-auto flex h-full w-full justify-center bg-secondary-50 text-surface-950">
	<div class="mb-5 bg-secondary-100 sm:w-11/12">
		<PersonalProfileFormContainer
			active_step={steps[currentActive - 1].index}
			{propertyId}
			{communityName}
			{propertyAddress}
			{propertyWasRented}
			{propertyProfile}
			{propertyAgent}
			{userProfile}
			{userPostalAddress}
			{communityBCYCAProfile}
			{communityTinoneeProfile}
			{communityMondrookProfile}
			{communityExternalProfile}
			{optionsData}
		/>
		<div class="mx-auto pt-0 sm:w-8/12">
			<ProgressBar
				{steps}
				bind:currentActive
				bind:this={progressBar}
				on:click={(e: CustomEvent<any>) => {
					skipTo(e);
				}}
			/>
			<div class="mt-1 text-center">
				<button
					class="scale 98 rounded-xl bg-secondary-500 px-[20px] py-[6px] text-secondary-50 focus:outline-none active:transform disabled:cursor-not-allowed disabled:bg-slate-300"
					onclick={() => handleProgress(-1)}
					disabled={currentActive == 1}
				>
					Prev
				</button>
				<button
					class="scale 98 rounded-xl bg-secondary-500 px-[20px] py-[6px] text-secondary-50 focus:outline-none active:transform disabled:cursor-not-allowed disabled:bg-slate-300"
					onclick={() => handleProgress(+1)}
					hidden={currentActive == steps.length}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>
