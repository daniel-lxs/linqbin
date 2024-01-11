import axios from 'axios';
import type { Entry, NewEntryDto } from '../types/Entry';

export async function createNewEntry({
	title,
	content,
	ttl,
	visitCountThreshold
}: NewEntryDto): Promise<Entry> {
	try {
		const result = await axios.post<Entry>('http://localhost:3000/entry', {
			title,
			content,
			visitCountThreshold,
			ttl
		});
		return result.data;
	} catch (error) {
		throw new Error('Failed to create entry');
	}
}
