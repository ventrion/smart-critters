/**
 * Training Runtime — public surface.
 *
 * The single testable seam for the PoC: Content Pack lookup, Session
 * construction (shuffle + take 8), scoring, complete/Exit XP, and install
 * preferences behind an injected persistence port.
 */

export * from './types.js';
export * from './scoring.js';
export * from './session.js';
export * from './persistence.js';
export * from './packs.js';
export * from './runtime.js';
