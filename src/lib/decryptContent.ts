import CryptoJS from 'crypto-js';
export function decryptContent(encryptedContent: string, passkey: string): string | null {
	try {
		// Attempt to decrypt the content
		const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, passkey).toString(
			CryptoJS.enc.Utf8
		);

		// Check if decryption was successful
		if (decryptedContent !== undefined || decryptedContent !== '') {
			return decryptedContent;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
}
