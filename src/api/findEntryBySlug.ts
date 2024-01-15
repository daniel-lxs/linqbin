import axios from 'axios';
import type { Entry } from '../types/Entry';
import { PUBLIC_API_URL } from '$env/static/public';
import { splitSlug } from '$lib/utilities';

export async function findEntryBySlug(slug: string): Promise<Entry | null> {
	try {
		const trimmedSlug = splitSlug(slug).slug;
		const result = await axios.get<Entry>(`${PUBLIC_API_URL}/entry/${trimmedSlug}`);
		if (!result.data) {
			return null;
		}

		return result.data;
	} catch (error) {
		return null;
	}
}
