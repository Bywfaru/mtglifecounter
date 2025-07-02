import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { roomCode } = params;

	if (!roomCode) error(404);

	return { roomCode };
};
