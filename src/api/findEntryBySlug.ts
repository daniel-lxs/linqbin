import axios from 'axios';
import type { Entry } from '../types/Entry';
import { PUBLIC_API_URL } from '$env/static/public';

export async function findEntryBySlug(slug: string): Promise<Entry | undefined> {
	try {
		const result = await axios.get<Entry>(`${PUBLIC_API_URL}/entry/${slug}`);
		if (!result.data) {
			return undefined;
		}

		return result.data;
	} catch (error) {
		return undefined;
	}
}
