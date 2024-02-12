export async function hashPasskey(passkey: string) {
	const buffer = new TextEncoder().encode(passkey);
	const hash = await crypto.subtle.digest('SHA-256', buffer);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}
