import axios from 'axios';
import { PUBLIC_API_URL } from '$env/static/public';

export async function checkApi() {
	try {
		const result = await axios.get(PUBLIC_API_URL);
		return result.data;
	} catch (error) {
		return null;
	}
}
