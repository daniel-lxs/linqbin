import axios from 'axios';
import type { PageInfo } from '../types/PageInfo';
import { PUBLIC_API_URL } from '$env/static/public';

let cachedResponse: PageInfo | null = null;
let cachedUrl = '';

export async function getPageInfo(url: string): Promise<PageInfo | null> {
	if (url === cachedUrl && cachedResponse) {
		return cachedResponse;
	}

	try {
		const response = await axios.post<PageInfo>(`${PUBLIC_API_URL}/page-info`, { url });
		cachedUrl = url;
		cachedResponse = response.data;
		console.log(cachedResponse);
		return cachedResponse;
	} catch (error) {
		return null;
	}
}
