import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	sendMessageToAllUsers: async ({ request }) => {
		console.log('sendMessageToAllUsers');
	}
};
