import { findEntryBySlug } from '../../api/findEntryBySlug';
import { decryptContent, splitSlug, validateUrl } from '$lib/utilities';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BLOCKED_USER_AGENTS } from '$env/static/public';
export async function load({ params, request }) {
	const blockedUAs = PUBLIC_BLOCKED_USER_AGENTS.split(',');
	const userAgent = request.headers.get('user-agent');

	const slug = params.slug;

	console.log(`User agent: ${userAgent} blocked: ${blockedUAs}`);

	if (!slug || (userAgent && isBlocked(userAgent, blockedUAs))) {
		console.log(`User agent blocked: ${userAgent}`);
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

function isBlocked(userAgent: string, blockedUAs: string[]): boolean {
	const regex = new RegExp(blockedUAs.join('|'), 'i');
	return regex.test(userAgent);
}
