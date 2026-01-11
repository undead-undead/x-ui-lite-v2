/**
 * Generate a UUID v4
 * Polyfill for crypto.randomUUID() for older browsers
 */
export function generateUUID(): string {
    const hex = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 8; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';
    for (let i = 0; i < 4; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';
    uuid += '4';
    for (let i = 0; i < 3; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';
    const r = Math.floor(Math.random() * 16);
    uuid += hex[(r & 0x3) | 0x8];
    for (let i = 0; i < 3; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';
    for (let i = 0; i < 12; i++) uuid += hex[Math.floor(Math.random() * 16)];

    return uuid;
}
