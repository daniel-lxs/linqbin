import { findEntryBySlug } from '../../api/findEntryBySlug';
export async function load({ params }) {
	const slug = params.slug;

	if (slug) {
		const passkey = slug.split('-')[1];

		if (passkey && passkey.length > 0) {
			const entry = await findEntryBySlug(slug);

			if (entry) {
				return {
					status: 200,
					entry,
					slug,
					passkey
				};
			}

			return {
				status: 404,
				slug,
				passkey
			};
		}

		return {
			status: 404,
			slug,
			passkey: undefined
		};
	}
}
