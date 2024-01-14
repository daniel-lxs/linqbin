import axios from 'axios';
import type { Entry } from '../types/Entry';

export async function findEntryBySlug(slug: string): Promise<Entry | null> {
	try {
		const trimmedSlug = slug.split('-')[0];
		const result = await axios.get<Entry>(`http://localhost:4000/entry/${trimmedSlug}`);
		if (!result.data) {
			return null;
		}

		return result.data;
	} catch (error) {
		return null;
	}
}
