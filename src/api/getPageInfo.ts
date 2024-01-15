import axios from 'axios';
import type { PageInfo } from '../types/PageInfo';

let cachedResponse: PageInfo | null = null;
let cachedUrl = '';

export async function getPageInfo(url: string): Promise<PageInfo | null> {
	if (url === cachedUrl && cachedResponse) {
		return cachedResponse;
	}

	try {
		const response = await axios.post<PageInfo>(`${process.env.API_URL}/page-info`, { url });
		cachedUrl = url;
		cachedResponse = response.data;
		console.log(cachedResponse);
		return cachedResponse;
	} catch (error) {
		return null;
	}
}
