import axios from 'axios';
import { charset64, Entropy } from 'entropy-string';
import type { Entry, NewEntryDto } from '../types/Entry';
import { encryptContent, hashPasskey } from '$lib/utilities';
import { PUBLIC_API_URL } from '$env/static/public';

export async function createNewEntry({
	title,
	content,
	ttl,
	visitCountThreshold
}: Omit<NewEntryDto, 'protoHash'>): Promise<Entry & { passkey: string }> {
	try {
		//Sanitize title
		if (title) {
			title = title.trim();
		}

		const passkey = new Entropy({ charset: charset64, bits: 32 }).string();

		const hash = await hashPasskey(passkey);

		const encryptedContent = encryptContent(content, passkey);

		const newEntry: NewEntryDto = {
			title,
			content: encryptedContent,
			visitCountThreshold,
			protoHash: hash,
			ttl
		};

		const result = await axios.post<Entry>(`${PUBLIC_API_URL}/entry`, newEntry);
		return { ...result.data, passkey };
	} catch (error) {
		console.error(error);
		throw new Error('Failed to create entry');
	}
}
