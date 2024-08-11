export type APIData = {
	status: number;
	searchaddressstreet: string;
	searchaddresssuburb: string;
	validaddressstreet: string;
	validaddresssuburb: string;
	validaddresspostcode: string;
	principaladdresssiteoid: number;
	community: string;
	kyng: string;
};

export type Step = {
	index: number;
	text: string;
	page: string;
};

//---------Personal Profile Form-----------------
export type PropertyAddress = {
	property_address_postcode: string;
	property_address_street: string;
	property_address_suburb: string;
};
export type PropertyProfileData = {
	fire_fighting_resources: number[] | null;
	fire_hazard_reduction: number[] | null;
	have_stortz: string | null;
	land_adjacent_hazard: string | null;
	live_stock_present: boolean | null;
	live_stock_safe_area: string | null;
	mobile_reception: number | null;
	number_birds: number | null;
	number_cats: number | null;
	number_dogs: number | null;
	number_other_pets: number | null;
	other_essential_assets: string | null;
	other_hazards: string | null;
	other_site_hazards: string | null;
	phone: string | null;
	property_rented: boolean;
	residents0_18: number | null;
	residents19_50: number | null;
	residents51_70: number | null;
	residents71_: number | null;
	share_livestock_safe_area: string | null;
	sign_posted: boolean | null;
	site_hazards: number[] | null;
	static_water_available: number[] | null;
	stortz_size: number | null;
	truck_access: number | null;
	truck_access_other_information: string | null;
	vulnerable_residents: boolean | null;
};
export type PropertyAgentData = {
	agent_mobile: string | null;
	agent_name: string | null;
	agent_phone: string | null;
};
export type CommunityBCYCAProfileData = {
	bcyca_profile_id: any;
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	stay_in_touch_choices: number[] | null;
	will_run_community_workshops: string | null;
} | null;
export type CommunityTinoneeProfileData = {
	tinonee_profile_id: any;
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	stay_in_touch_choices: number[] | null;
	will_run_community_workshops: string | null;
} | null;
export type CommunityMondrookProfileData = {
	mondrook_profile_id: any;
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	stay_in_touch_choices: number[] | null;
	will_run_community_workshops: string | null;
} | null;
export type CommunityExternalProfileData = {
	external_profile_id: any;
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	stay_in_touch_choices: number[] | null;
	will_run_community_workshops: string | null;
} | null;
export type UserPostalAddressData = {
	postal_address_postcode: string | null;
	postal_address_street: string | null;
	postal_address_suburb: string | null;
} | null;
export type UserProfileData = {
	family_name: string | null;
	fire_fighting_experience: number | null;
	fire_trauma: boolean | null;
	first_name: string | null;
	mobile: string | null;
	plan_to_leave_before_fire: number | null;
	plan_to_leave_before_flood: number | null;
	residency_profile: number | null;
	rfs_survival_plan: string | null;
	stay_in_touch_choices: number[] | null;
	other_comments: string | null;
};

//---------User Profile Forms-----------------
export type ProfileAboutMeFormData = {
	family_name: string | null;
	fire_fighting_experience: number | null;
	fire_trauma: boolean | null;
	first_name: string | null;
	mobile: string | null;
	plan_to_leave_before_fire: number | null;
	plan_to_leave_before_flood: number | null;
	residency_profile: number | null;
	rfs_survival_plan: string | null;
};
export type ProfileMyPlaceFormData = {
	property_rented: boolean;
	propertyAgentData: PropertyAgentData;
	sign_posted: boolean | null;
	vulnerable_residents: boolean | null;
	phone: string | null;
	mobile_reception: number | null;
	truck_access: number | null;
	truck_access_other_information: string | null;
	residents0_18: number | null;
	residents19_50: number | null;
	residents51_70: number | null;
	residents71_: number | null;
};

export type ProfileMyPlaceAssetsFormData = {
	live_stock_present: boolean | null;
	live_stock_safe_area: string | null;
	share_livestock_safe_area: string | null;
	number_birds: number | null;
	number_cats: number | null;
	number_dogs: number | null;
	number_other_pets: number | null;
	other_essential_assets: string | null;
};

export type ProfileMyPlaceHazardsFormData = {
	site_hazards: number[] | null;
	land_adjacent_hazard: string | null;
	other_hazards: string | null;
	other_site_hazards: string | null;
};
export type ProfileMyPlaceResourcesFormData = {
	fire_fighting_resources: number[] | null;
	fire_hazard_reduction: number[] | null;
	have_stortz: string | null;
	static_water_available: number[] | null;
	stortz_size: number | null;
};
export type ProfileMyCommunityFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityBCYCAFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityBCYCAEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityBCYCAInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityBCYCAWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityTinoneeFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityTinoneeEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityTinoneeInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityTinoneeWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityMondrookFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityMondrookEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityMondrookInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityMondrookWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityExternalFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityExternalEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityExternalInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityExternalWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
