import { findEntryBySlug } from '../../api/findEntryBySlug';
import { decryptContent, splitSlug, validateUrl } from '$lib/utilities';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BLOCKED_USER_AGENTS } from '$env/static/public';

export async function load({ params, request }) {
	// Splitting and extracting relevant data
	const slug = params.slug.trim();
	const userAgent = request.headers.get('user-agent');

	// Handling invalid slug or blocked user agents
	if (!slug || (userAgent && isBlocked(userAgent, getBlockedUserAgents()))) {
		return {
			status: 404
		};
	}

	// Getting passkey and entry based on slug

	const splitResult = splitSlug(slug);
	if (!splitResult.slug) return { status: 404 };
	// Finding entry by slug
	const entry = await findEntryBySlug(splitResult.slug);

	// Processing the entry
	if (entry && splitResult.passkey) {
		const decryptedContent = decryptContent(entry.content, splitResult.passkey);

		// Redirecting if URL is valid
		if (decryptedContent && (await validateUrl(decryptedContent))) {
			redirect(302, decryptedContent);
		}

		return { status: 200, entry, slug, passkey: splitResult.passkey };
	} else {
		// Handling entry not found or missing passkey
		return {
			status: entry ? 200 : 404,
			slug: splitResult.slug,
			entry,
			passkey: splitResult.passkey
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
