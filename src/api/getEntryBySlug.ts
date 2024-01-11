import axios from 'axios';
import type { Entry } from '../types/Entry';

export async function findEntryBySlug(slug: string): Promise<Entry | null> {
	try {
		const result = await axios.get<Entry>(`http://localhost:3000/entry/${slug}`);
		if (!result.data) {
			return null;
		}

		return result.data;
	} catch (error) {
		return null;
	}
}
