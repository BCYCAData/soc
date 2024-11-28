import type { SupabaseClient, User } from '@supabase/supabase-js';
import { error, type Handle } from '@sveltejs/kit';

export const hasAdminPermission = (permissions: string | string[]) => {
	const permissionArray = typeof permissions === 'string' ? permissions.split(',') : permissions;
	return (
		Array.isArray(permissionArray) &&
		permissionArray.some((permission) => permission.trim().startsWith('admin'))
	);
};

export async function getUserPermissions(
	supabase: SupabaseClient,
	userId: string | undefined,
	user_roles: string[]
) {
	const { data: permissionData, error: permissionError } = await supabase
		.from('role_permissions')
		.select('permission')
		.in('role', user_roles);

	if (permissionError) {
		console.error('Error fetching permission:', permissionError);
		error(401, 'Failed to fetch permissions');
	}
	const permission = [...new Set(permissionData?.map((p) => p.permission))].join(',');

	if (!permissionData || !permission.includes('admin')) {
		console.error('Forbidden attempt on /admin by userId:', userId);
		error(403, 'Forbidden');
	}

	return permission;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const requests = new Map<string, number[]>();

export function rateLimit(ip: string) {
	const now = Date.now();
	const windowStart = now - WINDOW_MS;

	const userRequests = requests.get(ip) || [];
	const recentRequests = userRequests.filter((time) => time > windowStart);

	if (recentRequests.length >= MAX_REQUESTS) {
		throw error(429, 'Too many requests');
	}

	recentRequests.push(now);
	requests.set(ip, recentRequests);
}

export const validateRequest: Handle = async ({ event, resolve }) => {
	const contentType = event.request.headers.get('content-type');

	if (event.request.method === 'POST' && contentType !== 'application/json') {
		throw error(415, 'Unsupported Media Type');
	}

	// Add CSRF protection
	const csrfToken = event.request.headers.get('x-csrf-token');
	if (event.request.method !== 'GET' && !csrfToken) {
		throw error(403, 'CSRF token missing');
	}

	return resolve(event);
};
