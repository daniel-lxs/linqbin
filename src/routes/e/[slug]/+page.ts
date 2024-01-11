import { findEntryBySlug } from '../../../api/getEntryBySlug';
export async function load({ params }) {
	if (params.slug) {
		const entry = await findEntryBySlug(params.slug);
		if (entry) {
			return {
				status: 200,
				entry
			};
		}
		return {
			status: 404
		};
	}
}
