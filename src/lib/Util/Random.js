const letters = 'abcdefghijklmnopqrstuvwxyz';
const lettersUpper = letters.toUpperCase();
const numbers = '0123456789';

export function randomString(length, chars = letters + lettersUpper + numbers) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
/*
 * get unique name
 */
export function getUName(prefix) {
    let time = new Date().getTime().toString(36);
    return (prefix ? prefix : "") + Math.random().toString(36).substring(3,5) + time;
}