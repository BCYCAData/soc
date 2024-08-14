import type {
	ProfileAboutMeFormData,
	ProfileMyPlaceAssetsFormData,
	ProfileMyPlaceFormData,
	ProfileMyPlaceHazardsFormData,
	ProfileMyPlaceResourcesFormData,
	ProfileMyCommunityFormData,
	ProfileMyCommunityBCYCAFormData,
	ProfileMyCommunityBCYCAEventsFormData,
	ProfileMyCommunityBCYCAInformationFormData,
	ProfileMyCommunityBCYCAWorkshopsFormData,
	ProfileMyCommunityTinoneeFormData,
	ProfileMyCommunityTinoneeEventsFormData,
	ProfileMyCommunityTinoneeInformationFormData,
	ProfileMyCommunityTinoneeWorkshopsFormData,
	ProfileMyCommunityMondrookFormData,
	ProfileMyCommunityMondrookEventsFormData,
	ProfileMyCommunityMondrookInformationFormData,
	ProfileMyCommunityMondrookWorkshopsFormData,
	ProfileMyCommunityExternalFormData,
	ProfileMyCommunityExternalEventsFormData,
	ProfileMyCommunityExternalInformationFormData,
	ProfileMyCommunityExternalWorkshopsFormData,
	PropertyAgentData
} from '$lib/types';

import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

type CommunityArea = { community: string };
type KyngArea = { kyng: string };
type PostalAddress = {
	postal_address_postcode: string | null;
	postal_address_street: string | null;
	postal_address_suburb: string | null;
};

type CommunityProfile = {
	profile_id?: string;
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	stay_in_touch_choices: number[] | null;
	will_run_community_workshops: string | null;
	other_comments: string | null;
};

type UserProfile = {
	family_name: string | null;
	fire_fighting_experience: number | null;
	fire_trauma: boolean | null;
	first_name: string | null;
	mobile: string | null;
	other_comments: string | null;
	plan_to_leave_before_fire: number | null;
	plan_to_leave_before_flood: number | null;
	residency_profile: number | null;
	rfs_survival_plan: string | null;
	stay_in_touch_choices: number[] | null;
	community_bcyca_profile: CommunityProfile | null;
	community_tinonee_profile: CommunityProfile | null;
	community_mondrook_profile: CommunityProfile | null;
	community_external_profile: CommunityProfile | null;
	user_postal_address: PostalAddress | null;
};

type PropertyAgent = {
	agent_mobile: string | null;
	agent_name: string | null;
	agent_phone: string | null;
};

type PersonalProfileData = {
	id: number;
	property_address_street: string;
	property_address_suburb: string;
	property_address_postcode: string;
	phone: string | null;
	mobile_reception: number | null;
	sign_posted: boolean | null;
	other_essential_assets: string | null;
	residents0_18: number | null;
	residents19_50: number | null;
	residents51_70: number | null;
	residents71_: number | null;
	vulnerable_residents: number | null;
	number_birds: number | null;
	number_cats: number | null;
	number_dogs: number | null;
	number_other_pets: number | null;
	live_stock_present: boolean | null;
	live_stock_safe_area: string | null;
	share_livestock_safe_area: string | null;
	static_water_available: number[] | null;
	have_stortz: string | null;
	stortz_size: number | null;
	truck_access: number | null;
	truck_access_other_information: string | null;
	fire_fighting_resources: number[] | null;
	fire_hazard_reduction: number[] | null;
	site_hazards: number[] | null;
	other_hazards: string | null;
	other_site_hazards: string | null;
	land_adjacent_hazard: string | null;
	property_rented: boolean;
	community_areas: CommunityArea[];
	kyng_areas: KyngArea[];
	user_profile: UserProfile | undefined;
	property_agent: PropertyAgent | null;
};

export const load: LayoutServerLoad = async ({ locals: { supabase, user } }) => {
	if (!user) {
		redirect(307, '/auth/signin');
	}

	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: user.id }
	);

	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}

	const { data: getProfileData, error: getProfileDataError } = await supabase
		.from('property_profile')
		.select(
			`
      id, property_address_street, property_address_suburb, property_address_postcode, phone,
      mobile_reception, sign_posted, other_essential_assets, residents0_18, residents19_50,
      residents51_70, residents71_, vulnerable_residents, number_birds, number_cats, number_dogs,
      number_other_pets, live_stock_present, live_stock_safe_area, share_livestock_safe_area, static_water_available,
      have_stortz, stortz_size, truck_access, truck_access_other_information, fire_fighting_resources,
      fire_hazard_reduction, site_hazards, other_hazards, other_site_hazards, land_adjacent_hazard,
      property_rented, 
      community_areas(community), 
      kyng_areas(kyng),
      user_profile(
        family_name, fire_fighting_experience, fire_trauma, first_name, mobile, other_comments, 
        plan_to_leave_before_fire, plan_to_leave_before_flood, residency_profile, rfs_survival_plan, 
        stay_in_touch_choices, 
        community_bcyca_profile(
          bcyca_profile_id, community_meeting_choices, community_workshop_choices, 
          information_sheet_choices, other_community_meeting, other_community_workshop,
          other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
          other_comments
        ), 
        community_tinonee_profile(
          tinonee_profile_id, community_meeting_choices, community_workshop_choices, 
          information_sheet_choices, other_community_meeting, other_community_workshop,
          other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
          other_comments
        ), 
        community_mondrook_profile(
          mondrook_profile_id, community_meeting_choices, community_workshop_choices, 
          information_sheet_choices, other_community_meeting, other_community_workshop,
          other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
          other_comments
        ), 
        community_external_profile(
          external_profile_id, community_meeting_choices, community_workshop_choices, 
          information_sheet_choices, other_community_meeting, other_community_workshop,
          other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
          other_comments
        ), 
        user_postal_address(postal_address_postcode, postal_address_street, postal_address_suburb) 
      ), 
      property_agent(agent_mobile, agent_name, agent_phone)
    `
		)
		.eq('principaladdresssiteoid', user.app_metadata.principaladdresssiteoid)
		.eq('user_profile.id', user.id)
		.single();

	if (getProfileDataError) {
		console.log('GET data error Profile:', getProfileDataError);
		const emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Profile.`,
			user: `User:: ${user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, getProfileDataError);
		error(400, `GET data error Survey:  Error ${getProfileDataError.message}`);
	}

	if (!getProfileData) {
		error(404, 'Profile data not found');
	}

	const personalProfileData = getProfileData as unknown as PersonalProfileData;
	const {
		user_profile: userProfileData,
		property_agent,
		community_areas,
		kyng_areas,
		...propertyProfile
	} = personalProfileData;

	const communityName = community_areas[0]?.community;
	const kyngName = kyng_areas[0]?.kyng;
	const propertyWasRented = propertyProfile.property_rented || false;

	const {
		id: propertyId,
		property_address_street,
		property_address_suburb,
		property_address_postcode,
		...otherPropertyProfile
	} = propertyProfile;

	const propertyAddress = {
		property_address_street,
		property_address_suburb,
		property_address_postcode
	};

	if (!userProfileData) {
		error(404, 'User profile data not found');
	}

	const {
		user_postal_address,
		community_bcyca_profile,
		community_tinonee_profile,
		community_mondrook_profile,
		community_external_profile,
		...userProfile
	} = userProfileData;

	const hadUserPostalAddress = !!user_postal_address;

	const profileAboutMeFormData: ProfileAboutMeFormData = {
		family_name: userProfile.family_name,
		fire_fighting_experience: userProfile.fire_fighting_experience,
		fire_trauma: userProfile.fire_trauma,
		first_name: userProfile.first_name,
		mobile: userProfile.mobile,
		plan_to_leave_before_fire: userProfile.plan_to_leave_before_fire,
		plan_to_leave_before_flood: userProfile.plan_to_leave_before_flood,
		residency_profile: userProfile.residency_profile,
		rfs_survival_plan: userProfile.rfs_survival_plan
	};

	const propertyAgentData: PropertyAgentData = property_agent || {
		agent_mobile: null,
		agent_name: null,
		agent_phone: null
	};

	const profileMyPlaceFormData: ProfileMyPlaceFormData = {
		property_rented: otherPropertyProfile.property_rented,
		propertyAgentData,
		sign_posted: otherPropertyProfile.sign_posted,
		vulnerable_residents:
			otherPropertyProfile.vulnerable_residents !== null
				? Boolean(otherPropertyProfile.vulnerable_residents)
				: null,
		phone: otherPropertyProfile.phone,
		mobile_reception: otherPropertyProfile.mobile_reception,
		truck_access: otherPropertyProfile.truck_access,
		truck_access_other_information: otherPropertyProfile.truck_access_other_information,
		residents0_18: otherPropertyProfile.residents0_18,
		residents19_50: otherPropertyProfile.residents19_50,
		residents51_70: otherPropertyProfile.residents51_70,
		residents71_: otherPropertyProfile.residents71_
	};

	const profileMyPlaceAssetsFormData: ProfileMyPlaceAssetsFormData = {
		live_stock_present: otherPropertyProfile.live_stock_present,
		live_stock_safe_area: otherPropertyProfile.live_stock_safe_area,
		share_livestock_safe_area: otherPropertyProfile.share_livestock_safe_area,
		number_birds: otherPropertyProfile.number_birds,
		number_cats: otherPropertyProfile.number_cats,
		number_dogs: otherPropertyProfile.number_dogs,
		number_other_pets: otherPropertyProfile.number_other_pets,
		other_essential_assets: otherPropertyProfile.other_essential_assets
	};

	const profileMyPlaceHazardsFormData: ProfileMyPlaceHazardsFormData = {
		other_hazards: otherPropertyProfile.other_hazards,
		other_site_hazards: otherPropertyProfile.other_site_hazards,
		site_hazards: otherPropertyProfile.site_hazards,
		land_adjacent_hazard: otherPropertyProfile.land_adjacent_hazard
	};

	const profileMyPlaceResourcesFormData: ProfileMyPlaceResourcesFormData = {
		fire_fighting_resources: otherPropertyProfile.fire_fighting_resources,
		fire_hazard_reduction: otherPropertyProfile.fire_hazard_reduction,
		have_stortz: otherPropertyProfile.have_stortz,
		stortz_size: otherPropertyProfile.stortz_size,
		static_water_available: otherPropertyProfile.static_water_available
	};

	const profileMyCommunityFormData: ProfileMyCommunityFormData = {
		stay_in_touch_choices: userProfile.stay_in_touch_choices,
		userPostalAddressData: user_postal_address || {
			postal_address_postcode: null,
			postal_address_street: null,
			postal_address_suburb: null
		},
		hadUserPostalAddress,
		other_comments: userProfile.other_comments
	};

	const profileMyCommunityBCYCAFormData: ProfileMyCommunityBCYCAFormData =
		{
			stay_in_touch_choices: community_bcyca_profile?.stay_in_touch_choices || [],
			userPostalAddressData: user_postal_address || {
				postal_address_postcode: null,
				postal_address_street: null,
				postal_address_suburb: null
			},
			hadUserPostalAddress,
			other_comments: community_bcyca_profile?.other_comments || null
		} || null;

	const profileMyCommunityBCYCAEventsFormData: ProfileMyCommunityBCYCAEventsFormData | null =
		community_bcyca_profile
			? {
					community_meeting_choices: community_bcyca_profile.community_meeting_choices || null,
					other_community_meeting: community_bcyca_profile.other_community_meeting || null
				}
			: null;
	const profileMyCommunityBCYCAInformationFormData: ProfileMyCommunityBCYCAInformationFormData | null =
		community_bcyca_profile
			? {
					information_sheet_choices: community_bcyca_profile.information_sheet_choices || null,
					other_information_sheet: community_bcyca_profile.other_information_sheet || null
				}
			: null;
	const profileMyCommunityBCYCAWorkshopsFormData: ProfileMyCommunityBCYCAWorkshopsFormData | null =
		community_bcyca_profile
			? {
					community_workshop_choices: community_bcyca_profile.community_workshop_choices || null,
					other_community_workshop: community_bcyca_profile.other_community_workshop || null,
					will_run_community_workshops: community_bcyca_profile.will_run_community_workshops || null
				}
			: null;

	const profileMyCommunityTinoneeFormData: ProfileMyCommunityTinoneeFormData | null =
		community_tinonee_profile
			? {
					stay_in_touch_choices: community_tinonee_profile.stay_in_touch_choices || null,
					userPostalAddressData:
						{
							postal_address_postcode: user_postal_address?.postal_address_postcode || null,
							postal_address_street: user_postal_address?.postal_address_street || null,
							postal_address_suburb: user_postal_address?.postal_address_suburb || null
						} || null,
					hadUserPostalAddress: hadUserPostalAddress,
					other_comments: community_tinonee_profile.other_comments || null
				}
			: null;
	const profileMyCommunityTinoneeEventsFormData: ProfileMyCommunityTinoneeEventsFormData | null =
		community_tinonee_profile
			? {
					community_meeting_choices: community_tinonee_profile.community_meeting_choices || null,
					other_community_meeting: community_tinonee_profile.other_community_meeting || null
				}
			: null;
	const profileMyCommunityTinoneeInformationFormData: ProfileMyCommunityTinoneeInformationFormData | null =
		community_tinonee_profile
			? {
					information_sheet_choices: community_tinonee_profile.information_sheet_choices || null,
					other_information_sheet: community_tinonee_profile.other_information_sheet || null
				}
			: null;
	const profileMyCommunityTinoneeWorkshopsFormData: ProfileMyCommunityTinoneeWorkshopsFormData | null =
		community_tinonee_profile
			? {
					community_workshop_choices: community_tinonee_profile.community_workshop_choices || null,
					other_community_workshop: community_tinonee_profile.other_community_workshop || null,
					will_run_community_workshops:
						community_tinonee_profile.will_run_community_workshops || null
				}
			: null;
	const profileMyCommunityMondrookFormData: ProfileMyCommunityMondrookFormData | null =
		community_mondrook_profile
			? {
					stay_in_touch_choices: community_mondrook_profile.stay_in_touch_choices || null,
					userPostalAddressData:
						{
							postal_address_postcode: user_postal_address?.postal_address_postcode || null,
							postal_address_street: user_postal_address?.postal_address_street || null,
							postal_address_suburb: user_postal_address?.postal_address_suburb || null
						} || null,
					hadUserPostalAddress: hadUserPostalAddress,
					other_comments: community_mondrook_profile.other_comments || null
				}
			: null;
	const profileMyCommunityMondrookEventsFormData: ProfileMyCommunityMondrookEventsFormData | null =
		community_mondrook_profile
			? {
					community_meeting_choices: community_mondrook_profile.community_meeting_choices || null,
					other_community_meeting: community_mondrook_profile.other_community_meeting || null
				}
			: null;
	const profileMyCommunityMondrookInformationFormData: ProfileMyCommunityMondrookInformationFormData | null =
		community_mondrook_profile
			? {
					information_sheet_choices: community_mondrook_profile.information_sheet_choices || null,
					other_information_sheet: community_mondrook_profile.other_information_sheet || null
				}
			: null;
	const profileMyCommunityMondrookWorkshopsFormData: ProfileMyCommunityMondrookWorkshopsFormData | null =
		community_mondrook_profile
			? {
					community_workshop_choices: community_mondrook_profile.community_workshop_choices || null,
					other_community_workshop: community_mondrook_profile.other_community_workshop || null,
					will_run_community_workshops:
						community_mondrook_profile.will_run_community_workshops || null
				}
			: null;
	const profileMyCommunityExternalFormData: ProfileMyCommunityExternalFormData | null =
		community_external_profile
			? {
					stay_in_touch_choices: community_external_profile.stay_in_touch_choices || null,
					userPostalAddressData:
						{
							postal_address_postcode: user_postal_address?.postal_address_postcode || null,
							postal_address_street: user_postal_address?.postal_address_street || null,
							postal_address_suburb: user_postal_address?.postal_address_suburb || null
						} || null,
					hadUserPostalAddress: hadUserPostalAddress,
					other_comments: community_external_profile.other_comments || null
				}
			: null;
	const profileMyCommunityExternalEventsFormData: ProfileMyCommunityExternalEventsFormData | null =
		community_external_profile
			? {
					community_meeting_choices: community_external_profile.community_meeting_choices || null,
					other_community_meeting: community_external_profile.other_community_meeting || null
				}
			: null;
	const profileMyCommunityExternalInformationFormData: ProfileMyCommunityExternalInformationFormData | null =
		community_external_profile
			? {
					information_sheet_choices: community_external_profile.information_sheet_choices || null,
					other_information_sheet: community_external_profile.other_information_sheet || null
				}
			: null;
	const profileMyCommunityExternalWorkshopsFormData: ProfileMyCommunityExternalWorkshopsFormData | null =
		community_external_profile
			? {
					community_workshop_choices: community_external_profile.community_workshop_choices || null,
					other_community_workshop: community_external_profile.other_community_workshop || null,
					will_run_community_workshops:
						community_external_profile.will_run_community_workshops || null
				}
			: null;

	const communityProfiles: Record<string, string | null> = {
		community_bcyca_profile_id: community_bcyca_profile?.profile_id || null,
		community_tinonee_profile_id: community_tinonee_profile?.profile_id || null,
		community_mondrook_profile_id: community_mondrook_profile?.profile_id || null,
		community_external_profile_id: community_external_profile?.profile_id || null
	};
	return {
		profileMessages,
		propertyId,
		propertyWasRented,
		communityName,
		kyngName,
		propertyAddress,
		propertyProfile,
		profileAboutMeFormData,
		profileMyPlaceFormData,
		profileMyPlaceAssetsFormData,
		profileMyPlaceHazardsFormData,
		profileMyPlaceResourcesFormData,
		profileMyCommunityFormData,
		profileMyCommunityBCYCAFormData,
		profileMyCommunityBCYCAEventsFormData,
		profileMyCommunityBCYCAInformationFormData,
		profileMyCommunityBCYCAWorkshopsFormData,
		profileMyCommunityTinoneeFormData,
		profileMyCommunityTinoneeEventsFormData,
		profileMyCommunityTinoneeInformationFormData,
		profileMyCommunityTinoneeWorkshopsFormData,
		profileMyCommunityMondrookFormData,
		profileMyCommunityMondrookEventsFormData,
		profileMyCommunityMondrookInformationFormData,
		profileMyCommunityMondrookWorkshopsFormData,
		profileMyCommunityExternalFormData,
		profileMyCommunityExternalEventsFormData,
		profileMyCommunityExternalInformationFormData,
		profileMyCommunityExternalWorkshopsFormData,
		user_postal_address,
		communityProfiles
	};
};
