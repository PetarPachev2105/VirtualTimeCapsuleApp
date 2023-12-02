import pako from 'pako';
import { Buffer } from 'buffer';

export default class CompressorHelper {
    static compress(data) {
        const compressed = pako.gzip(JSON.stringify(data));

        // Convert the compressed data to a Base64 string (for sending as text)
        return Buffer.from(compressed).toString('base64');
    }

    static decompress(data) {
        // Convert the Base64 string back to binary
        const input = Buffer.from(data, 'base64');

        // Decompress the data
        const decompressed = pako.inflate(input, { to: 'string' });

        return JSON.parse(decompressed);
    }
}