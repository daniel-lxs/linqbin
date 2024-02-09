export function splitSlug(slug: string): { slug?: string; passkey?: string } {
	slug = slug.trim();
	// Check if slug is exactly 6 chars long
	if (slug.length === 6) {
		return { slug };
	}

	// Try to split the slug
	const parts = slug.split('+');

	// If there are more than 2 parts, return undefined
	if (parts.length > 2) {
		return {};
	}

	// Return undefined if any of the parts is not 6 chars long
	if (parts.some((part) => part.length !== 6)) {
		return {};
	}

	// Return the parts
	return { slug: parts[0], passkey: parts[1] };
}
