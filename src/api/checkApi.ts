import axios from 'axios';

export async function checkApi() {
	try {
		const result = await axios.get(process.env.API_URL);
		return result.data;
	} catch (error) {
		return null;
	}
}
