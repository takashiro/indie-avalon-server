
const CHARS = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./ ~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

/**
 * Generate a random string
 * @param length
 * @param chars Possible characters, default to all printable characters
 * @return A random string
 */
function randstr(length: number, chars = CHARS): string {
	let str = [];
	for (let i = 0; i < length; i++) {
		str.push(chars[Math.floor(Math.random() * chars.length)]);
	}
	return str.join('');
}

export default randstr;
