import { findEntryBySlug } from '../../api/findEntryBySlug';
import { decryptContent, splitSlug, validateUrl } from '$lib/utilities';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BLOCKED_USER_AGENTS } from '$env/static/public';

export async function load({ params, request }) {
	const userAgent = request.headers.get('user-agent');

	const paramSlug = params.slug;

	if (!paramSlug || (userAgent && isBlocked(userAgent, getBlockedUserAgents()))) {
		return {
			status: 404
		};
	}

	const { slug, passkey } = splitSlug(paramSlug);

	if (!slug || !passkey) {
		return {
			status: 404,
			slug,
			passkey
		};
	}

	const entry = await findEntryBySlug(slug, passkey);

	if (entry) {
		const decryptedContent = decryptContent(entry.content, passkey);

		// Redirecting if URL is valid
		if (decryptedContent && (await validateUrl(decryptedContent))) {
			redirect(302, decryptedContent);
		}

		return { status: 200, entry, slug, passkey };
	} else {
		// Handling entry not found or missing passkey
		return {
			status: entry ? 200 : 404,
			slug: slug,
			entry,
			passkey: passkey
		};
	}
}

function isBlocked(userAgent: string, blockedUAs: string[]): boolean {
	// Checking if user agent matches any blocked user agents
	const regex = new RegExp(blockedUAs.join('|'), 'i');
	return regex.test(userAgent);
}

function getBlockedUserAgents(): string[] {
	// Splitting the environment variable containing blocked user agents
	return PUBLIC_BLOCKED_USER_AGENTS.split(',');
}
