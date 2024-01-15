import { PUBLIC_API_URL } from '$env/static/public';
import axios from 'axios';

export async function getNewPasskey(): Promise<string | null> {
	try {
		const response = await axios.get<{ passkey: string }>(`${PUBLIC_API_URL}/passkey`);
		const passkey = response.data.passkey;

		if (!passkey) {
			return null;
		}

		return passkey;
	} catch (error) {
		// Handle error here
		console.error('Error occurred while fetching passkey:', error);
		return null;
	}
}
