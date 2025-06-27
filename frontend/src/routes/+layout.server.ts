import type { LayoutServerLoad } from './$types';

const getRandomCommanderImage = async () => {
	const API_ROUTE = 'https://api.scryfall.com/cards/random?q=is%3Acommander';
	const randomCommander = await fetch(API_ROUTE, {
		headers: {
			'content-type': 'application/json'
		}
	}).then((res) => {
		if (!res.ok) throw Error('Failed to fetch random commander');

		return res.json();
	}).catch((error) => {
		console.error(error);

		return null;
	});

	if (!randomCommander) return null;

	return randomCommander.image_uris?.art_crop || randomCommander.image_uris?.normal || randomCommander.image_uris?.large;
}

export const load: LayoutServerLoad = async () => {
	return {
		backgroundImage: await getRandomCommanderImage(),
	};
};