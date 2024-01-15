import { PUBLIC_API_URL } from '$env/static/public';
import axios from 'axios';

export async function getNewPasskey(): Promise<string | null> {
	const passkey = (await axios.get<{ passkey: string }>(`${PUBLIC_API_URL}/passkey`)).data.passkey;

	if (!passkey) {
		return null;
	}
	return passkey;
}
