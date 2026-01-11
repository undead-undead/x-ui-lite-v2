/**
 * Generate a UUID v4
 * Polyfill for crypto.randomUUID() for older browsers
 */
export function generateUUID(): string {
    // Explicit manual generation to strictly ensure 36-character length
    // Format: 8-4-4-4-12
    const hex = '0123456789abcdef';
    let uuid = '';

    // Segment 1: 8 chars
    for (let i = 0; i < 8; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';

    // Segment 2: 4 chars
    for (let i = 0; i < 4; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';

    // Segment 3: 4 chars (Version 4)
    uuid += '4';
    for (let i = 0; i < 3; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';

    // Segment 4: 4 chars (Variant)
    const r = Math.floor(Math.random() * 16);
    uuid += hex[(r & 0x3) | 0x8];
    for (let i = 0; i < 3; i++) uuid += hex[Math.floor(Math.random() * 16)];
    uuid += '-';

    // Segment 5: 12 chars
    for (let i = 0; i < 12; i++) uuid += hex[Math.floor(Math.random() * 16)];

    return uuid;
}
