<script lang="ts">
	import { residencyOptions, yesNoOptions } from '$lib/profileOptions';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { UserProfileData, PropertyProfileData } from '$lib/types';

	interface Props {
		userProfile: UserProfileData;
		propertyProfile: PropertyProfileData;
	}

	let { userProfile = $bindable(), propertyProfile = $bindable() }: Props = $props();

	let localUserProfile = $state({ ...userProfile });
	let localPropertyProfile = $state({ ...propertyProfile });

	$effect(() => {
		Object.assign(userProfile, localUserProfile);
		Object.assign(propertyProfile, localPropertyProfile);
	});
</script>

<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	What is the quality of your mobile reception at the property?
</h2>
<div class="rounded-lg bg-secondary-200 p-1">
	<ul class="text-scale-3 my-0 flex list-none items-center sm:mx-auto sm:w-1/2">
		<div class="font-Poppins flex-auto font-semibold text-primary-700">Poor</div>
		{#each Array(5) as _, i}
			<li class="flex-auto">
				<input
					name="mobile_reception"
					type="radio"
					class="h-4 w-4 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
					bind:group={localPropertyProfile.mobile_reception}
					value={i + 1}
				/>
				<label class="font-Poppins ml-1 inline-block text-primary-700" for="mobile_reception">
					{i + 1}
				</label>
			</li>
		{/each}
		<div class="font-Poppins flex-auto font-semibold text-primary-700">Excellent</div>
	</ul>
</div>
<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">Are you:</h2>
<div
	class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
>
	{#each residencyOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
				id="residency_profile"
				type="radio"
				name="residency_profile"
				bind:group={localUserProfile.residency_profile}
				{value}
			/>
			<label
				class="font-Poppins text-scale-6 ml-2 font-medium text-orange-700"
				for="residency_profile">{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	Please record the number of people who usually live at this property:
</h2>
<div class="rounded-lg bg-secondary-200 p-2">
	<ul class="sm:text-scale-5 my-0 flex list-none justify-around pl-0">
		<NumberInput
			name="residents0_18"
			lable="0-18 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded sm:text-scale-5"
			bind:inputValue={localPropertyProfile.residents0_18}
		/>
		<NumberInput
			name="residents19_50"
			lable="19-50 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded sm:text-scale-5"
			bind:inputValue={localPropertyProfile.residents19_50}
		/>
		<NumberInput
			name="residents51_70"
			lable="51-70 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded sm:text-scale-5"
			bind:inputValue={localPropertyProfile.residents51_70}
		/>
		<NumberInput
			name="residents71_"
			lable="71 years +"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded sm:text-scale-5"
			bind:inputValue={localPropertyProfile.residents71_}
		/>
	</ul>
</div>
<div>
	<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
		Do you consider any person on the property to be vulnerable?
	</h2>
	<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
		{#each yesNoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
					id="vulnerable_residents"
					type="radio"
					name="vulnerable_residents"
					bind:group={localPropertyProfile.vulnerable_residents}
					{value}
				/>
				<label
					class="font-Poppins text-scale-6 ml-2 font-medium text-orange-700"
					for="vulnerable_residents">{lable}</label
				>
			</div>
		{/each}
	</div>
</div>
