import { findEntryBySlug } from '../../api/findEntryBySlug';
import { splitSlug } from '$lib/utilities';
export async function load({ params }) {
	const slug = params.slug;

	if (slug) {
		const passkey = splitSlug(slug).passkey;

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
				entry: null,
				passkey
			};
		}

		return {
			status: 404,
			slug,
			entry: null,
			passkey: null
		};
	}

	return {
		status: 404,
		slug: null,
		entry: null,
		passkey: null
	};
}
