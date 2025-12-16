/**
 * Feature: code-tools-suite, Property 6: JWT Parse/Generate Round-Trip
 * Feature: code-tools-suite, Property 7: JWT Expiration Detection
 * Validates: Requirements 4.1, 4.2, 4.3, 4.5
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Base64URL 编码/解码
const base64UrlEncode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return decodeURIComponent(atob(base64).split('').map(c => 
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
};

// JWT 解析
const parseJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2];

  const result = { header, payload, signature };

  if (payload.exp) {
    const expiresAt = new Date(payload.exp * 1000);
    result.expiresAt = expiresAt;
    result.isExpired = Date.now() > expiresAt.getTime();
  }

  return result;
};

// JWT 生成
const generateJWT = (header, payload) => {
  const headerStr = base64UrlEncode(JSON.stringify(header));
  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  return `${headerStr}.${payloadStr}.`;
};

describe('JWT Parse/Generate Round-Trip', () => {
  /**
   * Property 6: JWT Parse/Generate Round-Trip
   * For any valid header and payload objects, generating a JWT then parsing it 
   * should return the original header and payload.
   */
  it('should preserve header and payload after generate then parse', () => {
    const headerArbitrary = fc.record({
      alg: fc.constantFrom('HS256', 'HS384', 'HS512', 'RS256'),
      typ: fc.constant('JWT')
    });

    const payloadArbitrary = fc.record({
      sub: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
      name: fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z\s]+$/.test(s)),
      iat: fc.integer({ min: 1000000000, max: 2000000000 })
    });

    fc.assert(
      fc.property(headerArbitrary, payloadArbitrary, (header, payload) => {
        const jwt = generateJWT(header, payload);
        const parsed = parseJWT(jwt);
        
        return JSON.stringify(parsed.header) === JSON.stringify(header) &&
               JSON.stringify(parsed.payload) === JSON.stringify(payload);
      }),
      { numRuns: 100 }
    );
  });

  it('generated JWT should have three parts separated by dots', () => {
    const headerArbitrary = fc.record({
      alg: fc.constant('HS256'),
      typ: fc.constant('JWT')
    });

    const payloadArbitrary = fc.record({
      sub: fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z0-9]+$/.test(s))
    });

    fc.assert(
      fc.property(headerArbitrary, payloadArbitrary, (header, payload) => {
        const jwt = generateJWT(header, payload);
        const parts = jwt.split('.');
        return parts.length === 3;
      }),
      { numRuns: 100 }
    );
  });
});

describe('JWT Expiration Detection', () => {
  /**
   * Property 7: JWT Expiration Detection
   * For any JWT with an exp claim, the parser should correctly identify 
   * whether the token is expired based on the current time.
   */
  it('should correctly identify expired tokens', () => {
    const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: 'test', exp: pastTimestamp };
    
    const jwt = generateJWT(header, payload);
    const parsed = parseJWT(jwt);
    
    expect(parsed.isExpired).toBe(true);
  });

  it('should correctly identify valid (non-expired) tokens', () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: 'test', exp: futureTimestamp };
    
    const jwt = generateJWT(header, payload);
    const parsed = parseJWT(jwt);
    
    expect(parsed.isExpired).toBe(false);
  });

  it('should handle tokens without exp claim', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: 'test' };
    
    const jwt = generateJWT(header, payload);
    const parsed = parseJWT(jwt);
    
    expect(parsed.isExpired).toBeUndefined();
    expect(parsed.expiresAt).toBeUndefined();
  });

  it('expiration detection should be consistent with current time', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1000000000, max: 3000000000 }), (expTimestamp) => {
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = { sub: 'test', exp: expTimestamp };
        
        const jwt = generateJWT(header, payload);
        const parsed = parseJWT(jwt);
        
        const expectedExpired = Date.now() > expTimestamp * 1000;
        return parsed.isExpired === expectedExpired;
      }),
      { numRuns: 100 }
    );
  });
});
