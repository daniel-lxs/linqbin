export type NewEntryDto = Pick<Entry, 'title' | 'content' | 'ttl' | 'visitCountThreshold'>;

export type Entry = {
	id: number;
	shortSlug: string;
	slug: string;
	title?: string;
	content: string;
	ttl: number;
	visitCountThreshold: number;
	createdOn: string;
	expiresOn: string;
	deletedOn: string | null;
};
