export function splitSlug(slug: string) {
	const parts = slug.trim().split('+');
	return {
		slug: parts[0] || null,
		passkey: parts[1] || null
	};
}
