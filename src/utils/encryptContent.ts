import CryptoJS from 'crypto-js';

export function encryptContent(content: string, passkey: string) {
	return CryptoJS.AES.encrypt(content, passkey).toString();
}
