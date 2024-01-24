import { findEntryBySlug } from '../../api/findEntryBySlug';
import { decryptContent, splitSlug, validateUrl } from '$lib/utilities';
import { redirect } from '@sveltejs/kit';
export async function load({ params }) {
	const slug = params.slug;

	if (!slug) {
		return {
			status: 404,
			slug: null,
			entry: null,
			passkey: null
		};
	}

	const passkey = splitSlug(slug).passkey;

	if (!passkey || passkey.length === 0) {
		return {
			status: 404,
			slug,
			entry: null,
			passkey: null
		};
	}

	const entry = await findEntryBySlug(slug);

	if (!entry) {
		return {
			status: 404,
			slug,
			entry: null,
			passkey
		};
	}

	const content = decryptContent(entry.content, passkey);
	if (content && (await validateUrl(content))) {
		redirect(302, content);
	}

	return {
		status: 200,
		entry,
		slug,
		passkey
	};
}
