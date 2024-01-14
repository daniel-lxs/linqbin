import axios from 'axios';

export async function getNewPasskey(): Promise<string | null> {
	const passkey = (await axios.get<{ passkey: string }>('http://localhost:4000/passkey')).data
		.passkey;

	if (!passkey) {
		return null;
	}
	return passkey;
}
