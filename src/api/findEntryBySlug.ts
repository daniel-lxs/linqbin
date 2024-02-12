import axios from 'axios';
import type { Entry } from '../types/Entry';
import { PUBLIC_API_URL } from '$env/static/public';
import { hashPasskey } from '$lib/utilities';

export async function findEntryBySlug(slug: string, passkey: string): Promise<Entry | undefined> {
	try {
		if (!slug || !passkey) {
			return undefined;
		}

		const hash = await hashPasskey(passkey);

		const result = await axios.get<Entry>(`${PUBLIC_API_URL}/entry/${slug}?hash=${hash}`);

		if (!result.data) {
			return undefined;
		}

		return result.data;
	} catch (error) {
		return undefined;
	}
}
