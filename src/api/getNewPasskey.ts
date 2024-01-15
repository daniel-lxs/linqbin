import axios from 'axios';

export async function getNewPasskey(): Promise<string | null> {
	const passkey = (await axios.get<{ passkey: string }>(`${process.env.API_URL}/passkey`)).data
		.passkey;

	if (!passkey) {
		return null;
	}
	return passkey;
}
