import {
	Ambulance,
	Flame,
	Mailbox,
	Map,
	MapPinHouse,
	MapPinned,
	School,
	Settings,
	UserCheck,
	UserCog,
	Users,
	User,
	CalendarDays,
	FireExtinguisher,
	HousePlus,
	Info,
	KeyRound,
	UsersIcon,
	MessagesSquare,
	Shield,
	ChartBar,
	BookOpenText,
	SquareMenu,
	Hammer,
	Contact,
	BookUp,
	Cog
} from 'lucide-svelte';

import TextIcon from '$components/navigation/TextIcon.svelte';

import type { AdminMenuItem, ProfileMenuItem } from './types';
import type { PropertyProfile } from './form.types';

export type PathConfig = {
	label: string;
	icon?: typeof User | typeof TextIcon;
	letter?: string;
};

export type Step = {
	index: number;
	text: string;
	page: string;
};

export type Crumb = {
	label: string;
	href: string;
	icon?: typeof User | typeof TextIcon;
	letter?: string;
};

export const kyngSidebarPathLables: Record<string, PathConfig> = {
	kyngcoordinator: { label: 'KYNG Coordinator' },
	messages: { label: 'KYNG Area Messages', icon: MessagesSquare },
	user_admin: { label: 'User Administration', icon: UsersIcon },
	registered: { label: 'Registered', icon: User },
	map: { label: 'KYNG Map', icon: Map }
};

export const kyngSidebarMenuItems: AdminMenuItem[] = [
	{
		id: 'area-name',
		name: 'Area Name',
		link: '/kyngcoordinator/{kyng_area}',
		icon: { icon: Users },
		permission: 'kyng',
		subItems: [
			{
				id: 'area-messages',
				name: 'KYNG Messages',
				link: '/kyngcoordinator/{kyng_area}/messages',
				icon: { icon: MessagesSquare },
				permission: 'kyng'
			},
			{
				id: 'area-users-admin',
				name: 'Area User Administration',
				link: '/kyngcoordinator/{kyng_area}/user_admin',
				icon: { icon: Users },
				permission: 'kyng',
				subItems: [
					{
						id: 'area-users-registered',
						name: 'Registered Users',
						link: '/kyngcoordinator/{kyng_area}/user_admin/registered',
						icon: { icon: Contact },
						permission: 'kyng'
					}
				]
			},
			{
				id: 'area-map',
				name: 'Area Map',
				link: '/kyngcoordinator/{kyng_area}/map',
				icon: { icon: MapPinned },
				permission: 'kyng'
			}
		]
	}
];

export const adminSidebarPathLables: Record<string, PathConfig> = {
	admin: { label: 'Administration' },
	site: { label: 'Site Administration', icon: SquareMenu },
	messages: { label: 'Site Messages', icon: MessagesSquare },
	roles: { label: 'Role Management', icon: Shield },
	users: { label: 'User Administration', icon: Users },
	new: { label: 'New Users', icon: ChartBar },
	kits: { label: 'Kits Delivered', icon: Hammer },
	emergency: { label: 'Emergency Administration', icon: Ambulance },
	community: { label: 'Community Administration', icon: Settings },
	bcyca: { label: 'BCYCA', icon: TextIcon, letter: 'B' },
	tinonee: { label: 'Tinonee', icon: TextIcon, letter: 'T' },
	mondrook: { label: 'Mondrook', icon: TextIcon, letter: 'M' },
	external: { label: 'External', icon: TextIcon, letter: 'E' },
	information: { label: 'Information', icon: Info },
	events: { label: 'Events', icon: CalendarDays },
	workshops: { label: 'Workshops', icon: School },
	'service-map': { label: 'Service Map', icon: Map },
	reports: { label: 'Reports', icon: BookOpenText }
};

export const adminSidebarMenuItems: AdminMenuItem[] = [
	{
		id: 'site-admin',
		name: 'Site Administration',
		link: '/admin/site',
		icon: { icon: SquareMenu },
		permission: 'admin.site',
		subItems: [
			{
				id: 'site-messages',
				name: 'Site Messages',
				link: '/admin/site/messages',
				icon: { icon: MessagesSquare },
				permission: 'admin.site.messages'
			},
			{
				id: 'site-roles',
				name: 'Role Management',
				link: '/admin/site/roles',
				icon: { icon: Shield },
				permission: 'admin.site.roles'
			}
		]
	},
	{
		id: 'users-admin',
		name: 'User Administration',
		link: '/admin/users',
		icon: { icon: Users },
		permission: 'admin.users',
		subItems: [
			{
				id: 'users-admin-new',
				name: 'New Users',
				link: '/admin/users/new',
				icon: { icon: ChartBar },
				permission: 'admin.users.newusers'
			},
			{
				id: 'users-admin-kits',
				name: 'Kits Delivered',
				link: '/admin/users/kits',
				icon: { icon: Hammer },
				permission: 'admin.users.kits'
			}
		]
	},
	{
		id: 'emergency-admin',
		name: 'Emergency Administration',
		link: '/admin/emergency',
		icon: { icon: Ambulance },
		permission: 'admin.emergency',
		subItems: [
			{
				id: 'emergency-admin-reports',
				name: 'Reports',
				link: '/admin/emergency/reports',
				icon: { icon: BookUp },
				permission: 'admin.emergency.reports'
			},
			{
				id: 'emergency-admin-service-map',
				name: 'Service Map',
				link: '/admin/emergency/service_map',
				icon: { icon: Map },
				permission: 'admin.emergency.servicemap'
			}
		]
	},
	{
		id: 'community-admin',
		name: 'Communities Administration',
		link: '/admin/community',
		icon: { icon: Cog },
		permission: 'admin.communities',
		subItems: [
			{
				id: 'community-admin-bcyca',
				name: 'BCYCA',
				link: '/admin/community/bcyca',
				icon: { icon: TextIcon, letter: 'B' },
				permission: 'admin.bcyca',
				subItems: [
					{
						id: 'community-admin-bcyca-information',
						name: 'BCYCA Information',
						link: '/admin/community/bcyca/information',
						icon: { icon: Info },
						permission: 'admin.bcyca.information'
					},
					{
						id: 'community-admin-bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/admin/community/bcyca/workshops',
						icon: { icon: School },
						permission: 'admin.bcyca.workshops'
					},
					{
						id: 'community-admin-bcyca-events',
						name: 'BCYCA Events',
						link: '/admin/community/bcyca/events',
						icon: { icon: CalendarDays },
						permission: 'admin.bcyca.events'
					},
					{
						id: 'community-admin-bcyca-map',
						name: 'BCYCA Community Map',
						link: '/admin/community/bcyca/map',
						icon: { icon: Map },
						permission: 'admin.bcyca'
					}
				]
			},
			{
				id: 'community-admin-tinonee',
				name: 'Tinonee',
				link: '/admin/community/tinonee',
				icon: { icon: TextIcon, letter: 'T' },
				permission: 'admin.tinonee',
				subItems: [
					{
						id: 'community-admin-tinonee-information',
						name: 'Tinonee Information',
						link: '/admin/community/tinonee/information',
						icon: { icon: Info },
						permission: 'admin.tinonee.information'
					},
					{
						id: 'community-admin-tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/admin/community/tinonee/workshops',
						icon: { icon: School },
						permission: 'admin.tinonee.workshops'
					},
					{
						id: 'community-admin-tinonee-events',
						name: 'Tinonee Events',
						link: '/admin/community/tinonee/events',
						icon: { icon: CalendarDays },
						permission: 'admin.tinonee.events'
					},
					{
						id: 'community-admin-tinonee-map',
						name: 'Tinonee Community Map',
						link: '/admin/community/tinonee/map',
						icon: { icon: Map },
						permission: 'admin.tinonee'
					}
				]
			},
			{
				id: 'community-admin-mondrook',
				name: 'Mondrook',
				link: '/admin/community/mondrook',
				icon: { icon: TextIcon, letter: 'M' },
				permission: 'admin.mondrook',
				subItems: [
					{
						id: 'community-admin-mondrook-information',
						name: 'Mondrook Information',
						link: '/admin/community/mondrook/information',
						icon: { icon: Info },
						permission: 'admin.mondrook.information'
					},
					{
						id: 'community-admin-mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/admin/community/mondrook/workshops',
						icon: { icon: School },
						permission: 'admin.mondrook.workshops'
					},
					{
						id: 'community-admin-mondrook-events',
						name: 'Mondrook Events',
						link: '/admin/community/mondrook/events',
						icon: { icon: CalendarDays },
						permission: 'admin.mondrook.events'
					},
					{
						id: 'community-admin-mondrook-map',
						name: 'Mondrook Community Map',
						link: '/admin/community/mondrook/map',
						icon: { icon: Map },
						permission: 'admin.mondrook'
					}
				]
			},
			{
				id: 'community-admin-external',
				name: 'External',
				link: '/admin/community/external',
				icon: { icon: TextIcon, letter: 'E' },
				permission: 'admin.external',
				subItems: [
					{
						id: 'community-admin-external-information',
						name: 'External Information',
						link: '/admin/community/external/information',
						icon: { icon: Info },
						permission: 'admin.external.information'
					},
					{
						id: 'community-admin-external-workshops',
						name: 'External Workshops',
						link: '/admin/community/external/workshops',
						icon: { icon: School },
						permission: 'admin.external.workshops'
					},
					{
						id: 'community-admin-external-events',
						name: 'External Events',
						link: '/admin/community/external/events',
						icon: { icon: CalendarDays },
						permission: 'admin.external.events'
					},
					{
						id: 'community-admin-external-map',
						name: 'External Community Map',
						link: '/admin/community/external/map',
						icon: { icon: Map },
						permission: 'admin.external'
					}
				]
			}
		]
	}
];

export const profileSidebarPathLables: Record<string, PathConfig> = {
	'personal-profile': { label: 'Personal Profile', icon: UserCog },
	aboutme: { label: 'About Me', icon: UserCheck },
	'my-property': { label: 'My Place', icon: MapPinHouse },
	assets: { label: 'Assets', icon: HousePlus },
	resources: { label: 'Firefighting Resources', icon: FireExtinguisher },
	hazards: { label: 'Firefighting Hazards', icon: Flame },
	mymap: { label: 'My Map', icon: MapPinned },
	mycommunity: { label: 'My Community', icon: Users },
	bcyca: { label: 'BCYCA', icon: TextIcon, letter: 'B' },
	tinonee: { label: 'Tinonee', icon: TextIcon, letter: 'T' },
	mondrook: { label: 'Mondrook', icon: TextIcon, letter: 'M' },
	external: { label: 'External', icon: TextIcon, letter: 'E' },
	information: { label: 'Information', icon: Info },
	events: { label: 'Events', icon: CalendarDays },
	workshops: { label: 'Workshops', icon: School },
	map: { label: 'Community Map', icon: Map },
	settings: { label: 'Settings', icon: Settings },
	password: { label: 'Change Password', icon: KeyRound },
	email: { label: 'Change Email', icon: Mailbox }
};

export const profileSidebarMenuItems = (
	communityText: string,
	properties: PropertyProfile[]
): ProfileMenuItem[] => [
	{
		id: 'about-me',
		name: 'About Me',
		link: '/personal-profile/aboutme',
		icon: { icon: UserCheck }
	},
	{
		id: 'my-property',
		name: 'My Place',
		link: '/personal-profile/my-property',
		icon: { icon: MapPinHouse },
		initialOpen: true,
		subItems: properties.map((property, index) => ({
			id: `property-${property.id}`,
			name: properties.length === 1 ? 'My Property' : `Property ${index + 1}`,
			icon: { icon: MapPinHouse, letter: `${index + 1}` },
			link: `/personal-profile/my-property/${property.id}`,
			subItems: [
				{
					id: 'assets',
					name: 'Assets',
					link: `/personal-profile/my-property/${property.id}/assets`,
					icon: { icon: HousePlus }
				},
				{
					id: 'hazards',
					name: 'Hazards',
					link: `/personal-profile/my-property/${property.id}/hazards`,
					icon: { icon: Flame }
				},
				{
					id: 'my-map',
					name: 'My Map',
					link: `/personal-profile/my-property/${property.id}/my-map`,
					icon: { icon: MapPinned }
				},
				{
					id: 'resources',
					name: 'Resources',
					link: `/personal-profile/my-property/${property.id}/resources`,
					icon: { icon: FireExtinguisher }
				}
			]
		}))
	},
	{
		id: 'my-community',
		name: `My ${communityText}`,
		link: '/personal-profile/mycommunity',
		icon: { icon: Users },
		initialOpen: false,
		subItems: [
			{
				id: 'bcyca',
				name: 'BCYCA',
				link: '/personal-profile/mycommunity/bcyca',
				icon: { icon: TextIcon, letter: 'B' },
				initialOpen: false,
				subItems: [
					{
						id: 'bcyca-information',
						name: 'BCYCA Information',
						link: '/personal-profile/mycommunity/bcyca/information',
						icon: { icon: Info }
					},
					{
						id: 'bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/personal-profile/mycommunity/bcyca/workshops',
						icon: { icon: School }
					},
					{
						id: 'bcyca-events',
						name: 'BCYCA Events',
						link: '/personal-profile/mycommunity/bcyca/events',
						icon: { icon: CalendarDays }
					},
					{
						id: 'bcyca-map',
						name: 'BCYCA Community Map',
						link: '/personal-profile/mycommunity/bcyca/map',
						icon: { icon: Map }
					}
				]
			},
			{
				id: 'tinonee',
				name: 'Tinonee',
				link: '/personal-profile/mycommunity/tinonee',
				icon: { icon: TextIcon, letter: 'T' },
				initialOpen: false,
				subItems: [
					{
						id: 'tinonee-information',
						name: 'Tinonee Information',
						link: '/personal-profile/mycommunity/tinonee/information',
						icon: { icon: Info }
					},
					{
						id: 'tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/personal-profile/mycommunity/tinonee/workshops',
						icon: { icon: School }
					},
					{
						id: 'tinonee-events',
						name: 'Tinonee Events',
						link: '/personal-profile/mycommunity/tinonee/events',
						icon: { icon: CalendarDays }
					},
					{
						id: 'tinonee-map',
						name: 'Tinonee Community Map',
						link: '/personal-profile/mycommunity/tinonee/map',
						icon: { icon: Map }
					}
				]
			},
			{
				id: 'mondrook',
				name: 'Mondrook',
				link: '/personal-profile/mycommunity/mondrook',
				icon: { icon: TextIcon, letter: 'M' },
				initialOpen: false,
				subItems: [
					{
						id: 'mondrook-information',
						name: 'Mondrook Information',
						link: '/personal-profile/mycommunity/mondrook/information',
						icon: { icon: Info }
					},
					{
						id: 'mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/personal-profile/mycommunity/mondrook/workshops',
						icon: { icon: School }
					},
					{
						id: 'mondrook-events',
						name: 'Mondrook Events',
						link: '/personal-profile/mycommunity/mondrook/events',
						icon: { icon: CalendarDays }
					},
					{
						id: 'mondrook-map',
						name: 'Mondrook Community Map',
						link: '/personal-profile/mycommunity/mondrook/map',
						icon: { icon: Map }
					}
				]
			},
			{
				id: 'external',
				name: 'External',
				link: '/personal-profile/mycommunity/external',
				icon: { icon: TextIcon, letter: 'E' },
				initialOpen: false,
				subItems: [
					{
						id: 'external-information',
						name: 'External Information',
						link: '/personal-profile/mycommunity/external/information',
						icon: { icon: Info }
					},
					{
						id: 'external-workshops',
						name: 'External Workshops',
						link: '/personal-profile/mycommunity/external/workshops',
						icon: { icon: School }
					},
					{
						id: 'external-events',
						name: 'External Events',
						link: '/personal-profile/mycommunity/external/events',
						icon: { icon: CalendarDays }
					},
					{
						id: 'external-map',
						name: 'External Community Map',
						link: '/personal-profile/mycommunity/external/map',
						icon: { icon: Map }
					}
				]
			}
		]
	},
	{
		id: 'my-settings',
		name: `My Settings`,
		link: '/personal-profile/settings',
		icon: { icon: Settings },
		initialOpen: false,
		subItems: [
			{
				id: 'profile',
				name: 'Change Email',
				link: '/personal-profile/settings/email',
				icon: { icon: User }
			},
			{
				id: 'password',
				name: 'Change Password',
				link: '/personal-profile/settings/password',
				icon: { icon: KeyRound }
			}
		]
	}
];
