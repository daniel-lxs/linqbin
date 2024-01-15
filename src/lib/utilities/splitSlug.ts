export function splitSlug(slug: string) {
	const parts = slug.trim().split('+');
	return {
		slug: parts[0],
		passkey: parts[1]
	};
}
