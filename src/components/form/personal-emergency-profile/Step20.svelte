<script lang="ts">
	import TextAreaInput from '../inputs/TextAreaInput.svelte';

	import { setUpperCase } from '$lib/svelte-actions';

	import type { PersonalProfileFormData } from '$lib/form.types';

	type Props = {
		userProfile: PersonalProfileFormData;
		communityName?: string;
		userProfileStayInTouchOptions?: { value: string; lable: string }[];
	};

	let {
		userProfile = $bindable(),
		communityName = '',
		userProfileStayInTouchOptions = []
	}: Props = $props();

	const postalWasChecked = $state(userProfile.stay_in_touch_choices?.includes(5));

	let postalChecked = $state(false);
	$effect.pre(() => {
		postalChecked = userProfile.stay_in_touch_choices?.includes(5) ?? false;
	});
</script>

<h2 class="h2 mb-1 mt-2 text-lg font-semibold text-surface-950">
	How would you prefer to stay in touch with the <span class="text-orange-600"
		>Strengthen OUR Community</span
	>
	project team? <br />
	<span class="text-scale-3 ml-2 text-surface-500"> (Check all that apply) </span>
	<span class="text-scale-3 ml-2 italic text-surface-500"
		>(These options will also be used in your {communityName} Community profile. You can change them
		later if needed.)</span
	>
</h2>
<div
	class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each userProfileStayInTouchOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6"
				name="stay_in_touch_choices"
				type="checkbox"
				onchange={() => {
					postalChecked = userProfile.stay_in_touch_choices?.includes(5) ?? false;
				}}
				bind:group={userProfile.stay_in_touch_choices}
				value={Number(value)}
				checked={userProfile?.stay_in_touch_choices?.includes(Number(value))}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="stay_in_touch_choices"
				>{lable}
			</label>
		</div>
	{/each}
</div>
<input type="text" name="postal_was_checked" value={postalWasChecked} hidden />
<h2 hidden={!postalChecked} class="text-scale-6 mb-1 font-semibold text-surface-950">
	Please enter your postal address:
</h2>
<div hidden={!postalChecked} class="rounded-lg bg-secondary-200 p-2">
	<div class="grid gap-0 sm:grid-cols-12">
		<div class="flex items-center">
			<label
				hidden={!postalChecked}
				class="px-3 text-lg font-semibold text-primary-700"
				for="postal_address_street">ADDRESS</label
			>
		</div>
		<div class="col-span-10 ml-3 flex items-center">
			<input
				hidden={!postalChecked}
				type="text"
				id="postal_address_street"
				name="postal_address_street"
				class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				placeholder="STREET ADDRESS"
				autocomplete="street-address"
				use:setUpperCase
				style="text-transform:uppercase"
				value={userProfile.user_postal_address?.postal_address_street}
			/>
		</div>
	</div>

	<div class="rounded-lg bg-secondary-200 p-2">
		<div class="grid gap-0 sm:grid-cols-12">
			<div class="flex items-center">
				<label
					hidden={!postalChecked}
					class="px-3 pl-2 text-lg font-semibold text-primary-700"
					for="property_address_suburb">SUBURB</label
				>
			</div>
			<div class="col-span-6 flex items-center">
				<input
					hidden={!postalChecked}
					type="text"
					id="postal_address_suburb"
					name="postal_address_suburb"
					class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
					placeholder="SUBURB"
					autocomplete="address-level2"
					use:setUpperCase
					style="text-transform:uppercase"
					value={userProfile.user_postal_address?.postal_address_suburb}
				/>
			</div>
			<div class="col-span-2 flex items-center">
				<label
					hidden={!postalChecked}
					class="px-3 text-lg font-semibold text-primary-700 sm:pl-16"
					for="postal_address_postcode">POSTCODE</label
				>
			</div>
			<div class="col-span-3 flex items-center pr-20">
				<input
					hidden={!postalChecked}
					type="text"
					id="postal_address_postcode"
					name="property_address_postcode"
					class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
					placeholder="POSTCODE"
					autocomplete="postal-code"
					style="text-transform:uppercase"
					value="userProfile.user_postal_address?.postal_address_postcode}"
				/>
			</div>
		</div>
	</div>
</div>
<TextAreaInput
	headingClass="h2 mb-1 text-lgfont-semibold text-surface-950"
	headingText="Do you have any other comments that you would like to add?"
	lableClass={null}
	lableText={null}
	divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
	nameText="other_comments"
	textAreaClass="w-full resize-y sm:text-scale-5"
	bind:inputValue={userProfile.other_comments}
/>
