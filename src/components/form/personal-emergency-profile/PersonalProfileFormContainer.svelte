<script lang="ts">
	import Step1 from '$components/form/personal-emergency-profile/Step1.svelte';
	import Step2 from '$components/form/personal-emergency-profile/Step2.svelte';
	import Step3 from '$components/form/personal-emergency-profile/Step3.svelte';
	import Step4 from '$components/form/personal-emergency-profile/Step4.svelte';
	import Step5 from '$components/form/personal-emergency-profile/Step5.svelte';
	import Step6 from '$components/form/personal-emergency-profile/Step6.svelte';
	import Step7 from '$components/form/personal-emergency-profile/Step7.svelte';
	import Step8 from '$components/form/personal-emergency-profile/Step8.svelte';
	import Step9 from '$components/form/personal-emergency-profile/Step9.svelte';
	import Step10 from '$components/form/personal-emergency-profile/Step10.svelte';
	import Step11 from '$components/form/personal-emergency-profile/Step11.svelte';
	import Step12 from '$components/form/personal-emergency-profile/Step12.svelte';
	import Step13 from '$components/form/personal-emergency-profile/Step13.svelte';
	import Step14 from '$components/form/personal-emergency-profile/Step14.svelte';
	import Step15 from '$components/form/personal-emergency-profile/Step15.svelte';
	import Step16 from '$components/form/personal-emergency-profile/Step16.svelte';
	import Step17 from '$components/form/personal-emergency-profile/Step17.svelte';
	import Step18 from '$components/form/personal-emergency-profile/Step18.svelte';
	import Step19 from '$components/form/personal-emergency-profile/Step19.svelte';
	import Step20 from '$components/form/personal-emergency-profile/Step20.svelte';
	import Step21 from '$components/form/personal-emergency-profile/Step21.svelte';

	import type { PersonalProfileFormData } from '$lib/form.types';

	type Props = {
		active_step: number;
		propertyWasRented: boolean;
		userProfile: PersonalProfileFormData;
		optionsData: any;
	};

	let { active_step, propertyWasRented, userProfile, optionsData }: Props = $props();

	const communityProfileId = userProfile.community_bcyca_profile
		? userProfile.community_bcyca_profile.bcyca_profile_id
		: userProfile.community_tinonee_profile
			? userProfile.community_tinonee_profile.tinonee_profile_id
			: userProfile.community_mondrook_profile
				? userProfile.community_mondrook_profile.mondrook_profile_id
				: userProfile.community_external_profile
					? userProfile.community_external_profile.external_profile_id
					: '';
	const communityBCYCAWorkshopOptionsData =
		optionsData.communityBCYCAOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityBCYCAWorkshopOptions = communityBCYCAWorkshopOptionsData?.options;

	const communityBCYCAInformationSheetOptionsData =
		optionsData.communityBCYCAOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityBCYCAInformationOptions = communityBCYCAInformationSheetOptionsData?.options;
	const communityBCYCAMeetingOptionsData = optionsData.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
	);
	const communityBCYCAMeetingOptions = communityBCYCAMeetingOptionsData?.options;
	const stayInTouchOptionsData = optionsData.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	);
	const communityBCYCAStayInTouchOptions = stayInTouchOptionsData?.options;

	const communityExternalWorkshopOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityExternalWorkshopOptions = communityExternalWorkshopOptionsData?.options;
	const communityExternalInformationSheetOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityExternalInformationOptions = communityExternalInformationSheetOptionsData?.options;
	const communityExternalMeetingOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityExternalMeetingOptions = communityExternalMeetingOptionsData?.options;
	const communityExternalStayInTouchOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityExternalStayInTouchOptions = communityExternalStayInTouchOptionsData?.options;

	const communityMondrookWorkshopOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityMondrookWorkshopOptions = communityMondrookWorkshopOptionsData?.options;
	const communityMondrookInformationSheetOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityMondrookInformationOptions = communityMondrookInformationSheetOptionsData?.options;
	const communityMondrookMeetingOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityMondrookMeetingOptions = communityMondrookMeetingOptionsData?.options;
	const communityMondrookStayInTouchOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityMondrookStayInTouchOptions = communityMondrookStayInTouchOptionsData?.options;

	const communityTinoneeWorkshopOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityTinoneeWorkshopOptions = communityTinoneeWorkshopOptionsData?.options;
	const communityTinoneeInformationSheetOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityTinoneeInformationOptions = communityTinoneeInformationSheetOptionsData?.options;
	const communityTinoneeMeetingOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityTinoneeMeetingOptions = communityTinoneeMeetingOptionsData?.options;
	const communityTinoneeStayInTouchOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityTinoneeStayInTouchOptions = communityTinoneeStayInTouchOptionsData?.options;

	const cuserProfileStayInTouchOptionsData = optionsData.userOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	);
	const userProfileStayInTouchOptions = cuserProfileStayInTouchOptionsData?.options;
</script>

<div class="mx-auto sm:w-11/12">
	<div
		class="text-scale-5 p-1 text-center text-orange-600"
		hidden={active_step == 1 || active_step == 12}
	>
		Please complete all steps and tap <span
			class="text-scale-3 rounded-lg border border-purple-700 bg-[#0099E8] p-1 font-semibold text-secondary-50"
		>
			Save My Answers
		</span>
		at Step 12
	</div>
	<form method="post" action="/personal-profile-form" id="personalProfileForm">
		<input
			type="hidden"
			name="communityName"
			value={userProfile.property_profile.community_areas?.[0]?.community ?? ''}
		/>
		<input type="hidden" name="propertyId" value={userProfile.property_profile.id} />
		<input type="hidden" name="propertyWasRented" value={propertyWasRented} />
		<input type="hidden" name="communityProfileId" value={communityProfileId} />
		<div hidden={active_step != 1}>
			<Step1 />
		</div>
		<div hidden={active_step != 2}>
			<Step2 {userProfile} {propertyWasRented} />
		</div>
		<div hidden={active_step != 3}>
			<Step3 {userProfile} />
		</div>
		<div hidden={active_step != 4}>
			<Step4 propertyProfile={userProfile.property_profile} />
		</div>
		<div hidden={active_step != 5}>
			<Step5 propertyProfile={userProfile.property_profile} />
		</div>
		<div hidden={active_step != 6}>
			<Step6 propertyProfile={userProfile.property_profile} />
		</div>
		<div hidden={active_step != 7}>
			<Step7 {userProfile} />
		</div>
		{#if userProfile.community_bcyca_profile}
			<div hidden={active_step != 8}>
				<Step8
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 9}>
				<Step9
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAInformationOptions}
				/>
			</div>
			<div hidden={active_step != 10}>
				<Step10
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAMeetingOptions}
				/>
			</div>
		{/if}
		{#if userProfile.community_tinonee_profile}
			<div hidden={active_step != 8}>
				<Step11
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 9}>
				<Step12
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeInformationOptions}
				/>
			</div>
			<div hidden={active_step != 10}>
				<Step13
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeMeetingOptions}
				/>
			</div>
		{/if}
		{#if userProfile.community_mondrook_profile}
			<div hidden={active_step != 8}>
				<Step14
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 9}>
				<Step15
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookInformationOptions}
				/>
			</div>
			<div hidden={active_step != 10}>
				<Step16
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookMeetingOptions}
				/>
			</div>
		{/if}
		{#if userProfile.community_external_profile}
			<div hidden={active_step != 8}>
				<Step17
					communityExternalProfile={userProfile.community_external_profile}
					{communityExternalWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 9}>
				<Step18 communityExternalProfile={userProfile.community_external_profile} />
			</div>
			<div hidden={active_step != 10}>
				<Step19 communityExternalProfile={userProfile.community_external_profile} />
			</div>
		{/if}
		<div hidden={active_step != 11}>
			<Step20
				{userProfile}
				{userProfileStayInTouchOptions}
				communityName={userProfile.property_profile.community_areas?.[0]?.community}
			/>
		</div>
		<div hidden={active_step != 12}>
			<Step21 />
		</div>
		<div class="sm:text-scale-5 flex flex-col items-center justify-center">
			<button
				class="text-scale-3 mx-3 mb-3 w-1/4 rounded-lg border border-purple-700 bg-[#0099E8] font-semibold text-secondary-50"
				hidden={active_step != 12}
				type="submit"
				form="personalProfileForm"
			>
				Save My Answers
			</button>
		</div>
	</form>
</div>
