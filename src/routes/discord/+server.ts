import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	redirect(303, 'https://discord.gg/74Y9B7dTNN');
};
