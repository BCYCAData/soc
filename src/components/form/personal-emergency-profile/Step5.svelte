<script lang="ts">
	import {
		staticWaterOptions,
		yesNoMaybeOptions,
		fireFightingResources
	} from '$lib/profileOptions';

	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PropertyProfileData } from '$lib/types';

	interface Props {
		propertyProfile: PropertyProfileData;
	}

	let { propertyProfile = $bindable() }: Props = $props();

	let noneChecked = $state(false);
	let have_stortzChecked = $state(propertyProfile.have_stortz == 'Y');

	let selectedStaticSources = new Set<EventTarget & HTMLInputElement>();

	const unCheckAllStaticWater = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			for (const source of selectedStaticSources) {
				source.checked = false;
			}
			selectedStaticSources.clear();
			noneChecked = true;
		}
	};
	const setStaticWater = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			selectedStaticSources.add(e.currentTarget);
		} else {
			selectedStaticSources.delete(e.currentTarget);
		}
		if (noneChecked) {
			noneChecked = false;
		}
	};
</script>

<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	Are there any static water supplies on the property?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each staticWaterOptions as { value, lable }}
		{#if value < 5}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="static_water_available"
					type="checkbox"
					bind:group={propertyProfile.static_water_available}
					name="static_water_available"
					{value}
					onchange={(e) => {
						setStaticWater(e);
					}}
				/>
				<label
					class="font-Poppins text-scale-6 ml-2 font-medium text-orange-900"
					for="static_water_available">{lable}</label
				>
			</div>
		{:else}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="static_water_available"
					type="checkbox"
					name="static_water_available"
					bind:group={propertyProfile.static_water_available}
					{value}
					onchange={(e) => {
						unCheckAllStaticWater(e);
					}}
					checked={noneChecked}
				/>
				<label
					class="font-Poppins text-scale-6 ml-2 font-medium text-orange-900"
					for="static_water_available">{lable}</label
				>
			</div>
		{/if}
	{/each}
</div>

<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	Do you have a Stortz fitting attached to a water tank?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="have_stortz"
				type="radio"
				name="have_stortz"
				onchange={(e) => {
					have_stortzChecked = e.currentTarget.value == 'Y';
				}}
				bind:group={propertyProfile.have_stortz}
				{value}
			/>
			<label class="font-Poppins text-scale-6 ml-2 font-medium text-orange-900" for="have_stortz"
				>{lable}</label
			>
		</div>
	{/each}
</div>
{#if have_stortzChecked}
	<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">Please include the size</h2>
	<div class="flex flex-wrap justify-between rounded-lg bg-secondary-200 p-2">
		<div class="flex items-center">
			<NumberInput
				name="stortz_size"
				lable="Size (mm)"
				lableClass="min-w-fit mr-3 text-scale-6 font-medium text-orange-900 font-Poppins"
				inputClass="max-w-sm border border-secondary-700 w-20 rounded sm:text-scale-5"
				divClass="flex items-center"
				bind:inputValue={propertyProfile.stortz_size}
			/>
		</div>
	</div>
{/if}

<h2 class="unstyled text-scale-6 mb-1 font-semibold text-surface-950">
	Do you have any of the following at this property?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each fireFightingResources as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="fire_fighting_resources"
				type="checkbox"
				name="fire_fighting_resources"
				bind:group={propertyProfile.fire_fighting_resources}
				{value}
			/>
			<label
				class="font-Poppins text-scale-6 ml-2 font-medium text-orange-900"
				for="fire_fighting_resources">{lable}</label
			>
		</div>
	{/each}
</div>
