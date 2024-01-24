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

	const { passkey, entry } = await getPasskeyAndEntry(slug);

	if (entry && passkey) {
		const decryptedContent = decryptContent(entry.content, passkey);

		if (decryptedContent && (await validateUrl(decryptedContent))) {
			redirect(302, decryptedContent);
		}

		return { status: 200, entry, slug, passkey };
	} else {
		return {
			status: entry ? 200 : 404,
			slug,
			entry,
			passkey
		};
	}
}

async function getPasskeyAndEntry(slug: string) {
	const passkey = splitSlug(slug).passkey;
	const entry = await findEntryBySlug(slug);
	return { passkey, entry };
}
