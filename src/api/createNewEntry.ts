import axios from 'axios';
import type { Entry, NewEntryDto } from '../types/Entry';
import { getNewPasskey } from './getNewPasskey';
import { encryptContent } from '$lib/utilities';
import { PUBLIC_API_URL } from '$env/static/public';

export async function createNewEntry({
	title,
	content,
	ttl,
	visitCountThreshold
}: NewEntryDto): Promise<Entry & { passkey: string }> {
	try {
		//Sanitize title
		if (title) {
			title = title.trim();
		}

		const passkey = await getNewPasskey();

		if (!passkey) {
			throw new Error('Failed to create entry');
		}

		const encryptedContent = encryptContent(content, passkey);

		const result = await axios.post<Entry>(`${PUBLIC_API_URL}/entry`, {
			title,
			content: encryptedContent,
			visitCountThreshold,
			ttl
		});
		return { ...result.data, passkey };
	} catch (error) {
		console.error(error);
		throw new Error('Failed to create entry');
	}
}
