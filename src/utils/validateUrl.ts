import * as yup from 'yup';

export async function validateUrl(input: string): Promise<boolean> {
	const schema = yup.string().url().required();

	try {
		await schema.validate(input);
		return true; // The URL is valid
	} catch (error) {
		return false; // The URL is invalid
	}
}
