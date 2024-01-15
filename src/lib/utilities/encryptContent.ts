import CryptoJS from 'crypto-js';

export function encryptContent(content: string, passkey: string) {
	// Generate a random salt and IV
	const salt = CryptoJS.lib.WordArray.random(128 / 8);
	const iv = CryptoJS.lib.WordArray.random(128 / 8);

	// Derive key using PBKDF2
	const key = CryptoJS.PBKDF2(passkey, salt, {
		keySize: 256 / 32,
		iterations: 4096
	});

	// Encrypt the content
	const encrypted = CryptoJS.AES.encrypt(content, key, {
		iv: iv,
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC
	});

	// Combine salt, IV, and encrypted data
	const encryptedContent = salt.toString() + iv.toString() + encrypted.toString();

	return encryptedContent;
}
